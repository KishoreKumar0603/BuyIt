import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../assets/css/pages/ForgotPassword/ResetPassword.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state || {};

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const response = await fetch("http://localhost:5000/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      alert("Password reset successfully!");
      navigate("/");
    } else {
      alert("Error resetting password!");
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2 className="reset-title">Change Password</h2>
        <div className="reset-input-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="reset-input-group">
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button className="reset-button" onClick={handleResetPassword}>
          Change
        </button>
        <p className="reset-footer">
          Don't have an account? <span className="reset-link">Sign Up</span>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
