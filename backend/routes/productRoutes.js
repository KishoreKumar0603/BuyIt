import express from "express";
import { getProductsByCategory, deleteProduct, updateProduct, getProductById } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProductsByCategory);
router.get("/:category/:id", getProductById);
router.delete('/:id',deleteProduct);
router.put("/:id",updateProduct);

export default router;
