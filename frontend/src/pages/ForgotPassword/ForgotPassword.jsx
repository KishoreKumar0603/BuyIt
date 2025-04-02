import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/pages/ForgotPassword/ForgotPassword.css";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleNext = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/user/forgot/request-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        localStorage.setItem("activationKey", data.activationKey);  // Store resetKey in localStorage
        navigate("/otp-verify", { state: { email: username } });
      } else {
        alert(data.message || "User not found!");
      }
    } catch (error) {
      console.error("Error requesting OTP:", error);
      alert("Something went wrong. Please try again.");
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
