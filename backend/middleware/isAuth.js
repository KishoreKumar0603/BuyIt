import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Please login to access" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded._id).select("-password");

    if (!req.user) {
      return res.status(403).json({ message: "User not found" });
    }

    console.log("✅ Authenticated:", req.user.name);
    next();
  } catch (error) {
    console.error("❌ Auth Error:", error.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
