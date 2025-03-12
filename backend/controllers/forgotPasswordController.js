import User from "../models/User.js"; // Adjust this according to your User model
import { sendMail } from "../utils/sendMail.js"; // Assuming you have a sendMail function
import bcrypt from "bcrypt";
import otpGenerator from "otp-generator";
import dotenv from "dotenv";
dotenv.config();
// 1️⃣ Request OTP for password reset
export const requestOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const{name,phone} = user;
    // Generate a 6-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000);
    const activationKey = jwt.sign(
        {name, phone,email, otp },
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

    return res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 2️⃣ Verify OTP and reset password
export const verifyOTPAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    if (!otpStore[email] || otpStore[email].otp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    user.password = hashedPassword;
    await user.save();

    // Remove OTP from store
    delete otpStore[email];

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
