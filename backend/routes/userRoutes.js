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
router.get("/profile", isAuth, myProfile);
router.delete('/delete/:id',deleteUser);
router.put('/:id',updateUser);

export default router;
