import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/pages/ForgotPassword/OtpVerification.css";
import axiosInstance from "../../context/axiosInstance";
import { useAlert } from "../../context/AlertContext";

const ForgotPasswordOtp = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const resetKey = localStorage.getItem("activationKey");
  const { triggerAlert } = useAlert();

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
      triggerAlert("Reset key missing. Please request a new OTP.");
      // alert("Reset key missing. Please request a new OTP.");
      return;
    }

    const otpValue = otp.join("").trim();
    if (otpValue.length !== 4) {
      triggerAlert("Please enter a 4-digit OTP.");
      // alert("Please enter a 4-digit OTP.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/api/user/forgot/reset-password",
        { otp: otpValue, resetKey },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        triggerAlert("OTP Verified! You can now reset your password.");
        // alert("OTP Verified! You can now reset your password.");
        localStorage.setItem("resetToken", response.data.resetToken);
        navigate("/reset-password");
      } else {
        triggerAlert(response.data.message || "Invalid OTP. Please try again.");
        // alert(response.data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      triggerAlert("Something went wrong. Please try again.");
      // alert("Something went wrong. Please try again.");
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
