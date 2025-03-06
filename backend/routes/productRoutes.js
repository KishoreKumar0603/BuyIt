import express from "express";
import { getProductsByCategory } from "../controllers/productController.js";


const router = express.Router();

router.get("/", getProductsByCategory);

export default router;
