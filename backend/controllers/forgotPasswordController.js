import User from "../models/userModel.js";
import sendMail from "../middleware/sendMail.js"; 
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt, { decode } from "jsonwebtoken";
dotenv.config();
// 1️⃣ Request OTP for password reset
export const requestOTP = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { name, phone } = user;
    // Generate a 6-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000);
    const activationKey = jwt.sign(
      { name, phone, email, otp },
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
    res.status(500).json({ message: "Server error", error });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { otp, activationKey } = req.body;
    if (!activationKey) {
      return res
        .status(400)
        .json({ message: "Activation Key is missing. Please Try again." });
    }
    let decoded;
    try {
      decoded = jwt.verify(activationKey, process.env.ACTIVATION_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(400)
          .json({ message: "OTP has expired. Please request a new one." });
      }
      return res.status(400).json({ message: "Invalid Activation Key." });
    }
    if (decoded.otp.toString() !== otp.toString()) {
      return res
        .status(400)
        .json({ message: "Incorrect OTP. Please try again." });
    }
    const email = decoded.email;
    const user = await User.findOne({ email });
    return res.json({
      message: "OTP Verified",
      user,
    });
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};

export const changePassword = async (req,res) =>{
    try{
        const {password_1, password_2} = req.body;
        if(!password_1 || !password_2){
            return res.json({
                message:"Both field Required"
            });
        }
        if(password_1.toString() !== password_2.toString()){
            return res.json({
                message:"Both field should be same"
            });
        }
        const hashedPassword = await bcrypt.hash(password_1, 10);
        
        
    }catch(error)
    {
        return res.json({
            message : error.message
        });
    }
}
