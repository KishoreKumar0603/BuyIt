import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/pages/ForgotPassword/ForgotPassword.css";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleNext = async () => {
    // Send username to backend to generate OTP
    const response = await fetch("http://localhost:5000/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    if (response.ok) {
      navigate("/otp-verification", { state: { username } });
    } else {
      alert("User not found!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Forgot Password</h2>
        <div className="input-group">
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter registered username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <button className="auth-button" onClick={handleNext}>
          Next
        </button>
        <p className="auth-footer">
          Don't have an account? <span className="auth-link">Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
