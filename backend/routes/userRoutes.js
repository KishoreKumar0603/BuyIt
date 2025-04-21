import express from "express";
import {
    registerUser,
    loginUser,
    myProfile,
    verifyUser,
    deleteUser,
    updateUser,
    changePass
  } from "../controllers/userController.js";
import { isAuth } from "../middleware/isAuth.js";
  

const router = express.Router();


// Routes 
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/verify", verifyUser)

// Protected Routes
router.get("/my-profile", isAuth, myProfile);
router.delete('/delete', isAuth, deleteUser);
router.patch('/update', isAuth, updateUser);
router.put("/change-password", isAuth,changePass);
export default router;
