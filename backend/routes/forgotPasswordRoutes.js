import express from "express";
import {
  requestOTP,
  verifyOtp,
  changePassword
} from "../controllers/forgotPasswordController.js";

const router = express.Router();

// Route to request an OTP
router.post("/request-otp", requestOTP);

// Route to verify OTP and reset password
router.post("/reset-password", verifyOtp);

router.post("/change-password", changePassword);

export default router;
