
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from tools import calcualte_summary, generate_ai_insights
from pdfmain import generate_pdf
from email_service import sendEmail
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

scheduler = AsyncIOScheduler()

async def send_daily_reports():
    try:
        print(f"[SCHEDULER] Daily report job started at {datetime.now()}")
        
        # Get all users from database and send reports
        from db import db
        users = await db.users.find().to_list(None)
        
        for user in users:
            try:
                user_id = str(user["_id"])
                
                # Calculate summary
                summary = await calcualte_summary(user_id)
                
                # Generate insights
                insights = await generate_ai_insights(summary)
                
                # Generate PDF
                filename = f"report_{user_id}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
                filepath = generate_pdf(summary, insights, filename)
                
                # Send email
                user_email = user.get("email", "")
                if user_email:
                    sendEmail(
                        to_email=user_email,
                        subject="📊 Your Daily Expense Report",
                        body="Your daily financial summary is attached.",
                        file_path=filepath
                    )
                    print(f"[SCHEDULER] Report sent to {user_email}")
                else:
                    print(f"[SCHEDULER] No email found for user {user_id}")
                
                # Cleanup PDF after sending
                if os.path.exists(filepath):
                    os.remove(filepath)
                    
            except Exception as user_error:
                # Attempt to clean up on error
                if 'filepath' in locals() and os.path.exists(filepath):
                    os.remove(filepath)
                print(f"[SCHEDULER] Error sending report for user {user.get('_id')}: {str(user_error)}")
        
        print(f"[SCHEDULER] Daily reports completed at {datetime.now()}")
        
    except Exception as e:
        print(f"[SCHEDULER] Error in send_daily_reports: {str(e)}")

# Schedule job to run daily at configured time (default 6 PM / 18:00)
schedule_hour = int(os.getenv("DAILY_REPORT_TIME", "18:00").split(":")[0])
schedule_minute = int(os.getenv("DAILY_REPORT_TIME", "18:00").split(":")[1])

def start_scheduler():
    """Start the APScheduler"""
    try:
        if not scheduler.running:
            scheduler.add_job(
                send_daily_reports, 
                'cron', 
                hour=schedule_hour, 
                minute=schedule_minute,
                id='daily_report_job'
            )
            scheduler.start()
            print(f"[SCHEDULER] Started - Daily reports scheduled for {schedule_hour:02d}:{schedule_minute:02d}")
    except Exception as e:
        print(f"[SCHEDULER] Error starting scheduler: {str(e)}")
