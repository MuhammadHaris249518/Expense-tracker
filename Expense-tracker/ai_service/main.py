from fastapi.responses import FileResponse
from fastapi import FastAPI, BackgroundTasks, Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from google import genai
from tools import calcualte_summary,generate_ai_insights
from pdfmain import generate_pdf
from email_service import sendEmail
from contextlib import asynccontextmanager
from scheduler import start_scheduler
from db import db
from bson import ObjectId

load_dotenv()

# Verify API key exists
if not os.getenv("GEMINI_API_KEY"):
    raise ValueError("GEMINI_API_KEY not found in environment variables.")

# Startup event handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("[APP] Starting FastAPI server...")
    start_scheduler()
    yield
    # Shutdown
    print("[APP] Shutting down FastAPI server...")

app = FastAPI(lifespan=lifespan)

# Setup SlowAPI Limiter (Tracking by IP address)
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler) # type: ignore

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

class expenseTra(BaseModel):
    title: str

# Helper function to get user email from database
async def get_user_email(user_id: str) -> str:
    """Fetch user email from database"""
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if user and user.get("email"):
            return user["email"]
        else:
            raise ValueError(f"User {user_id} not found or has no email")
    except Exception as e:
        print(f"[ERROR] Failed to get user email: {str(e)}")
        raise

@app.post("/category")
@limiter.limit("20/minute") # Allow 20 quick categorizations per minute per user
async def generateresponse(item: expenseTra, request: Request):
    try:
        prompt = f"""
        Categorize this expense: {item.title}

        Choose ONLY one:
        food, travel, entertainment, transport

        Return ONLY one word.
        """

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
    
        category = response.text.strip().lower()  # ty:ignore[unresolved-attribute]

        return {"category": category}

    except Exception as e:
        return {"error": str(e)}

@app.get("/download-report")
@limiter.limit("5/minute") # Strict limit on resource intensive PDF generation
async def downloadreport(user_id: str, background_tasks: BackgroundTasks, request: Request):
      summary=await calcualte_summary(user_id)
      insights=await generate_ai_insights(summary)
      from datetime import datetime
      filename = f"report_{user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
      filepath=generate_pdf(summary,insights,filename)
      
      # Schedule file deletion after it is returned to the user
      background_tasks.add_task(os.remove, filepath)
      
      return FileResponse(filepath,media_type="application/pdf",filename="report.pdf")

@app.get("/send-report")
@limiter.limit("5/minute") # Strict limit on email sending
async def send_report(user_id: str, background_tasks: BackgroundTasks, request: Request):
    try:
        # Get user email from database
        user_email = await get_user_email(user_id)
        print(f"[REPORT] Sending report to user {user_id} at {user_email}")
        
        # 1. summary
        summary = await calcualte_summary(user_id)

        # 2. insights
        insights = await generate_ai_insights(summary)

        # 3. PDF
        from datetime import datetime
        filename = f"report_{user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        filepath = generate_pdf(summary, insights, filename)

        # 4. email - Send to user's email, not hardcoded
        sendEmail(
            to_email=user_email,
            subject="🚀 Your Financial Report",
            body="Your daily financial summary is attached.",
            file_path=filepath
        )
        
        # Delete the file immediately after sending the email
        if os.path.exists(filepath):
            os.remove(filepath)
        
        print(f"[REPORT] Report successfully sent to {user_email}")
        return {"status": "sent", "email": user_email}

    except Exception as e:
        print(f"[ERROR] Failed to send report: {str(e)}")
        # Attempt to clean up even if sending failed
        if 'filepath' in locals() and os.path.exists(filepath):
            os.remove(filepath)
        return {"error": str(e)}