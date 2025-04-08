import express from "express";
import Cart from "../models/cart.js";
import getProductModel from "../models/products.js";

const router = express.Router();

import mongoose from "mongoose";
// // ✅ Add item to cart
// router.post("/add", async (req, res) => {
//     try {
//       const { userId, productId, category, quantity, price } = req.body; 
//       let cart = await Cart.findOne({ userId });
  
//       if (!cart) {
//         cart = new Cart({ userId, items: [], totalPrice: 0 });
//       }
//       if (!category) {
//         return res.status(400).json({ error: "Category is required" });
//       }
  
//       const existingItem = cart.items.find((item) => item.productId.toString() === productId);
      
//       if (existingItem) {
//         existingItem.quantity += quantity;
//       } else {
//         cart.items.push({ productId, category, quantity });
//       }
  
//       cart.totalPrice += price * quantity;
//       await cart.save();
//       res.status(200).json(cart);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
// });

// ✅ Add item to cart
router.post("/add", async (req, res) => {
  try {
    const { userId, productId, category, quantity } = req.body;

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    const Product = getProductModel(category);
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ error: `Only ${product.stock} in stock` });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [], totalPrice: 0 });
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    const itemTotal = product.price * quantity;

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        return res.status(400).json({ error: `Only ${product.stock} in stock` });
      }

      existingItem.quantity = newQuantity;
      existingItem.itemTotal = newQuantity * product.price;
    } else {
      cart.items.push({
        productId,
        category,
        quantity,
        itemTotal,
      });
    }

    // 🔄 Recalculate totalPrice
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.itemTotal, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    console.error("Add to cart error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

  


// // ✅ Get User Cart with Product Details
// router.get("/:userId", async (req, res) => {
//   try {
//     const Id = new mongoose.Types.ObjectId(req.params.userId);
//     console.log("User ID in Cart: "+ Id);
//     const cart = await Cart.findOne({"userId":Id});
//     console.log(cart);

//     if (!cart) return res.status(404).json({ message: "Cart not found" });

//     // Dynamically fetch product details for each item
//     const populatedItems = await Promise.all(
//       cart.items.map(async (item) => {
//         const ProductModel = getProductModel(item.category); // Get correct model
//         const product = await ProductModel.findById(item.productId);
//         return product ? { ...item.toObject(), product } : null;
//       })
//     );

//     cart.items = populatedItems.filter(Boolean); // Remove null items (if any)

//     res.status(200).json(cart);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

router.get('/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const populatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const ProductModel = getProductModel(item.category); // Dynamically get model
        const product = await ProductModel.findById(item.productId);

        return {
          ...item.toObject(),
          product,
        };
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

router.put("/update/:userId", async (req, res) => {
  try {
    const { productId, category, quantity } = req.body;

    const Product = getProductModel(category);
    const product = await Product.findById(productId);

    if (!product) return res.status(404).json({ message: "Product not found" });

    if (quantity > product.stock) {
      return res.status(400).json({ message: `Only ${product.stock} in stock` });
    }

    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((item) => item.productId.toString() === productId);

    if (item) {
      item.quantity = quantity;
      item.itemTotal = product.price * quantity;

      cart.totalPrice = cart.items.reduce((sum, i) => sum + i.itemTotal, 0);

      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (err) {
    console.error("❌ Update cart error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Remove item from cart
router.delete("/remove/:userId/:productId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.productId.toString() !== req.params.productId);
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Clear cart
router.delete("/clear/:userId", async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.params.userId });
    res.status(200).json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
