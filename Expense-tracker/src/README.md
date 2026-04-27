# 💰 Expense Tracker

> **A production-grade MERN stack financial management application with automated microservices for daily PDF email delivery, real-time expense analytics, Google OAuth, and multi-format data export.**

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

</div>

---

## ⚡ Core Strengths — What Makes This Different

This is not a basic CRUD expense app. The Expense Tracker is built around **three production-grade microservices** that automate the financial reporting experience:

---

### 📬 Microservice 1 — Daily PDF Email Delivery

> The flagship feature of this application.

Every day at 8:00 AM, an automated background service powered by **Node-Cron** and **Nodemailer** runs a scheduled job that:

1. 🔍 Queries MongoDB for all registered users
2. 📊 Fetches each user's expenses from the previous 24 hours
3. 📄 Generates a beautifully formatted **PDF financial summary** using PDFKit
4. 📧 Attaches the PDF and delivers it directly to each user's email inbox
5. 📝 Logs delivery status for debugging and monitoring

This is a fully automated, zero-user-interaction financial reporting pipeline — the same pattern used by banks and financial SaaS products to deliver statements to customers.

```
Cron Schedule (Daily 8AM)
        │
        ▼
  Query All Users
        │
        ▼
  Fetch Daily Expenses (MongoDB)
        │
        ▼
  Generate PDF Report (PDFKit)
        │
        ▼
  Send Email with Attachment (Nodemailer + Gmail)
        │
        ▼
  Log Delivery Result
```

---

### ✉️ Microservice 2 — OTP Email Verification

On every new registration, a **One-Time Password (OTP)** is generated, stored with an expiry timestamp, and delivered to the user's inbox via Nodemailer. The user must verify their email before gaining access to the application. This microservice runs independently of the main Express request cycle.

```
User Registers → OTP Generated (6-digit) → Nodemailer Sends Email
                                                      │
                                     User Enters OTP ◄┘
                                              │
                              ┌───────────────┴───────────────┐
                         Valid + Not Expired?           Invalid / Expired
                              │                               │
                     Account Activated ✅              Error Returned ❌
```

---

### 🔐 Microservice 3 — Password Reset Email Flow

A secure token-based password reset pipeline:

1. User requests reset → unique token generated and stored in DB with expiry
2. Nodemailer sends a time-limited reset link to the user's email
3. User clicks the link → token verified → password updated and token invalidated

---

## 🗂️ Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)

---

## ✅ Features

### 🔑 Authentication & Security
- 📝 User registration with **OTP email verification**
- 🔐 Login with **JWT authentication** (access tokens)
- 🌐 **Google OAuth 2.0** login via Passport.js
- 🔑 **Forgot password** email flow with secure token reset
- 🛡️ Protected routes on both frontend and backend

### 💸 Expense Management
- ➕ Add, ✏️ Edit, 🗑️ Delete expenses with category tagging
- 🏷️ Custom expense categories per user
- 🔍 Search expenses by name, category, or description
- 📅 Filter by **weekly / monthly / yearly** date ranges

### 📊 Analytics & Dashboard
- 📈 Real-time dashboard with **pie and bar charts**
- 💰 Income vs expense balance overview
- 🔝 Top spending category highlights
- 📆 Day-by-day spending timeline

### 📤 Export & Reports
- 📄 **On-demand PDF export** of expense history
- 📊 **Excel (XLSX) export** for spreadsheet analysis
- 📬 **Daily automated PDF email** sent to every user (microservice)

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React.js 18 | SPA user interface |
| **UI Library** | Ant Design / Bootstrap | Components & layout |
| **State** | Context API | Global state management |
| **Charts** | Chart.js / Recharts | Data visualisation |
| **Backend** | Node.js + Express.js | REST API server |
| **Database** | MongoDB + Mongoose | Data persistence |
| **Authentication** | JWT + Passport.js | Auth & SSO |
| **Email** | Nodemailer + Gmail | Transactional emails |
| **Scheduling** | Node-Cron | Automated daily jobs |
| **PDF** | PDFKit | PDF generation |
| **Excel** | xlsx / ExcelJS | Spreadsheet export |
| **OAuth** | Google OAuth 2.0 | Social login |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (React SPA)                  │
│    Dashboard │ Auth │ Expenses │ Reports │ Settings     │
└─────────────────────────┬───────────────────────────────┘
                          │  HTTP / REST
