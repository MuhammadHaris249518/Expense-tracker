from db import db
from datetime import timedelta,datetime, timezone
import os
from bson import ObjectId
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
load_dotenv()
if not os.getenv("GEMINI_API_KEY"):
    raise ValueError("GEMINI_API_KEY not found in environment variables.")
llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key=os.getenv("GEMINI_API_KEY"))
async def get_transactions(user_id: str):
    # Fetch all transactions to get accurate totals instead of just 7 days
    # (Since total amount in DB likely represents more than recent 7 days, this matches frontend)
    transaction = []
    
    cursor = db.transactions.find({
        "user": ObjectId(user_id)
    }).limit(100) # limit to prevent huge response, or adjust as needed

    async for k in cursor:
        k["_id"] = str(k["_id"])
        transaction.append(k)
    return transaction
async def calcualte_summary(user_id:str):
    data=await get_transactions(user_id)
    total_income=0
    total_expense=0
    for t in data:
        amount=float(t.get("amount",0))
        choice = t.get("choice", "").lower()
        if choice == "income":
           total_income+=amount
        else:
           total_expense+=amount
    
    return{
        "income":total_income,
        "expense":total_expense,
        "balance":total_income-total_expense

    }
async def generate_ai_insights(summary):
     prompt = f"""
    Income: ${summary['income']}
    Expenses: ${summary['expense']}
    Total Balance: ${summary['balance']}

    Give a short, friendly, and actionable financial advice based on these numbers. Provide it in maximum 3 bullet points.
    """
    
     response=llm.invoke(prompt)
     return response.content
