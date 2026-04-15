import express from "express";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import Order from "../models/orders.js";
import { isAuth } from "../middleware/isAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// Get dashboard stats
router.get("/stats", isAuth, isAdmin, async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments({ role: "user" });

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Total revenue
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Recent orders (last 10)
    const recentOrders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      totalUsers,
      totalOrders,
      totalRevenue,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
