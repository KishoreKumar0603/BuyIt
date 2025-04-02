import User from "../models/userModel.js";
import sendMail from "../middleware/sendMail.js"; 
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

// 🔹 1️⃣ Request OTP for Password Reset
export const requestOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name } = user;

    // Generate a 6-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Generate a JWT token with OTP (valid for 5 minutes)
    const activationKey = jwt.sign(
      { email, otp },
      process.env.ACTIVATION_KEY,
      { expiresIn: "5m" }
    );

    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: rgb(0, 0, 0);">BuyIt - Password Reset OTP</h2>
        <p style="color: #333; text-align: center;">Hello <strong>${name}</strong>,</p>
        <p style="color: #555; text-align: center;">We received a request to reset your password for your BuyIt account.</p>
        <p style="text-align: center; font-size: 18px; color: #333; font-weight: bold;">Your OTP Code:</p>
        <div style="text-align: center; background: rgba(124, 124, 124, 0.82); color: white; padding: 15px; font-size: 24px; font-weight: bold; border-radius: 5px;">
          ${otp}
        </div>
        <p style="text-align: center; color: #777; font-size: 14px;">This OTP is valid for <strong>5 minutes</strong>. Please do not share this code with anyone.</p>
        <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="text-align: center; font-size: 12px; color: #999;">If you did not request a password reset, please ignore this email.</p>
        <p style="text-align: center; font-size: 12px; color: #999;">&copy; 2025 BuyIt. All rights reserved.</p>
      </div>
    `;

    // Send OTP via email
    await sendMail(email, "BuyIt Password Reset OTP", message);

    return res.status(200).json({
      message: "OTP sent successfully",
      activationKey,
    });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// 🔹 2️⃣ Verify OTP
export const verifyOtp = async (req, res) => {
  try {
    const { otp, resetKey } = req.body; // Match with frontend

    if (!resetKey) {
      return res.status(400).json({ message: "Reset Key is missing. Please request a new OTP." });
    }

    let decoded;
    try {
      decoded = jwt.verify(resetKey, process.env.ACTIVATION_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({ message: "OTP has expired. Please request a new one." });
      }
      return res.status(400).json({ message: "Invalid or tampered Reset Key." });
    }

    if (!otp || decoded.otp.toString() !== otp.toString()) {
      return res.status(400).json({ message: "Incorrect OTP. Please try again." });
    }

    // Generate resetToken for password reset
    const resetToken = jwt.sign(
      { email: decoded.email },
      process.env.RESET_KEY,
      { expiresIn: "10m" }
    );

    return res.status(200).json({
      message: "OTP Verified. Proceed to reset your password.",
      resetToken,
    });

  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res.status(500).json({ message: "Server error. Please try again.", error: error.message });
  }
};

// 🔹 3️⃣ Change Password
export const changePassword = async (req, res) => {
  try {
    const {password, confirmPassword,  resetToken} = req.body;

    if (!password || !confirmPassword) {
      return res.status(400).json({ message: "Both fields are required." });
    }
    if (!resetToken) {
      return res.status(400).json({ message: "Reset token is missing. Please verify OTP again." });
    }

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.RESET_KEY);
    } catch (error) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }


    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update the password in the database
    await User.updateOne({ email: decoded.email }, { $set: { password: hashedPassword } });

    return res.status(200).json({ message: "Password reset successful." });

  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
