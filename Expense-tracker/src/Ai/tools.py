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
async def get_transactions(user_id):
    one_week_ago = datetime.now(timezone.utc) - timedelta(days=7)
    transaction=[]

    cursor=db.transactions.find({
        "user":ObjectId(user_id),
        "date":{"$gte":one_week_ago}
   } )
    async for k in cursor:
        k["_id"]=str(k["_id"])
        transaction.append(k)
    return transaction
async def calcualte_summary(user_id:str):
    data=await get_transactions(user_id)
    total_income=0
    total_expense=0
    for t in data:
        amount=float(t.get("amount",0))
        if(t.get("choice")=="income"):
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
    income: {summary['income']}W
    expense: {summary['expense']}
    balance: {summary['balance']}

    Give short financial advice.
    """
    
     response=llm.invoke(prompt)
     return response.content
