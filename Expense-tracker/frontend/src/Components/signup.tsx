import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { z } from "zod";
import '../index.css';
import '../App.css';

const signupSchema = z.object({
  fname: z.string().min(2, "First name must be at least 2 characters"),
  lname: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ fname?: string; lname?: string; email?: string; password?: string }>({});
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  function handlesubmit() {
    setServerError("");
    const validation = signupSchema.safeParse({ fname, lname, email, password });
    
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) errors[err.path[0] as string] = err.message;
      });
      setFieldErrors(errors);
      return;
    }
    
    setFieldErrors({});

    axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/signup`, {
      email,
      fname,
      lname,
      password,
    }).then((res) => {
      console.log("response from server", res.data);
      if (res.data.success) {
        navigate("/login");
      } else {
        setServerError(res.data.message || "Failed to sign up");
      }
    }).catch((error) => {
      console.error("error sending data", error);
      if (error.response && error.response.data && error.response.data.message) {
        setServerError(error.response.data.message);
      } else {
        setServerError("A network error occurred. Please try again.");
      }
    });
  }

  return (
    <div className="auth-container">
      <div className="glass-card auth-card">
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ color: "var(--primary)" }}>Join Expensely</h1>
          <p style={{ color: "var(--text-muted)" }}>Start tracking your wealth today.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="label-text">First Name</label>
            <input className="input-field" value={fname} onChange={(e) => setFname(e.target.value)} type="text" placeholder="John" />
            {fieldErrors.fname && <span style={{ color: "var(--error)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{fieldErrors.fname}</span>}
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="label-text">Last Name</label>
            <input className="input-field" value={lname} onChange={(e) => setLname(e.target.value)} type="text" placeholder="Doe" />
            {fieldErrors.lname && <span style={{ color: "var(--error)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{fieldErrors.lname}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="label-text">Email</label>
          <input className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="john@example.com" />
          {fieldErrors.email && <span style={{ color: "var(--error)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{fieldErrors.email}</span>}
        </div>

        <div className="form-group">
          <label className="label-text">Password</label>
          <input className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" />
          {fieldErrors.password && <span style={{ color: "var(--error)", fontSize: "0.8rem", marginTop: "4px", display: "block" }}>{fieldErrors.password}</span>}
        </div>

        {serverError && (
          <div style={{ color: "var(--error)", fontSize: "0.85rem", marginTop: "1rem", textAlign: "center" }}>
            {serverError}
          </div>
        )}

        <button className="btn-primary" style={{ width: "100%", padding: "1rem", marginTop: "1rem" }} onClick={handlesubmit}>
          Create Account
        </button>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Already have an account?{" "}
            <span style={{ color: "var(--primary)", cursor: "pointer", fontWeight: "600" }} onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;