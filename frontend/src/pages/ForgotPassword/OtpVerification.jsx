import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../assets/css/pages/ForgotPassword/OtpVerification.css';
const OtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const navigate = useNavigate();

  const activationKey = localStorage.getItem("activationKey"); // Retrieve the stored activation key
  console.log("Activation Key : "+activationKey);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleVerifyOtp = async () => {
    if (!activationKey) {
      alert("Activation key missing. Please register again.");
      return;
    }

    const otpValue = otp.join("");

    try {
      console.log(activationKey);
      const response = await fetch("http://localhost:5000/api/user/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otpValue, activationKey }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Account Created Successfully");
        localStorage.removeItem("activationKey"); // Clear after success
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <h2 className="otp-title">OTP - Verification</h2>
        <p className="otp-subtext">Enter the OTP sent to your email.</p>
        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
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
