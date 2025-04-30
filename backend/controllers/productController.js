import mongoose from "mongoose";
import Category from "../models/categoryModel.js";

export const addProduct = async (req, res) => {
  try {
    const { title, brand, category, stock, price, rating, features, sold } =
      req.body;

    if (!title || !brand || !category.main || !stock || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Convert category name for consistency
    const userCategory = category.main.toLowerCase().replace(/\s+/g, "_");

    const categoryMapping = await Category.findOne({ aliases: userCategory });

    const correctCategory = categoryMapping
      ? categoryMapping.category_name
      : userCategory;

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionExists = collections.some(
      (col) => col.name === correctCategory
    );

    if (!collectionExists) {
      return res
        .status(404)
        .json({
          message: `Category '${correctCategory}' not found in the database.`,
        });
    }

    // 🛠 Step 3: Upload Image & Get URL
    let imageUrl = "N/A";
    if (req.file) {
      const uploadResponse = await new Promise((resolve, reject) => {
        uploadImage(req, {
          json: (data) => resolve(data),
          status: () => ({ json: (data) => reject(data) }),
        });
      });
      imageUrl = uploadResponse.url;
    }
    const dynamicSchema = new mongoose.Schema({}, { strict: false });

    const ProductModel =
      mongoose.models[correctCategory] ||
      mongoose.model(correctCategory, dynamicSchema, correctCategory);

    const newProduct = new ProductModel({
      title,
      brand,
      category: { main: correctCategory, sub: category.sub || "N/A" },
      stock,
      price,
      rating: rating || "N/A",
      features,
      image_url: imageUrl,
      sold: sold || 0,
    });

    await newProduct.save();
    res
      .status(201)
      .json({ message: "Product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    // 🔍 Step 1: Find the correct collection name using category aliases
    const categoryData = await Category.findOne({
      $or: [
        { name: category.toLowerCase() },
        { aliases: category.toLowerCase() },
      ],
    });

    if (!categoryData) {
      return res.status(404).json({ message: "Category not found" });
    }

    const collectionName = categoryData.name; // The actual collection name (e.g., "mobiles")

    // 🔍 Step 2: Check if the collection exists
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionExists = collections.some(
      (col) => col.name === collectionName
    );

    if (!collectionExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    // ✅ Use existing model or create one dynamically
    const ProductModel =
      mongoose.models[collectionName] ||
      mongoose.model(
        collectionName,
        new mongoose.Schema({}, { strict: false }),
        collectionName
      );

    // Fetch products from the correct collection
    const products = await ProductModel.find();

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { category, id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID format" });
    }

    // Check if the category (collection name) exists
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionExists = collections.some((col) => col.name === category);

    if (!collectionExists) {
      return res
        .status(404)
        .json({ message: `Category '${category}' not found` });
    }

    // Dynamically create model for the given category
    const ProductModel =
      mongoose.models[category] ||
      mongoose.model(
        category,
        new mongoose.Schema({}, { strict: false }),
        category
      );

    const product = await ProductModel.findById(id);
    // console.log(product);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // Get product ID from URL

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Get all categories (collections) from the database
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionNames = collections.map((col) => col.name);

    let deletedProduct = null;
    let deletedCategory = null;

    // Loop through collections to find the product
    for (const category of collectionNames) {
      // Get the model dynamically
      const ProductModel =
        mongoose.models[category] ||
        mongoose.model(
          category,
          new mongoose.Schema({}, { strict: false }),
          category
        );

      // Try to find the product in this collection
      const product = await ProductModel.findById(id);

      if (product) {
        // If found, delete it
        deletedProduct = await ProductModel.findByIdAndDelete(id);
        deletedCategory = category;
        break;
      }
    }

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ message: "Product not found in any category" });
    }

    res.status(200).json({
      message: "Product deleted successfully",
      category: deletedCategory,
      product: deletedProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionNames = collections.map((col) => col.name);

    let productToUpdate = null;
    let oldCategory = null;
    for (const category of collectionNames) {
      const ProductModel =
        mongoose.models[category] ||
        mongoose.model(
          category,
          new mongoose.Schema({}, { strict: false }),
          category
        );

      const product = await ProductModel.findById(id);

      if (product) {
        productToUpdate = product;
        oldCategory = category;
        break;
      }
    }

    if (!productToUpdate) {
      return res
        .status(404)
        .json({ message: "Product not found in any category" });
    }
    let newCategory = productToUpdate.category.main;
    if (updateData.category && updateData.category.main) {
      const userCategory = updateData.category.main
        .toLowerCase()
        .replace(/\s+/g, "_");
      const categoryMapping = await Category.findOne({ aliases: userCategory });

      newCategory = categoryMapping
        ? categoryMapping.category_name
        : userCategory;
    }

    if (newCategory !== oldCategory) {
      const OldProductModel =
        mongoose.models[oldCategory] ||
        mongoose.model(
          oldCategory,
          new mongoose.Schema({}, { strict: false }),
          oldCategory
        );

      await OldProductModel.findByIdAndDelete(id);

      const NewProductModel =
        mongoose.models[newCategory] ||
        mongoose.model(
          newCategory,
          new mongoose.Schema({}, { strict: false }),
          newCategory
        );

      const updatedProduct = new NewProductModel({
        ...productToUpdate.toObject(),
        ...updateData,
        category: { main: newCategory, sub: updateData.category?.sub || "N/A" },
      });

      await updatedProduct.save();

      return res.status(200).json({
        message: "Product updated and moved to new category",
        oldCategory,
        newCategory,
        product: updatedProduct,
      });
    }

    const ProductModel =
      mongoose.models[oldCategory] ||
      mongoose.model(
        oldCategory,
        new mongoose.Schema({}, { strict: false }),
        oldCategory
      );

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: "Product updated successfully",
      category: oldCategory,
      product: updatedProduct,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};
