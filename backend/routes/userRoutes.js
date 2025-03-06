import express from "express";
import {
    registerUser,
    loginUser,
    myProfile,
    verifyUser,
  } from "../controllers/userController.js";
import { isAuth } from "../middleware/isAuth.js";
  

const router = express.Router();


router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/verify", verifyUser)
router.get("/profile", isAuth, myProfile);

export default router;
