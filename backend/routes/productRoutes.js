import express from "express";
import { getProductsByCategory, addProduct, deleteProduct, updateProduct, getProductById } from "../controllers/productController.js";
import { upload } from "../middleware/upload.js"; // Ensure correct path

const router = express.Router();

router.get("/", getProductsByCategory);
router.get("/:category/:id", getProductById);
router.post('/add',upload.single("file"),addProduct);
router.delete('/:id',deleteProduct);
router.put("/:id",updateProduct);

export default router;
