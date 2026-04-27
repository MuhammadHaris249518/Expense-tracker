# 📧 Email Configuration Guide

## Overview
The app sends automated daily email reports with PDF expense insights to users at a scheduled time (default: 6 PM).

---

## 🔧 Email Setup

### Option 1: Gmail (Recommended)

#### Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/
2. Click "Security" (left panel)
3. Scroll to "2-Step Verification"
4. Click "Get Started"
5. Follow the setup process

#### Step 2: Generate App Password
1. In Google Account settings
2. Go to Security > App passwords
3. Select "Mail" and "Windows Computer"
4. Google will generate a 16-character password
5. Copy this password

#### Step 3: Add to `.env`
```bash
EMAIL_FROM=your_email@gmail.com
EMAIL_PASSWORD=your_16_char_app_password_here
```

**Example:**
```bash
EMAIL_FROM=john.doe@gmail.com
EMAIL_PASSWORD=qwer tyui asdf ghjk
```

### Option 2: Other Email Providers

#### Gmail Alternative (Less Secure):
If 2FA not available:
1. Go to https://myaccount.google.com/lesssecureapps
2. Enable "Less secure app access"
3. Use your actual Gmail password

#### Outlook:
```bash
EMAIL_FROM=your_email@outlook.com
EMAIL_PASSWORD=your_outlook_password
# Change SMTP in email_service.py to smtp.office365.com:587
```

#### Custom SMTP:
```bash
# Update email_service.py line 26:
with smtplib.SMTP_SSL("your.smtp.server", 465) as smtp:
```

---

## 📅 Scheduling Configuration

### Daily Email Time
Edit `.env`:
```bash
DAILY_REPORT_TIME=18:00  # 6 PM (24-hour format)
```

**Examples:**
```bash
DAILY_REPORT_TIME=09:00  # 9 AM
DAILY_REPORT_TIME=12:00  # 12 PM (Noon)
DAILY_REPORT_TIME=18:00  # 6 PM
DAILY_REPORT_TIME=20:30  # 8:30 PM
```

---

## 🧪 Testing Email

### Manual Test via API:
```bash
curl -X GET http://localhost:8000/send-report
```

### Python Direct Test:
```python
from src.Ai.email_service import sendEmail

# Test email
sendEmail(
    to_email="your_email@gmail.com",
    subject="Test Email",
    body="This is a test email",
    file_path=None
)
```

### With PDF:
```python
from src.Ai.email_service import sendEmail
from src.Ai.pdfmain import generate_pdf

# Generate test PDF
summary = {
    "income": 5000,
    "expense": 2500,
    "balance": 2500,
    "by_category": {"food": 100, "transport": 50}
}

insights = "Your spending is good this week!"

filepath = generate_pdf(summary, insights, "test_report.pdf")

# Send with attachment
sendEmail(
    to_email="your_email@gmail.com",
    subject="Test Report with PDF",
    body="Test email with PDF attachment",
    file_path=filepath
)
```

---

## 🐛 Troubleshooting

### Error: "530 5.7.0 Must issue a STARTTLS command first"
**Solution:** Use SMTP_SSL instead of SMTP (already done in code)

### Error: "535 5.7.8 Username and password not accepted"
**Solution:** 
- Verify email and password in `.env`
- Use app password, not Gmail password
- Enable 2FA first
- Check password has no extra spaces

### Error: "smtplib.SMTPAuthenticationError"
**Solution:**
- Verify credentials
- Try enabling "Less secure app access"
- Generate new app password
- Check `.env` format

### Email Not Sending at Scheduled Time
**Solution:**
- Verify scheduler running
- Check logs for scheduler errors
- Verify DAILY_REPORT_TIME format (HH:MM)
- Check timezone settings
- Verify email credentials work

### PDF Not Attaching
**Solution:**
- Check file exists at filepath
- Verify file_path passed correctly
- Check file permissions
- Verify disk space available

---

## 📊 Email Template

The email sent will look like:

```
Subject: 📊 Your Daily Expense Report - April 26, 2026

Body:
---

Hi User,

Here's your daily expense summary:

YESTERDAY'S SUMMARY:
- Total Income: $2,000.00
- Total Expenses: $450.50
- Balance: $1,549.50

CATEGORY BREAKDOWN:
- Food: $150.00 (33%)
- Transport: $75.50 (17%)
- Entertainment: $225.00 (50%)

AI INSIGHTS:
Your spending pattern shows a 15% increase in entertainment expenses compared to last week. 
Consider reviewing subscriptions and discretionary spending to optimize your budget.

PDF Report Attached ✓

---
Best regards,
Expense Tracker Team
```

---

## 🔐 Security Notes

1. **Never hardcode credentials** - Always use `.env`
2. **Use app passwords** - Never use actual Gmail password
3. **HTTPOnly cookies** - Tokens stored securely
4. **CORS configured** - Only allow trusted origins
5. **Email addresses hashed** - Sensitive data protected

---

## 📝 Email Service Code

Location: `src/Ai/email_service.py`

```python
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email import encoders
import os
from dotenv import load_dotenv

load_dotenv()

def sendEmail(to_email, subject, body, file_path=None):
    """Send email with optional PDF attachment"""
    
    try:
        # Create message
        msg = MIMEMultipart()
        msg["Subject"] = subject
        msg["From"] = os.getenv("EMAIL_FROM")
        msg["To"] = to_email
        
        # Add body
        msg.attach(MIMEText(body, "plain"))
        
        # Attach PDF if provided
        if file_path and os.path.exists(file_path):
            with open(file_path, 'rb') as attachment:
                part = MIMEBase("application", "octet-stream")
                part.set_payload(attachment.read())
            
            encoders.encode_base64(part)
            part.add_header(
                "Content-Disposition",
                f"attachment; filename= {os.path.basename(file_path)}"
            )
            msg.attach(part)
        
        # Send email
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(
                os.getenv("EMAIL_FROM"),
                os.getenv("EMAIL_PASSWORD")
            )
            smtp.send_message(msg)
        
        print(f"✅ Email sent to {to_email}")
        return True
    
    except Exception as e:
        print(f"❌ Error sending email: {e}")
        return False
```

---

## 🔄 Daily Report Flow

```
1. Scheduler triggers at configured time (6 PM)
   ↓
2. Gets all users from database
   ↓
3. For each user:
   a. Fetch yesterday's transactions
   b. Calculate total income/expense
   c. Generate AI insights
   d. Create PDF report
   e. Send email with PDF
   ↓
4. Log success/failure
```

---

## ✅ Verification Checklist

Before going live:
- [ ] `.env` has EMAIL_FROM and EMAIL_PASSWORD
- [ ] App password created (not Gmail password)
- [ ] 2FA enabled on Gmail
- [ ] Manual test email sent successfully
- [ ] PDF attachment working
- [ ] Scheduler running
- [ ] Logs show email sending

---

## 💡 Tips

1. **Test immediately:** Don't wait until scheduled time
2. **Check spam folder:** Might be marked as spam initially
3. **Use test email first:** Send to yourself before production
4. **Monitor logs:** Check `console.log` for email sending
5. **Verify timezone:** System timezone affects scheduling

---

**Need Help?**

1. Check console for error messages
2. Verify `.env` values
3. Run manual test via API
4. Check email credentials
5. Review error logs

---

**Last Updated: April 26, 2026**
