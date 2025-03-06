import getProductModel from "../models/products.js";
import mongoose from "mongoose";

/**
 * Add a new product dynamically to the corresponding category collection.
 */
export const addProduct = async (req, res) => {
    try {
        const { title, brand, category, stock, price, features, image_url, link } = req.body;
        
        if (!category) {
            return res.status(400).json({ message: "Category is required" });
        }

        const ProductModel = getProductModel(category);
        const newProduct = new ProductModel({ title, brand, category, stock, price, features, image_url, link });

        await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: newProduct });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.query;

        if (!category) {
            return res.status(400).json({ message: "Category is required" });
        }

        // Normalize collection name (convert to lowercase and replace spaces with underscores)
        const collectionName = category.toLowerCase().replace(/\s+/g, "_");

        // Check if the collection exists
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionExists = collections.some(col => col.name === collectionName);

        if (!collectionExists) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Fetch products from the existing category collection
        const ProductModel = mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }), collectionName);
        const products = await ProductModel.find();

        res.json(products);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};