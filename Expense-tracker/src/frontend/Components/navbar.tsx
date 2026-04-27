import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../index.css';
import '../App.css';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {}, { withCredentials: true })
      .then(() => {
        localStorage.removeItem("userEmail");
        navigate("/login");
      })
      .catch(err => console.error("Logout failed", err));
  };

  const userEmail = localStorage.getItem("userEmail");
  const initial = userEmail ? userEmail.charAt(0).toUpperCase() : "";

  return (
    <nav className="glass-card" style={{
      padding: '0.75rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ color: 'var(--primary)', fontSize: '1.5rem', margin: 0 }}>Expensely</h1>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>Smart Financial Tracking</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {userEmail ? (
          <>
            <div 
              style={{
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                backgroundColor: 'var(--primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                marginRight: '0.5rem'
              }}
              title={userEmail}
            >
              {initial}
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
            <button
              className="btn-primary"
              onClick={() => navigate("/")}
              style={{ padding: '0.5rem 1.25rem' }}
            >
              Dashboard
            </button>
          </>
        ) : (
          <>
            <span style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem' }}>
              Login first
            </span>
            <button
              className="btn-primary"
              onClick={() => navigate("/login")}
              style={{ padding: '0.5rem 1.25rem' }}
            >
              Login
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;