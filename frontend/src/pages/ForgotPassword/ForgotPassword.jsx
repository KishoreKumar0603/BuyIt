import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/pages/ForgotPassword/ForgotPassword.css";
import axiosInstance from "../../context/axiosInstance";
import { useAlert } from "../../context/AlertContext";

const ForgotPassword = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  const {triggerAlert} = useAlert();
  useEffect(()=>{
    document.title = "BuyIt | Forgot Password";
  })

  const handleNext = async () => {
    try {
      const response = await axiosInstance.post(
        `/api/user/forgot/request-otp`,
        { email: username },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        const { activationKey } = response.data;
        localStorage.setItem("activationKey", activationKey);  // Store resetKey in localStorage
        navigate("/otp-verify", { state: { email: username } });
      } else {
        // alert(response.data.message || "User not found!");
        triggerAlert(response.data.message || "User not found!");
      }
    } catch (error) {
      console.error("Error requesting OTP:", error);
      // alert("Something went wrong. Please try again.");
      triggerAlert("Something went wrong. Please try again.");
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
