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
      (col) => col.name === correctCategory,
    );

    if (!collectionExists) {
      return res.status(404).json({
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
      rating: rating || 0,
      features,
      image_url: imageUrl,
      sold: sold || 0,
      reviews: [],
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
    const {
      category,
      search,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      page = 1,
      limit = 10,
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    let collectionsToSearch = [];

    if (category) {
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

      const collectionName = categoryData.name;

      // 🔍 Step 2: Check if the collection exists
      const collections = await mongoose.connection.db
        .listCollections()
        .toArray();
      const collectionExists = collections.some(
        (col) => col.name === collectionName,
      );

      if (!collectionExists) {
        return res.status(404).json({ message: "Category not found" });
      }

      collectionsToSearch = [collectionName];
    } else {
      // If no category specified, search all product collections
      const allCollections = await mongoose.connection.db
        .listCollections()
        .toArray();
      // Filter collections that are product categories (exclude system collections)
      const categoryNames = await Category.find({}, "name");
      const categoryNameSet = new Set(categoryNames.map((c) => c.name));
      collectionsToSearch = allCollections
        .filter((col) => categoryNameSet.has(col.name))
        .map((col) => col.name);
    }

    let allProducts = [];
    let totalCount = 0;

    for (const collectionName of collectionsToSearch) {
      const ProductModel =
        mongoose.models[collectionName] ||
        mongoose.model(
          collectionName,
          new mongoose.Schema({}, { strict: false }),
          collectionName,
        );

      let query = {};

      // Keyword search
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { brand: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      // Price filtering
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
      }

      // Get total count for pagination
      const count = await ProductModel.countDocuments(query);
      totalCount += count;

      // Get paginated products
      let products = await ProductModel.find(query).skip(skip).limit(limitNum);

      // Add category info to each product
      products = products.map((product) => ({
        ...product.toObject(),
        category: collectionName,
      }));

      allProducts.push(...products);
    }

    // Sorting
    if (sortBy) {
      const order = sortOrder === "desc" ? -1 : 1;
      allProducts.sort((a, b) => {
        if (sortBy === "price") {
          return (a.price - b.price) * order;
        } else if (sortBy === "rating") {
          return (a.rating - b.rating) * order;
        }
        return 0;
      });
    }

    // Apply pagination to the final sorted results
    const startIndex = skip;
    const endIndex = startIndex + limitNum;
    const paginatedProducts = allProducts.slice(startIndex, endIndex);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.json({
      products: paginatedProducts,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProducts: totalCount,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1,
        limit: limitNum,
      },
    });
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
        category,
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
          category,
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
          category,
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
          oldCategory,
        );

      await OldProductModel.findByIdAndDelete(id);

      const NewProductModel =
        mongoose.models[newCategory] ||
        mongoose.model(
          newCategory,
          new mongoose.Schema({}, { strict: false }),
          newCategory,
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
        oldCategory,
      );

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
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

export const addReview = async (req, res) => {
  try {
    const { category, id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Check if category exists
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    const collectionExists = collections.some((col) => col.name === category);
    if (!collectionExists) {
      return res
        .status(404)
        .json({ message: `Category '${category}' not found` });
    }

    // Get ProductModel
    const ProductModel =
      mongoose.models[category] ||
      mongoose.model(
        category,
        new mongoose.Schema({}, { strict: false }),
        category,
      );

    const product = await ProductModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already reviewed
    const existingReview = product.reviews.find(
      (review) => review.userId.toString() === userId.toString(),
    );
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    // Add review
    product.reviews.push({
      userId,
      rating,
      comment: comment || "",
      createdAt: new Date(),
    });

    // Calculate average rating
    product.calculateAverageRating();

    await product.save();

    res.status(201).json({ message: "Review added successfully", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
