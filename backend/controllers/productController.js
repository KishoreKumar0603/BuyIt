import mongoose from "mongoose";
import Category from "../models/categoryModel.js";
import { uploadImage } from "./uploadController.js";

export const addProduct = async (req, res) => {
    try {
      const { title, brand, category, stock, price, rating, features, sold } = req.body;
      
      if (!title || !brand || !category.main || !stock || !price) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      // Convert category name for consistency
      const userCategory = category.main.toLowerCase().replace(/\s+/g, "_");
  
      // 🔍 Step 1: Find the correct category using aliases
      const categoryMapping = await Category.findOne({ aliases: userCategory });
  
      // Get the correct category name (or fallback to user input)
      const correctCategory = categoryMapping ? categoryMapping.category_name : userCategory;
  
      // 🔍 Step 2: Check if the collection exists
      const collections = await mongoose.connection.db.listCollections().toArray();
      const collectionExists = collections.some(col => col.name === correctCategory);
  
      if (!collectionExists) {
        return res.status(404).json({ message: `Category '${correctCategory}' not found in the database.` });
      }
  
      // 🛠 Step 3: Upload Image & Get URL
      let imageUrl = "N/A";
      if (req.file) {
        const uploadResponse = await new Promise((resolve, reject) => {
          uploadImage(req, {
            json: (data) => resolve(data),
            status: () => ({ json: (data) => reject(data) })
          });
        });
        imageUrl = uploadResponse.url;
      }
  
      // ✅ Step 4: Use dynamic schema for flexible fields
      const dynamicSchema = new mongoose.Schema({}, { strict: false });
  
      // ✅ Use existing model or create a new one dynamically
      const ProductModel = mongoose.models[correctCategory] || mongoose.model(correctCategory, dynamicSchema, correctCategory);
  
      // Create a new product entry
      const newProduct = new ProductModel({
        title,
        brand,
        category: { main: correctCategory, sub: category.sub || "N/A" },
        stock,
        price,
        rating: rating || "N/A",
        features,
        image_url: imageUrl,
        sold: sold || 0
      });
  
      // Save product to database
      await newProduct.save();
      res.status(201).json({ message: "Product added successfully", product: newProduct });
  
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
            $or: [{ name: category.toLowerCase() }, { aliases: category.toLowerCase() }]
        });

        if (!categoryData) {
            return res.status(404).json({ message: "Category not found" });
        }

        const collectionName = categoryData.name; // The actual collection name (e.g., "mobiles")

        // 🔍 Step 2: Check if the collection exists
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionExists = collections.some(col => col.name === collectionName);

        if (!collectionExists) {
            return res.status(404).json({ message: "Category not found" });
        }

        // ✅ Use existing model or create one dynamically
        const ProductModel = mongoose.models[collectionName] || mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }), collectionName);

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
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionExists = collections.some(col => col.name === category);

        if (!collectionExists) {
            return res.status(404).json({ message: `Category '${category}' not found` });
        }

        // Dynamically create model for the given category
        const ProductModel =
            mongoose.models[category] ||
            mongoose.model(category, new mongoose.Schema({}, { strict: false }), category);

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


// export const getProductById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({ message: "Invalid product ID format" });
//         }

//         // 🔍 Step 1: Iterate over all collections to find where the product exists
//         const collections = await mongoose.connection.db.listCollections().toArray();
//         let foundProduct = null;

//         for (const collection of collections) {
//             const collectionName = collection.name;

//             // Dynamically create model for each collection
//             const ProductModel = mongoose.models[collectionName] || 
//                 mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }), collectionName);

//             // Check if the product exists in this collection
//             const product = await ProductModel.findById(id);
//             if (product) {
//                 foundProduct = product;
//                 break; // Stop searching once the product is found
//             }
//         }

//         if (!foundProduct) {
//             return res.status(404).json({ message: "Product not found in any category" });
//         }

//         res.status(200).json(foundProduct);

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params; // Get product ID from URL

        if (!id) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        // Get all categories (collections) from the database
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);

        let deletedProduct = null;
        let deletedCategory = null;

        // Loop through collections to find the product
        for (const category of collectionNames) {
            // Get the model dynamically
            const ProductModel =
                mongoose.models[category] ||
                mongoose.model(category, new mongoose.Schema({}, { strict: false }), category);

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
            return res.status(404).json({ message: "Product not found in any category" });
        }

        res.status(200).json({ 
            message: "Product deleted successfully", 
            category: deletedCategory,
            product: deletedProduct 
        });

    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
};



export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        if (!id) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        // Get all categories (collections) from the database
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);

        let productToUpdate = null;
        let oldCategory = null;

        // 🔍 Step 1: Find the product in any collection
        for (const category of collectionNames) {
            const ProductModel =
                mongoose.models[category] ||
                mongoose.model(category, new mongoose.Schema({}, { strict: false }), category);

            const product = await ProductModel.findById(id);

            if (product) {
                productToUpdate = product;
                oldCategory = category;
                break;
            }
        }

        if (!productToUpdate) {
            return res.status(404).json({ message: "Product not found in any category" });
        }

        // 🔄 Step 2: Check if category is updated
        let newCategory = productToUpdate.category.main; // Default: old category
        if (updateData.category && updateData.category.main) {
            // Convert user input category to lowercase for consistency
            const userCategory = updateData.category.main.toLowerCase().replace(/\s+/g, "_");

            // Check if the new category exists in the mapping table
            const categoryMapping = await Category.findOne({ aliases: userCategory });

            newCategory = categoryMapping ? categoryMapping.category_name : userCategory;
        }

        // 🚨 Step 3: If category changed, move product to new collection
        if (newCategory !== oldCategory) {
            // Delete product from the old category collection
            const OldProductModel =
                mongoose.models[oldCategory] ||
                mongoose.model(oldCategory, new mongoose.Schema({}, { strict: false }), oldCategory);

            await OldProductModel.findByIdAndDelete(id);

            // Get the new category model dynamically
            const NewProductModel =
                mongoose.models[newCategory] ||
                mongoose.model(newCategory, new mongoose.Schema({}, { strict: false }), newCategory);

            // Save the product in the new category collection
            const updatedProduct = new NewProductModel({
                ...productToUpdate.toObject(), // Copy existing product data
                ...updateData, // Apply new updates
                category: { main: newCategory, sub: updateData.category?.sub || "N/A" }
            });

            await updatedProduct.save();

            return res.status(200).json({
                message: "Product updated and moved to new category",
                oldCategory,
                newCategory,
                product: updatedProduct
            });
        }

        // ✅ Step 4: If category is the same, just update the product
        const ProductModel =
            mongoose.models[oldCategory] ||
            mongoose.model(oldCategory, new mongoose.Schema({}, { strict: false }), oldCategory);

        const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({
            message: "Product updated successfully",
            category: oldCategory,
            product: updatedProduct
        });

    } catch (error) {
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
};