import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/pages/ForgotPassword/OtpVerification.css";

const ForgotPasswordOtp = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const resetKey = localStorage.getItem("activationKey");

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus(); // Auto-focus first input on load
  }, []);

  const handleChange = (index, value) => {
    if (!/^[0-9]?$/.test(value)) return; // Only allow digits (0-9)

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus(); // Move to next input
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus(); // Move back on delete
    }
  };

  const handleVerifyOtp = async () => {
    if (!resetKey) {
      alert("Reset key missing. Please request a new OTP.");
      return;
    }

    const otpValue = otp.join("").trim();
    if (otpValue.length !== 4) {
      alert("Please enter a 4-digit OTP.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/user/forgot/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otpValue, resetKey }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("OTP Verified! You can now reset your password.");
        localStorage.setItem("resetToken", data.resetToken);
        navigate("/reset-password");
      } else {
        alert(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <h2 className="otp-title">Forgot Password OTP Verification</h2>
        <p className="otp-subtext">Enter the OTP sent to your email.</p>
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="otp-input"
            />
          ))}
        </div>
        <button className="otp-button" onClick={handleVerifyOtp}>
          Verify OTP
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordOtp;
