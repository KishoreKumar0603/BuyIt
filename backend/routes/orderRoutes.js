import express from "express";
import mongoose from "mongoose";
import Order from "../models/orders.js";
import { isAuth } from "../middleware/isAuth.js";
import sendMail from "../middleware/sendMail.js";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
const router = express.Router();

dotenv.config();

// ✅ Place Order
// router.post("/place", isAuth, async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { products } = req.body;

//     if (!products || products.length === 0) {
//       return res.status(400).json({ error: "No products selected for purchase." });
//     }

//     let totalAmount = 0;
//     const orderItems = [];

//     for (const item of products) {
//       const { productId, category, quantity } = item;

//       // ✅ Dynamically define the model if not already registered
//       if (!mongoose.connection.models[category]) {
//         const dynamicSchema = new mongoose.Schema({}, { strict: false });
//         mongoose.model(category, dynamicSchema, category);
//       }

//       const ProductModel = mongoose.model(category);
//       const product = await ProductModel.findById(productId);

//       if (!product) {
//         return res.status(404).json({ error: `Product not found in ${category}` });
//       }

//       const price = product.price * quantity;
//       totalAmount += price;

//       orderItems.push({ productId, category, quantity, price });
//     }

//     const order = new Order({
//       userId,
//       products: orderItems,
//       totalAmount,
//       paymentStatus: "Pending",
//       orderStatus: "Processing"
//     });

//     await order.save();
//     res.status(201).json({ message: "Order placed successfully", order });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

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

      // ✅ Dynamically define the model if not already registered
      if (!mongoose.connection.models[category]) {
        const dynamicSchema = new mongoose.Schema({}, { strict: false });
        mongoose.model(category, dynamicSchema, category);
      }

      const ProductModel = mongoose.model(category);
      const product = await ProductModel.findById(productId);

      if (!product) {
        return res.status(404).json({ error: `Product not found in ${category}` });
      }

      const price = product.price * quantity;
      totalAmount += price;
      orderItems.push({ productId, category, quantity, price });
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000);
    const orderToken = jwt.sign(
      { userId, email, orderItems, totalAmount, otp },
      process.env.ORDER_SECRET,
      { expiresIn: "5m" }
    );

    // Email Content
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
        <h2 style="text-align: center; color: black;">BuyIt - Order Verification</h2>
        <p style="color: #555; text-align: center;">Hello,</p>
        <p style="color: #555; text-align: center;">Your order is almost complete! Please verify your order by entering this OTP:</p>
        <div style="text-align: center; background: rgba(124, 124, 124, 0.82); color: white; padding: 15px; font-size: 24px; font-weight: bold; border-radius: 5px;">
          ${otp}
        </div>
        <p style="text-align: center; color: #777; font-size: 14px;">This OTP is valid for <strong>5 minutes</strong>.</p>
        <hr style="border: 0; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="text-align: center; font-size: 12px; color: #999;">&copy; 2025 BuyIt. All rights reserved.</p>
      </div>
    `;

    await sendMail(email, "BuyIt - Order Verification", message);

    return res.status(200).json({
      message: "OTP sent to your email. Please verify to complete the order.",
      orderToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// OTP Verification Route
router.post("/verify-order", isAuth, async (req, res) => {
  try {
    const { otp, orderToken } = req.body;

    if (!orderToken) {
      return res.status(400).json({ message: "Order verification failed." });
    }

    let decoded;
    try {
      decoded = jwt.verify(orderToken, process.env.ORDER_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).json({ message: "OTP has expired. Please try again." });
      }
      return res.status(400).json({ message: "Invalid OTP token." });
    }

    if (decoded.otp.toString() !== otp.toString()) {
      return res.status(400).json({ message: "Incorrect OTP. Please try again." });
    }

    // Save order in database
    const order = new Order({
      userId: decoded.userId,
      products: decoded.orderItems,
      totalAmount: decoded.totalAmount,
      paymentStatus: "Completed",
      orderStatus: "Processing",
    });

    await order.save();
    return res.status(200).json({ message: "Order placed successfully!", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ Get User Orders
router.get("/my-orders", isAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId }).populate("products.productId");

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
