import express from "express";
import mongoose from "mongoose";
import Wishlist from "../models/wishList.js";
import { isAuth } from "../middleware/isAuth.js"; // JWT Authentication Middleware

const router = express.Router();

// ✅ Add product to wishlist with category validation
router.post("/add", isAuth, async (req, res) => {
  try {
    // const userId = req.user._id;
    let { productId, category , userId} = req.body;
    console.log(category);

    // 🚨 Check if required fields exist
    if (!productId || !category) {
      return res
        .status(400)
        .json({ error: "Product ID and category are required" });
    }

    // 🚨 Ensure the category exists dynamically in the database
    const existingCollections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionNames = existingCollections.map((col) => col.name);

    if (!collectionNames.includes(category)) {
      return res
        .status(400)
        .json({ error: "Invalid category. Collection does not exist." });
    }

    // ✅ Dynamically define the model with a generic schema
    let ProductModel;
    if (mongoose.models[category]) {
      ProductModel = mongoose.model(category); // Use existing model if available
    } else {
      ProductModel = mongoose.model(
        category,
        new mongoose.Schema({}, { strict: false }),
        category
      );
    }

    // 🚨 Check if the product exists in the given category
    const productExists = await ProductModel.findById(productId);
    if (!productExists) {
      return res
        .status(404)
        .json({ error: "Product not found in the specified category" });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, products: [{ productId, category }] });
    } else {
      if (!Array.isArray(wishlist.products)) {
        wishlist.products = []; // Ensure products array exists
      }

      // 🚨 Convert `productId` to ObjectId to avoid mismatches
      productId = new mongoose.Types.ObjectId(productId);

      const isAlreadyInWishlist = wishlist.products.some(
        (item) => item.productId?.toString() === productId.toString()
      );

      if (!isAlreadyInWishlist) {
        wishlist.products.push({ productId, category });
      } else {
        return res.status(400).json({ error: "Product already in wishlist" });
      }
    }

    await wishlist.save();
    res.status(200).json({ message: "Product added to wishlist", wishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ Get user's wishlist
router.get("/my-wishlist", isAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist || wishlist.products.length === 0) {
      return res.status(404).json({ message: "No wishlist found" });
    }

    let populatedWishlist = [];

    for (const item of wishlist.products) {
      try {
        // ✅ Check if model exists before defining
        let ProductModel;
        if (mongoose.models[item.category]) {
          ProductModel = mongoose.model(item.category);
        } else {
          ProductModel = mongoose.model(
            item.category,
            new mongoose.Schema({}, { strict: false }),
            item.category
          );
        }

        const product = await ProductModel.findById(item.productId);
        if (product) {
          populatedWishlist.push({
            ...product.toObject(),
            category: item.category,
          });
        }
      } catch (err) {
        console.error(
          `Error fetching product from collection ${item.category}:`,
          err.message
        );
      }
    }

    res.status(200).json(populatedWishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Remove product from wishlist
router.post("/remove", isAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist || !wishlist.products || wishlist.products.length === 0) {
      return res.status(404).json({ message: "Wishlist not found or empty" });
    }

    // 🚨 Ensure `productId` is a valid ObjectId
    const productIdStr = productId.toString();

    const productIndex = wishlist.products.findIndex(
      (item) => item?.productId?.toString() === productIdStr
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in wishlist" });
    }

    const category = wishlist.products[productIndex].category;

    // Remove the product from the wishlist array
    wishlist.products.splice(productIndex, 1);
    await wishlist.save();

    res
      .status(200)
      .json({ message: "Product removed from wishlist", category });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