┌─────────────────────────▼───────────────────────────────┐
│                  EXPRESS REST API                        │
│  Routes → Controllers → Middleware → Mongoose Models    │
└──────┬─────────────────────────────────────┬────────────┘
       │                                     │
┌──────▼──────┐                    ┌─────────▼────────────┐
│   MongoDB   │                    │   MICROSERVICES       │
│  (Mongoose) │                    │                       │
│             │                    │  📬 Daily PDF Emailer │
│  • Users    │◄───────────────────│  (Node-Cron + PDFKit  │
│  • Expenses │                    │   + Nodemailer)       │
│  • Categories│                   │                       │
└─────────────┘                    │  ✉️  OTP Verifier     │
                                   │  🔑 Password Reset    │
                                   └──────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Gmail account (for email features)
- Google Cloud Console project (for OAuth)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/MuhammadHaris249518/Expense-tracker.git
cd Expense-tracker/Expense-tracker

# 2. Install backend dependencies
cd backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install
```

### Running Locally

```bash
# Start MongoDB (if running locally)
mongod

# In one terminal — start the backend
cd backend
npm run dev

# In another terminal — start the frontend
cd frontend
npm start
```

The app will be available at `http://localhost:3000` (frontend) and `http://localhost:5000` (backend API).

---

## 🔐 Environment Variables

Create a `.env` file in the `/backend` directory using the template below:

```env
# ─── Server ──────────────────────────────
PORT=5000
NODE_ENV=development

# ─── Database ────────────────────────────
MONGODB_URI=mongodb://localhost:27017/expense-tracker

# ─── JWT ─────────────────────────────────
JWT_SECRET=your_strong_jwt_secret_here
JWT_EXPIRES_IN=7d

# ─── Email (Nodemailer) ──────────────────
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password   # Use App Password, NOT your main password

# ─── Google OAuth ─────────────────────────
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# ─── Frontend URL ────────────────────────
CLIENT_URL=http://localhost:3000
```

> ⚠️ **Never commit your `.env` file.** Make sure `.env` is listed in your `.gitignore`.

---

## 📡 API Endpoints

### Auth Routes — `/api/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register with OTP verification |
| POST | `/verify-otp` | Verify OTP code |
| POST | `/login` | Login with email + password |
| GET | `/google` | Initiate Google OAuth |
| GET | `/google/callback` | Google OAuth callback |
| POST | `/forgot-password` | Send password reset email |
| POST | `/reset-password/:token` | Reset password with token |

### Expense Routes — `/api/expenses` (🔒 Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all expenses (with filter) |
| POST | `/` | Create a new expense |
| PUT | `/:id` | Update an expense |
| DELETE | `/:id` | Delete an expense |
| GET | `/export/pdf` | Download PDF report |
| GET | `/export/excel` | Download Excel export |

### Category Routes — `/api/categories` (🔒 Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all categories |
| POST | `/` | Create category |
| DELETE | `/:id` | Delete category |

---

## 📁 Project Structure

```
Expense-tracker/
├── backend/
│   ├── controllers/       # Business logic
│   │   ├── authController.js
│   │   ├── expenseController.js
│   │   └── categoryController.js
│   ├── models/            # Mongoose schemas
│   │   ├── User.js
│   │   ├── Expense.js
│   │   └── Category.js
│   ├── routes/            # Express routes
│   ├── middleware/        # Auth middleware
│   ├── services/          # 📬 Microservices
│   │   ├── emailService.js      # Nodemailer config
│   │   ├── pdfService.js        # PDF generation
│   │   └── cronJob.js           # Daily scheduler
│   ├── utils/             # Helper functions
│   └── server.js          # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # State management
│   │   └── utils/         # API helpers
│   └── public/
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with ❤️ by Muhammad Haris**

*MERN Stack · Microservices · Automated Financial Reporting*

</div>
