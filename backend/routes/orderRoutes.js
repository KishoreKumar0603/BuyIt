import express from "express";
import mongoose from "mongoose";
import Order from "../models/orders.js";
import { isAuth } from "../middleware/isAuth.js";
import dotenv from "dotenv";
const router = express.Router();
import Cart from "../models/cart.js";


dotenv.config();
router.post("/place", isAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const email = req.user.email;
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ error: "No products selected for purchase." });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of products) {
      const { productId, category, quantity } = item;

      // Dynamically load model
      if (!mongoose.connection.models[category]) {
        const dynamicSchema = new mongoose.Schema({}, { strict: false });
        mongoose.model(category, dynamicSchema, category);
      }
      const ProductModel = mongoose.model(category);

      const product = await ProductModel.findById(productId);
      if (!product) {
        return res.status(404).json({ error: `Product not found in ${category}` });
      }

      // ✅ Atomic Update (Conditional Quantity Check + Decrement)
      const updateResult = await ProductModel.updateOne(
        { _id: productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } }
      );

      if (updateResult.modifiedCount === 0) {
        return res.status(400).json({
          error: `Insufficient stock for ${product.title || "this product"}. Only ${product.quantity} left.`,
        });
      }

      const price = product.price * quantity;
      totalAmount += price;

      orderItems.push({
        productId,
        category,
        quantity,
        price,
        title: product.title,
        image_url: product.image_url,
      });
    }

    // Save Order
    let existingOrder = await Order.findOne({ userId });
    if (existingOrder) {
      existingOrder.products.push(...orderItems);
      existingOrder.totalAmount += totalAmount;
      existingOrder.updatedAt = new Date();
      await existingOrder.save();
      res.status(200).json({ message: "Order updated successfully!" });
    } else {
      const newOrder = new Order({
        userId,
        email,
        products: orderItems,
        totalAmount,
        status: "Confirmed",
        paymentStatus: "Pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await newOrder.save();
      res.status(200).json({ message: "Order placed successfully!" });
    }

    // Clear cart after successful order
    await Cart.deleteMany({ userId });

  } catch (error) {
    console.error("❌ Order Placement Error:", error);
    res.status(500).json({ error: error.message || "Something went wrong while placing order." });
  }
});



router.get("/my-orders", isAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId }).populate(
      "products.productId", // ✅ Fetch title, image_url and _id
    );

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// 🚀 DELETE Order by ID
router.delete("/:orderId", isAuth, async (req, res) => {
    try {
      const { orderId } = req.params;
      const userId = req.user._id;
  
      // 🔍 Find the order
      const order = await Order.findOne({ _id: orderId, userId });
  
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
  
      // 🔥 Allow deletion only if order is still in 'Processing'
      if (order.orderStatus !== "Processing") {
        return res.status(400).json({ error: "Order cannot be canceled at this stage." });
      }
  
      await Order.deleteOne({ _id: orderId });
  
      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

export default router;
