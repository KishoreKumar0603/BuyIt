import express from "express";
import { upload } from "../middleware/upload.js"; // Ensure correct path
import { uploadImage } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/upload", upload.single("image"), uploadImage); // ✅ Ensure field name matches Postman key

export default router;
