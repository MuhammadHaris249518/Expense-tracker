# 📖 Expense Tracker Setup Guide

## Prerequisites

- Node.js (v16+)
- Python (v3.8+)
- MongoDB running locally or Atlas connection
- Gmail account with app password
- Google Gemini API key

---

## ⚙️ Step 1: Setup Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your actual values in `.env`:
```bash
MONGODB_URI=mongodb://localhost:27017/ExpenseTrackerDB
JWT_SECRET=generate_a_random_32_char_string
EMAIL_FROM=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
GEMINI_API_KEY=your_api_key
DAILY_REPORT_TIME=18:00
```

### **Getting Gmail App Password:**
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate app password for "Mail"
4. Use this 16-char password in `.env`

### **Getting Gemini API Key:**
1. Go to https://makersuite.google.com/app/apikey
2. Create new API key
3. Copy and paste in `.env`

---

## 📦 Step 2: Install Dependencies

### Backend (Node.js):
```bash
cd Expense-tracker/src/backend
npm install
```

### Python (FastAPI):
```bash
cd Expense-tracker/src/Ai
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend:
```bash
cd Expense-tracker
npm install
```

---

## 🚀 Step 3: Start Services

### Terminal 1 - Frontend (React):
```bash
cd Expense-tracker
npm run dev
# Runs on http://localhost:5173
```

### Terminal 2 - Backend (Node.js):
```bash
cd Expense-tracker/src/backend
npm run dev
# Runs on http://localhost:3000
```

### Terminal 3 - Python (FastAPI):
```bash
cd Expense-tracker/src/Ai
source venv/bin/activate
python main.py
# Runs on http://localhost:8000
```

### Terminal 4 - MongoDB:
```bash
# Make sure MongoDB is running
# If using local: mongod
# If using Atlas: ensure connection string in .env
```

---

## ✅ Verification

1. **Frontend loads:** http://localhost:5173
2. **Backend responds:** `curl http://localhost:3000/transactions`
3. **Database connected:** Check console for connection message
4. **Email configured:** Test with manual trigger

---

## 🧪 Testing Workflows

### Test Signup/Login:
```bash
1. Go to http://localhost:5173
2. Click "Signup"
3. Create account (email: test@gmail.com, password: test123)
4. Login with credentials
5. Should see dashboard
```

### Test Add Transaction:
```bash
1. Dashboard page
2. Fill form: title, amount, category, date
3. Click "Add"
4. Check if appears in list
5. Refresh page - should persist
```

### Test Edit Transaction:
```bash
1. Click edit button on transaction
2. Modify values
3. Click save
4. Verify changes
```

### Test Delete Transaction:
```bash
1. Click delete button
2. Confirm deletion
3. Verify removed from list
```

### Test Daily Email:
```bash
# Trigger manually via API:
curl -X GET http://localhost:8000/send-report

# Or wait until scheduled time (6 PM default)
```

---

## 🐛 Troubleshooting

### Port Already in Use:
```bash
# Find process using port 3000
lsof -i :3000
# Kill process
kill -9 <PID>
```

### Database Connection Failed:
```bash
# Check MongoDB running:
mongosh
# Or update connection string in .env
```

### Email Not Sending:
```bash
# Verify credentials in .env
# Check Gmail app password is correct
# Enable "Less secure app" if needed
```

### Frontend Not Loading:
```bash
# Clear node_modules
rm -rf node_modules
npm install
npm run dev
```

---

## 📝 Important Files

| File | Purpose |
|------|---------|
| `.env` | Credentials (NEVER commit) |
| `.env.example` | Template (commit this) |
| `src/backend/index.js` | Express server |
| `src/Ai/main.py` | FastAPI server |
| `src/frontend/App.tsx` | React app |
| `KPI_ONE_DAY_COMPLETE.md` | Implementation guide |

---

## ✨ Common Commands

```bash
# Start everything
npm run dev:all

# Run backend tests
cd src/backend && npm test

# Run Python tests
cd src/Ai && python -m pytest

# Build frontend
cd Expense-tracker && npm run build

# Check database
mongosh
show databases
use ExpenseTrackerDB
show collections
db.transactions.find()
```

---

## 📞 Support

1. Check console errors
2. Verify all services running
3. Check `.env` has correct values
4. Review `KPI_ONE_DAY_COMPLETE.md`
5. Check database is connected

---

**Ready to develop! Happy coding! 🚀**
