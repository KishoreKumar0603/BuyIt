import express from "express";
import Cart from "../models/cart.js";
import getProductModel from "../models/products.js";
import { isAuth } from "../middleware/isAuth.js"; // adjust path if needed
import mongoose from "mongoose";

const router = express.Router();

// ✅ Add item to cart
router.post("/add", isAuth, async (req, res) => {
  try {
    const userId = req.user._id; // from isAuth
    const { productId, category, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
    }
    const Product = getProductModel(category);
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ error: `Only ${product.stock} in stock` });
    }
    const price = product.price;
    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, category, quantity });
    }

    cart.totalPrice += price * quantity;
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get authenticated user's cart
router.get("/", isAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({
        userId,
        items: [],
        total: 0,
        message: "Cart is empty",
      });
    }

    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const ProductModel = getProductModel(item.category);
        const product = await ProductModel.findById(item.productId);
        return { ...item.toObject(), product };
      })
    );

    const responseCart = {
      ...cart.toObject(),
      items: populatedItems,
    };

    res.json(responseCart);
  } catch (err) {
    console.error("❌ Error fetching cart:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Update cart item quantity
router.put("/update", isAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity, price } = req.body;
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (item) {
      cart.totalPrice += (quantity - item.quantity) * price;
      item.quantity = quantity;
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Patch update by itemId
router.patch("/update/:itemId", isAuth, async (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;
    await cart.save();

    res.json({ message: "Quantity updated", cart });
  } catch (error) {
    console.error("Update error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Remove item from cart
router.delete("/remove/:productId", isAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== req.params.productId
    );
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Clear cart
router.delete("/clear", isAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    await Cart.findOneAndDelete({ userId });
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
