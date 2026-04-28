import { useState, useEffect } from "react";
import Cards from "./Components/Cards";
import Navbar from "./Components/navbar";
import Form from "./Components/form";
import Signup from "./Components/signup";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/login";
import axios from "axios";

interface TransactionItem {
  _id?: string;
  title: string;
  category: string;
  date: string;
  choice: string;
  amount: number;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuth = !!localStorage.getItem("userEmail");
  return isAuth ? children : <Navigate to="/login" replace />;
}

function App() {

  const [list, setList] = useState<TransactionItem[]>([]);
  const [bamount, setBamount] = useState(0);
  const [iamount, setIamount] = useState(0);
  const [eamount, setEamount] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async (page = 1) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/transactions?page=${page}&limit=5`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setList(response.data.transactions);
        setIamount(response.data.stats.totalIncome);
        setEamount(response.data.stats.totalExpense);
        setBamount(response.data.stats.totalBalance);
        setTotalPages(response.data.pagination.totalPages);
        setCurrentPage(response.data.pagination.currentPage);
      }
    } catch (error) {
      console.error("Failed to fetch transactions", error);
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        localStorage.removeItem("userEmail");
        window.location.href = "/signup";
      }
    }
  };

  function totalcal() {
    // When a new transaction is added, reset to page 1 and fetch latest
    fetchTransactions(1);
  }
  function handledownload() {
    window.open(`${import.meta.env.VITE_API_BASE_URL}/transactions/download`, "_blank")
  }

  useEffect(() => {
    if (window.location.pathname === '/' || window.location.pathname === '') {
      // eslint-disable-next-line react-x/no-set-state-in-effect
      fetchTransactions(currentPage);
    }
  }, [currentPage]);


  return (
    <BrowserRouter>
      <div className="container-main">
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <>
                <Navbar />
                <header className="dashboard-header">
                  <div>
                    <h1>Your Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Here's what's happening with your money today.</p>
                    <button className="btn-primary" onClick={handledownload}>Download Report</button>
                  </div>
                </header>

                <div className="stats-grid">
                  <Cards title="Total Balance" bamount={bamount} iamount={0} eamount={0} />
                  <Cards title="Total Income" iamount={iamount} bamount={0} eamount={0} />
                  <Cards title="Total Expenses" eamount={eamount} bamount={0} iamount={0} />
                </div>

                <div className="main-content-layout">
                  <section className="glass-card" style={{ padding: '2rem' }}>
                    <Form sendData={totalcal} />
                  </section>

                  <section className="glass-card" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Recent Transactions</h3>
                    <div className="recent-list">
                      {list.length === 0 ? (
                        <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                          No transactions yet. Start adding some!
                        </p>
                      ) : (
                        <>
                          {list.map((item: TransactionItem, index: number) => (
                            <div key={index} className="transaction-item glass-card" style={{ background: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem' }}>
                              <div className="item-info">
                                <h4>{item.title}</h4>
                                <span>{item.category} • {new Date(item.date).toLocaleDateString()}</span>
                              </div>
                              <div className={`item-amount ${item.choice === 'Income' || item.choice === 'income' ? 'amount-income' : 'amount-expense'}`}>
                                {item.choice === 'Income' || item.choice === 'income' ? '+' : '-'}${item.amount}
                              </div>
                            </div>
                          ))}

                          <div className="pagination-controls">
                            <button
                              className="pagination-btn"
                              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                              disabled={currentPage === 1}
                            >
                              ← Previous
                            </button>

                            <span className="page-info">
                              Page {currentPage} of {totalPages}
                            </span>

                            <button
                              className="pagination-btn"
                              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                              disabled={currentPage === totalPages}
                            >
                              Next →
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </section>
                </div>
              </>
            </ProtectedRoute>
          } />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
