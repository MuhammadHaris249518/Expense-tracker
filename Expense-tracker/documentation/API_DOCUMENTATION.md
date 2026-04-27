# 📚 API Documentation

## Base URLs
- **Backend:** http://localhost:3000
- **FastAPI:** http://localhost:8000
- **Frontend:** http://localhost:5173

---

## 🔐 Authentication

All endpoints except `/signup` and `/login` require JWT authentication via cookies.

### JWT Token:
- Issued on successful login
- Stored in HTTPOnly cookie named `token`
- Valid for 1 hour
- Automatically sent with requests (withCredentials: true)

---

## 👤 User Endpoints

### 1. Signup
```http
POST /signup
Content-Type: application/json

{
  "fname": "John",
  "lname": "Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "user was created successfully"
}
```

**Status Codes:**
- `200` - User created
- `400` - Invalid data
- `500` - Server error

---

### 2. Login
```http
POST /login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "successfull login",
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Status Codes:**
- `200` - Login successful
- `401` - Invalid credentials
- `404` - User not found

---

## 💰 Transaction Endpoints

### 3. Create Transaction
```http
POST /transactions
Content-Type: application/json
Cookie: token=<JWT_TOKEN>

{
  "title": "Grocery Shopping",
  "amount": 50.00,
  "category": "food",
  "date": "2026-04-26",
  "choice": "expense"
}
```

**Response:**
```json
{
  "message": "successfull saved transactions",
  "success": true
}
```

**Status Codes:**
- `200` - Transaction saved
- `401` - Not authenticated
- `400` - Invalid data

---

### 4. Get All Transactions
```http
GET /transactions
Cookie: token=<JWT_TOKEN>
```

**Response:**
```json
{
  "success": true,
  "transactions": [
    {
      "_id": "645a1f2b9c8d3f4e5g6h7i8j",
      "title": "Grocery Shopping",
      "amount": 50,
      "category": "food",
      "date": "2026-04-26",
      "choice": "expense",
      "user": "645a1f2b9c8d3f4e5g6h7i8j"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Not authenticated

---

### 5. Get Single Transaction
```http
GET /transactions/:id
Cookie: token=<JWT_TOKEN>
```

**Example:**
```http
GET /transactions/645a1f2b9c8d3f4e5g6h7i8j
```

**Response:**
```json
{
  "success": true,
  "transaction": {
    "_id": "645a1f2b9c8d3f4e5g6h7i8j",
    "title": "Grocery Shopping",
    "amount": 50,
    "category": "food",
    "date": "2026-04-26",
    "choice": "expense",
    "user": "645a1f2b9c8d3f4e5g6h7i8j"
  }
}
```

---

### 6. Update Transaction
```http
PUT /transactions/:id
Content-Type: application/json
Cookie: token=<JWT_TOKEN>

{
  "title": "Grocery Shopping - Updated",
  "amount": 65.00,
  "category": "food",
  "date": "2026-04-26",
  "choice": "expense"
}
```

**Response:**
```json
{
  "success": true,
  "transaction": {
    "_id": "645a1f2b9c8d3f4e5g6h7i8j",
    "title": "Grocery Shopping - Updated",
    "amount": 65,
    ...
  }
}
```

**Status Codes:**
- `200` - Updated successfully
- `401` - Not authenticated
- `400` - Invalid data
- `404` - Transaction not found

---

### 7. Delete Transaction
```http
DELETE /transactions/:id
Cookie: token=<JWT_TOKEN>
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction deleted"
}
```

**Status Codes:**
- `200` - Deleted successfully
- `401` - Not authenticated
- `404` - Transaction not found

---

## 📊 Analytics Endpoints (FastAPI)

### 8. Get Category Recommendation
```http
POST /category
Content-Type: application/json

{
  "title": "Starbucks coffee"
}
```

**Response:**
```json
{
  "category": "entertainment"
}
```

---

### 9. Get Download Report
```http
GET /download-report
```

**Response:** PDF file download

---

### 10. Send Email Report
```http
GET /send-report
```

**Response:**
```json
{
  "status": "sent"
}
```

---

## 🔑 Error Responses

### Standard Error Format:
```json
{
  "error": "Error message description"
}
```

### Common Error Codes:

| Code | Error | Solution |
|------|-------|----------|
| 400 | Bad Request | Check request body format |
| 401 | Unauthorized | Verify JWT token/login |
| 404 | Not Found | Check resource ID |
| 500 | Server Error | Check server logs |

---

## 📋 Request/Response Examples

### Complete Workflow:

#### 1. Signup
```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fname":"John",
    "lname":"Doe",
    "email":"john@example.com",
    "password":"pass123"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email":"john@example.com",
    "password":"pass123"
  }'
```

#### 3. Add Transaction
```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title":"Lunch",
    "amount":25,
    "category":"food",
    "date":"2026-04-26",
    "choice":"expense"
  }'
```

#### 4. Get All
```bash
curl -X GET http://localhost:3000/transactions \
  -b cookies.txt
```

#### 5. Update
```bash
curl -X PUT http://localhost:3000/transactions/ID \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "amount":30
  }'
```

#### 6. Delete
```bash
curl -X DELETE http://localhost:3000/transactions/ID \
  -b cookies.txt
```

---

## 🧪 Testing with Postman

1. **Import Collection:**
   - Create new collection "Expense Tracker"
   - Add requests for each endpoint

2. **Setup Variables:**
   - Base URL: `{{base_url}}`
   - Token: `{{token}}`

3. **Pre-request Script:**
```javascript
// Auto-add token to headers
if (pm.globals.get("token")) {
    pm.request.headers.upsert({
        key: "Authorization",
        value: "Bearer " + pm.globals.get("token")
    });
}
```

4. **Tests:**
```javascript
// Save token from login
if (pm.response.code === 200) {
    var data = pm.response.json();
    pm.globals.set("token", data.token);
}
```

---

## 📊 Data Models

### User Schema:
```javascript
{
  fname: String,
  lname: String,
  email: String (unique),
  password: String (hashed with bcrypt)
}
```

### Transaction Schema:
```javascript
{
  user: ObjectId (ref: User),
  title: String,
  amount: Number,
  category: String,
  date: Date,
  choice: String (income/expense)
}
```

---

## 🔐 Security Features

- ✅ Password hashing (bcrypt)
- ✅ JWT authentication
- ✅ HTTPOnly cookies
- ✅ CORS enabled
- ✅ Input validation
- ✅ User isolation (users only see own data)

---

**Last Updated: April 26, 2026**
