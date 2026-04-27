import smtplib
from email.message import EmailMessage
from dotenv import load_dotenv
import os

load_dotenv()

def sendEmail(to_email, subject, body, file_path):
    """Send email with PDF attachment"""
    
    # Get sender email and password from .env
    sender_email = os.getenv("EMAIL_FROM")
    email_password = os.getenv("EMAIL_PASSWORD")
    email_user = os.getenv("EMAIL_USER")
    
    # Validate configuration
    if not sender_email:
        raise ValueError("EMAIL_FROM not found in environment variables.")
    if not email_password:
        raise ValueError("EMAIL_PASSWORD not found in environment variables.")
    if not email_user:
        raise ValueError("EMAIL_USER not found in environment variables.")
    
    # Create email message
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = sender_email  # Use EMAIL_FROM from .env
    msg["To"] = to_email

    msg.set_content(body)

    # Attach PDF file
    with open(file_path, 'rb') as f:
        file_data = f.read()

    msg.add_attachment(
        file_data,
        maintype="application",
        subtype="pdf",
        filename="report.pdf"
    )
    
    # Send email via Gmail SMTP
    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(email_user, email_password)
            smtp.send_message(msg)
            print(f"[EMAIL] Successfully sent report to {to_email}")
    except Exception as e:
        print(f"[EMAIL] Failed to send email to {to_email}: {str(e)}")
        raise
