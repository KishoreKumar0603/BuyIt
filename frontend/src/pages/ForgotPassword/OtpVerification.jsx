import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/pages/ForgotPassword/OtpVerification.css";
import axiosInstance from "../../context/axiosInstance";

import { useAlert } from "../../context/AlertContext";

const OtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const {triggerAlert} = useAlert();

  const activationKey = localStorage.getItem("activationKey");

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus(); // Auto-focus first input on load
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Only allow digits (0-9)

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs.current[index + 1].focus(); // Move to next input
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus(); // Move back on delete
    }
  };

  const handleVerifyOtp = async () => {
    if (!activationKey) {
      // alert("Activation key missing. Please register again.");
      triggerAlert("Activation key missing. Please register again.");
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
        `/api/user/verify`,
        { otp: otpValue, activationKey },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        triggerAlert("Account Created Successfully");
        // alert("Account Created Successfully");
        localStorage.removeItem("activationKey");
        navigate("/login");
      } else {
        triggerAlert(response.data.message);
        // alert(response.data.message);
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
        <h2 className="otp-title">OTP Verification</h2>
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
            />
          ))}
        </div>
        <button className="otp-button" onClick={handleVerifyOtp}>
          Verify
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;
