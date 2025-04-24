import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../../assets/css/pages/ForgotPassword/ResetPassword.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state || {};
  const resetToken = localStorage.getItem("resetToken");

  const handleResetPassword = async () => {
    if (!resetToken) {
      alert("Reset token is missing. Please try again.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/user/forgot/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetToken, password, confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Password reset successfully!");
        localStorage.removeItem("resetToken"); // Clear reset token
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Something went wrong. Please try again.");
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
