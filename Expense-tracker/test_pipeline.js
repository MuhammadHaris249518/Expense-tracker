import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

const jar = new CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true }));

const BASE_URL = 'http://localhost:3000';

async function testPipeline() {
  try {
    console.log("=== Testing Backend+AI Pipeline ===");
    
    // 1. Create a random test user
    const randomSuffix = Math.floor(Math.random() * 10000);
    const email = `testuser${randomSuffix}@example.com`;
    const password = "Password123!";
    
    console.log(`\n1. Creating test user: ${email}`);
    const signupRes = await client.post(`${BASE_URL}/auth/signup`, {
      name: "Test User",
      email,
      password
    });
    console.log("Signup success:", signupRes.data.success);
    
    // 2. Login
    console.log("\n2. Logging in...");
    const loginRes = await client.post(`${BASE_URL}/auth/login`, {
      email,
      password
    });
    console.log("Login success:", loginRes.data.success, "| Token received via cookies");
    
    // 3. Create a new transaction to test the AI category feature
    console.log("\n3. Submitting new transaction to test AI Categorization...");
    console.log("-> Title: 'Bought 3 apples and some milk'");
    const transactionRes = await client.post(`${BASE_URL}/transactions`, {
      title: "Bought 3 apples and some milk",
      amount: "25.50",
      date: "2026-04-28",
      choice: "Expense"
    });
    
    console.log("Transaction registered successfully:", transactionRes.data.success);
    console.log("\n====== PIPELINE RESULT ======");
    console.log("Transaction created:", transactionRes.data.transaction.title);
    console.log("Amount:", transactionRes.data.transaction.amount);
    console.log("\x1b[32mAI Assigned Category:\x1b[0m", transactionRes.data.transaction.category);
    console.log("=============================");
    
  } catch (error) {
    console.error("Pipeline test failed:", error?.response?.data || error.message);
  }
}

testPipeline();