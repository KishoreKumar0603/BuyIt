import express from "express";
import {
  requestOTP,
  verifyOtp,
  changePassword
} from "../controllers/forgotPasswordController.js";

const router = express.Router();

router.post("/request-otp", requestOTP);

router.post("/reset-password", verifyOtp);

router.post("/change-password", changePassword);

export default router;
