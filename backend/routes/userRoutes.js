import express from "express";
import {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
  } from "../controllers/userController.js";
  

const router = express.Router();
import { protect, admin } from "../middleware/authMiddleware.js";


//Public Routes ( No authentication required )
router.post("/login", loginUser);
router.post("/register", registerUser);

//Get all records
router.get("/", protect, admin, getAllUsers);

//Get certain record
router.get("/:id", getUserById);

//Update Record
router.put("/:id", updateUser);

//Delete a Record
router.delete("/:id", deleteUser);

export default router;

