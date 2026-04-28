import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { z } from "zod";
import '../index.css';
import '../App.css';

const loginSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

function Login() {
  const [errormsg, setErrormsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handlelogin() {
    // Validate with Zod
    const validation = loginSchema.safeParse({ email, password });
    
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setFieldErrors(errors);
      setErrormsg(""); // clear previous server errors
      return;
    }
    
    // If valid, clear validation errors and proceed
    setFieldErrors({});
    
    axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      email,
      password,
    }, {
      withCredentials: true
    }).then((res) => {
      console.log("response from server", res.data);
      if (res.data.success) {
        localStorage.setItem("userEmail", email);
        navigate("/");
      } else {
        setErrormsg(res.data.message || "Invalid credentials");
      }
    }).catch((error) => {
      console.error("error sending data", error);
      setErrormsg("Login failed. Please check your credentials.");
    });
  }

  return (
    <div className="auth-container">
      <div className="glass-card auth-card">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ color: "var(--primary)" }}>Welcome Back</h1>
          <p style={{ color: "var(--text-muted)" }}>Sign in to continue tracking.</p>
        </div>

        <div className="form-group">
          <label className="label-text">Email Address</label>
          <input className={`input-field ${fieldErrors.email ? 'error-border' : ''}`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
          {fieldErrors.email && <span style={{ color: "var(--error)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{fieldErrors.email}</span>}
        </div>

        <div className="form-group">
          <label className="label-text">Password</label>
          <input className={`input-field ${fieldErrors.password ? 'error-border' : ''}`} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          {fieldErrors.password && <span style={{ color: "var(--error)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{fieldErrors.password}</span>}
        </div>

        {errormsg && (
          <div style={{ color: "var(--error)", fontSize: "0.85rem", marginBottom: "1rem", textAlign: "center" }}>
            {errormsg}
          </div>
        )}

        <button onClick={handlelogin} className="btn-primary" style={{ width: "100%", padding: "1rem" }}>
          Sign In
        </button>

        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Don't have an account?{" "}
            <span style={{ color: "var(--primary)", cursor: "pointer", fontWeight: "600" }} onClick={() => navigate("/signup")}>
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
