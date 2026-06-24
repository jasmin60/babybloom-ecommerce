import React, { useState } from "react";
import axios from "axios";

function Auth({ setUser }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuthSubmit = async (e) => {
  e.preventDefault();

  if (!username || !password || (!isLoginView && !email)) {
    alert("Please fill all fields");
    return;
  }

  try {
    if (isLoginView) {
      // LOGIN API
      const res = await axios.post("http://127.0.0.1:8000/api/login/", {
        username,
        password,
      });

      // Save token
      localStorage.setItem("token", res.data.access);

      // Set user
      setUser({ username, token: res.data.access });

      alert("Login successful");

    } else {
      // REGISTER API
      await axios.post("http://127.0.0.1:8000/api/register/", {
        username,
        password,
      });

      alert("Registration successful. Please login.");
      setIsLoginView(true);
    }
  } catch (err) {
    console.error(err);
    alert("Authentication failed");
  }
};

  return (
    <div className="auth-outer-wrap">
      <div className="auth-floating-card">
        
        {/* Dynamic Identity Branding Header Banner Accent */}
        <div className={`auth-header-banner ${isLoginView ? 'pink-accent' : 'blue-accent'}`}>
          <h3>{isLoginView ? "Sign In to BabyBloom" : "Create Business Account"}</h3>
          <p>{isLoginView ? "Access your secure registry panel and order delivery records." : "Gain access to wholesale shipping rates and community catalogs."}</p>
        </div>

        <form onSubmit={handleAuthSubmit} className="auth-form">
          <div className="input-group">
            <label>Username / Handle</label>
            <input 
              type="text" 
              placeholder="Enter account username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {!isLoginView && (
            <div className="input-group">
              <label>Corporate E-mail Address</label>
              <input 
                type="email" 
                placeholder="parent@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <label>Secure Account Password</label>
            <input 
              type="password" 
              placeholder="••••••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary-action auth-action-btn">
            {isLoginView ? "Authenticate & Proceed ➔" : "Finalize Registry Verification 🚀"}
          </button>
        </form>

        <div className="auth-toggle-footer">
          <span>{isLoginView ? "New client merchant?" : "Already verified your credentials?"}</span>
          <button 
            type="button" 
            className="toggle-link-btn" 
            onClick={() => setIsLoginView(!isLoginView)}
          >
            {isLoginView ? "Register Here" : "Login Securely"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;