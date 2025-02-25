import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    brand: { type: String, required: true },
    category: {
        main: { type: String, required: true },
        sub: { type: String, required: true }
    },
    price: { type: Number, required: true },
    rating: { type: String, default: "N/A" },
    features: { type: Map, of: String },
    image_url: { type: String, default: "N/A" },
    link: { type: String, required: true }
}, { timestamps: true });

/**
 * Get or create a Mongoose model dynamically based on category name.
 * @param {string} category - The main category name (e.g., "Laptops", "Mobiles").
 * @returns {mongoose.Model} - The corresponding Mongoose model.
 */
const getProductModel = (category) => {
    const collectionName = category.toLowerCase().replace(/\s+/g, "_"); // Normalize name (e.g., "Laptops" -> "laptops")
    
    if (mongoose.models[collectionName]) {
        return mongoose.models[collectionName]; // Return existing model if already defined
    }
    
    return mongoose.model(collectionName, productSchema, collectionName); // Create new model with the same schema
};

export default getProductModel;
