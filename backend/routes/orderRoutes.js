import express from "express";
import mongoose from "mongoose";
import Order from "../models/orders.js";
import { isAuth } from "../middleware/isAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";
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
      return res
        .status(400)
        .json({ error: "No products selected for purchase." });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of products) {
      const { productId, category, quantity } = item;

      if (!mongoose.connection.models[category]) {
        const dynamicSchema = new mongoose.Schema({}, { strict: false });
        mongoose.model(category, dynamicSchema, category);
      }
      const ProductModel = mongoose.model(category);

      const product = await ProductModel.findById(productId);
      if (!product) {
        return res
          .status(404)
          .json({ error: `Product not found in ${category}` });
      }

      const updateResult = await ProductModel.updateOne(
        { _id: productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
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
        orderStatus: "pending",
        paymentStatus: "Pending",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await newOrder.save();
      res.status(200).json({ message: "Order placed successfully!" });
    }

    await Cart.deleteMany({ userId });
  } catch (error) {
    console.error("❌ Order Placement Error:", error);
    res.status(500).json({
      error: error.message || "Something went wrong while placing order.",
    });
  }
});

router.get("/my-orders", isAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const totalOrders = await Order.countDocuments({ userId });
    const orders = await Order.find({ userId })
      .populate("products.productId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    const totalPages = Math.ceil(totalOrders / limitNum);

    res.status(200).json({
      orders,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalOrders,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        limit: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:orderId", isAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user._id;

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.orderStatus !== "pending") {
      return res
        .status(400)
        .json({ error: "Order cannot be canceled at this stage." });
    }

    await Order.deleteOne({ _id: orderId });

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/all-orders", isAuth, isAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let query = {};
    if (status && status !== "all") {
      query.orderStatus = status;
    }

    const totalOrders = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalOrders / limitNum);

    res.status(200).json({
      orders,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalOrders,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        limit: limitNum,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/update-status/:orderId", isAuth, isAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    if (
      !["pending", "paid", "shipped", "delivered", "cancelled"].includes(
        orderStatus,
      )
    ) {
      return res.status(400).json({ error: "Invalid order status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    order.orderStatus = orderStatus;
    order.updatedAt = new Date();
    await order.save();

    res
      .status(200)
      .json({ message: "Order status updated successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
