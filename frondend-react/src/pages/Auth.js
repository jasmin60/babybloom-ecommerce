import React, { useState } from "react";
import axios from "axios";

function Auth({ setUser, setShowGreetingModal }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || (!isLoginView && !email)) return;

    try {
      if (isLoginView) {
        const res = await axios.post("http://127.0.0.1:8000/api/login/", { username, password });
        localStorage.setItem("token", res.data.access);
        
        // 🚀 CRITICAL TRIGGERS: Saves context data and instructs overlay to unlock layout views
        setUser({ username, token: res.data.access });
        setShowGreetingModal(true); 

      } else {
        await axios.post("http://127.0.0.1:8000/api/register/", { username, password });
        alert("Account registered. Proceed to login securely.");
        setIsLoginView(true);
      }
    } catch (err) {
      console.error(err);
      alert("Authentication credentials rejected.");
    }
  };

  return (
    <div className="auth-outer-wrap" style={{ padding: "40px 0" }}>
      <div className="auth-floating-card">
        <div className="auth-header-banner">
          <h3>{isLoginView ? "Atelier Sign In" : "Create Profile"}</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", margin: 0, lineHeight: "1.5" }}>
            {isLoginView ? "Access your secure newborn shipping tracking logs." : "Register validation keys to open personal wholesale accounts."}
          </p>
        </div>

        <form onSubmit={handleAuthSubmit} className="auth-form">
          <div className="input-group">
            <label>Username Handle</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </div>

          {!isLoginView && (
            <div className="input-group">
              <label>Registry Email Address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          )}

          <div className="input-group">
            <label>Account Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn-primary-action" style={{ width: "100%", marginTop: "12px" }}>
            {isLoginView ? "Authenticate Keys" : "Verify Registration"}
          </button>
        </form>

        <div style={{ textAlign: "center", paddingBottom: "32px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
          <span>{isLoginView ? "New merchant client?" : "Already verified credentials?"}</span>
          <button 
            type="button" 
            onClick={() => setIsLoginView(!isLoginView)} 
            style={{ background: "none", border: "none", color: "var(--text-dark)", fontWeight: "600", textDecoration: "underline", marginLeft: "6px", cursor: "pointer" }}
          >
            {isLoginView ? "Register Profile" : "Login Securely"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;