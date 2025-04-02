import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import sendMail from "../middleware/sendMail.js";

dotenv.config();

// Register User

export const registerUser = async (req, res) => {
  try {
    console.log("Received Registration Data:", req.body);

    const { name, email, phone, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000);
    const activationKey = jwt.sign(
      { name, email, phone, hashedPassword, otp },
      process.env.ACTIVATION_KEY,
      { expiresIn: "5m" }
    );
    const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="text-align: center; color:rgb(0, 0, 0);">BuyIt - OTP Verification</h2>
      <p style="color: #333; text-align: center;">Hello <strong>${name}</strong>,</p>
      <p style="color: #555; text-align: center;">We received a request to verify your email address for your BuyIt account.</p>
      <p style="text-align: center; font-size: 18px; color: #333; font-weight: bold;">Your OTP Code:</p>
      
      <div style="text-align: center; background:rgba(124, 124, 124, 0.82); color: white; padding: 15px; font-size: 24px; font-weight: bold; border-radius: 5px;">
        ${otp}
      </div>

      <p style="text-align: center; color: #777; font-size: 14px;">This OTP is valid for <strong>5 minutes</strong>. Please do not share this code with anyone.</p>

      <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="text-align: center; font-size: 12px; color: #999;">If you did not request this, please ignore this email.</p>
      <p style="text-align: center; font-size: 12px; color: #999;">&copy; 2025 BuyIt. All rights reserved.</p>
    </div>
  `;


    await sendMail(email, "BuyIt - Account Verification", message);
    return res.status(200).json({
      message: "OTP sent to your email. Please verify your account!",
      activationKey,
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

//verify otp
export const verifyUser = async (req, res) => {
  try {
    const { otp, activationKey } = req.body;

    if (!activationKey) {
      return res
        .status(400)
        .json({ message: "Activation Key is missing. Please register again." });
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

    // Check if the user already exists
    const existingUser = await User.findOne({ email: decoded.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists. Please log in." });
    }

    // Create new user
    await User.create({
      name: decoded.name,
      email: decoded.email,
      password: decoded.hashedPassword,
      phone: decoded.phone,
    });

    return res.status(200).json({ message: "Account Created Successfully" });
  } catch (error) {
    console.error("Error in verifyUser:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

//Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt with email:", email); // Debugging log

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found"); // Debugging log
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    if (!(await user.matchPassword(password))) {
      console.log("Password mismatch"); // Debugging log
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    console.log("Login successful for:", user.email);
    const { password: userPassword, ...userDetails } = user.toObject();

    res.status(200).json({
      message: "Welcome " + user.name,
      user: userDetails,
      token,
    });
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message: "Server error" });
  }
};

//Profile View
export const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.json({
      message: "error : " + error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from URL params
    const updateData = req.body; // Get updated fields from request body

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};
