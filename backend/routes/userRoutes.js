import express from "express";
import {
  registerUser,
  loginUser,
  myProfile,
  verifyUser,
  deleteUser,
  updateUser,
  changePass,
  refreshToken,
  googleAuthCallback,
  completeProfile,
} from "../controllers/userController.js";
import { isAuth } from "../middleware/isAuth.js";
import rateLimit from "express-rate-limit";
import passport from "../config/passport.js";

const router = express.Router();

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many authentication attempts, please try again later.",
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 registrations per hour
  message: "Too many registration attempts, please try again later.",
});

// Routes
router.post("/login", authLimiter, loginUser);
router.post("/register", registerLimiter, registerUser);
router.post("/verify", verifyUser);
router.post("/refresh", refreshToken);

// Google OAuth Routes
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleAuthCallback,
);
router.post("/complete-profile", isAuth, completeProfile);

// Protected Routes
router.get("/my-profile", isAuth, myProfile);
router.delete("/delete", isAuth, deleteUser);
router.patch("/update", isAuth, updateUser);
router.put("/change-password", isAuth, changePass);
export default router;
