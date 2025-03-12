import express from "express";
import {
  requestOTP,
  verifyOTPAndResetPassword,
} from "../controllers/forgotPasswordController.js";

const router = express.Router();

// Route to request an OTP
router.post("/request-otp", requestOTP);

// Route to verify OTP and reset password
router.post("/reset-password", verifyOTPAndResetPassword);

export default router;
