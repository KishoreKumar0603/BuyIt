import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const isAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ message: "Please Login to access" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Received Token:", token); // Debugging

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedToken._id).select("-password");

    if (!req.user) {
      return res.status(403).json({ message: "User not found" });
    }

    console.log("Authenticated User:", req.user); // Debugging
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(403).json({ message: "Invalid Token" });
  }
};
