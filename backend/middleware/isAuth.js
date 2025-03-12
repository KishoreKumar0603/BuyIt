import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(403).json({ message: "Please Login to access" });
    }

    console.log("Received Token:", token); // Debugging line

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedToken._id);

    if (!req.user) {
      return res.status(403).json({ message: "User not found" });
    }

    console.log("Authenticated User:", req.user); // Debugging line
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(403).json({ message: "Invalid Token" });
  }
};
