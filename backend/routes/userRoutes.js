import express from "express";
import {
    registerUser,
    loginUser,
    myProfile,
    verifyUser,
    deleteUser,
    updateUser
  } from "../controllers/userController.js";
import { isAuth } from "../middleware/isAuth.js";
  

const router = express.Router();


router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/verify", verifyUser)
router.get("/my-profile", isAuth, myProfile);
router.delete('/delete/:id',deleteUser);
router.patch('/update/:id',updateUser);

export default router;
