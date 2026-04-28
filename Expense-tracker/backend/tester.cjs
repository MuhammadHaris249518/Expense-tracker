const axios = require('axios');

async function test() {
  try {
    const api = axios.create({
      baseURL: 'http://localhost:3000',
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' }
    });

    const email = `testuser${Math.floor(Math.random()*1000)}@test.com`;
    let res = await api.post('/auth/signup', { fname: 'John', lname: 'Doe', email, password: 'Password123!' });
    res = await api.post('/auth/login', { email, password: 'Password123!' });
    const cookie = res.headers['set-cookie'][0];
    
    await api.post('/transactions', {
      title: 'Bought a PS5 and games',
      amount: 450.50,
      date: '2026-04-28',
      choice: 'Expense'
    }, { headers: { Cookie: cookie }});

    res = await api.get('/transactions', { headers: { Cookie: cookie }});
    console.log("FETCHED TRANSACTIONS:", JSON.stringify(res.data, null, 2));

  } catch (err) {
    console.error("FAIL:", JSON.stringify(err.response?.data || err.message, null, 2));
  }
}
test();