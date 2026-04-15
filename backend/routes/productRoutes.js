import express from "express";
import {
  getProductsByCategory,
  deleteProduct,
  updateProduct,
  getProductById,
  addReview,
  addProduct,
} from "../controllers/productController.js";
import { isAuth } from "../middleware/isAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.get("/", getProductsByCategory);
router.get("/:category/:id", getProductById);
router.post("/", isAuth, isAdmin, addProduct);
router.delete("/:id", isAuth, isAdmin, deleteProduct);
router.put("/:id", isAuth, isAdmin, updateProduct);
router.post("/:category/:id/review", isAuth, addReview);

export default router;
