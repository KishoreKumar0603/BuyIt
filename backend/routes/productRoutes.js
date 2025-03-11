import express from "express";
import { getProductsByCategory, addProduct, deleteProduct, updateProduct } from "../controllers/productController.js";


const router = express.Router();

router.get("/", getProductsByCategory);
router.post('/add',addProduct);
router.delete('/:id',deleteProduct);
router.put("/:id",updateProduct);

export default router;
