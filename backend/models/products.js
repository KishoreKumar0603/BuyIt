import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, lowercase: true, trim: true },  // Use lowercase category names
    stock: { type: Number, required: true, min: 0 },  // Prevents negative stock
    price: { type: Number, required: true, min: 0 },  // Prevents negative price
    rating: { type: String, default: "N/A" },
    features: { type: mongoose.Schema.Types.Mixed }, // Supports objects, arrays, etc.
    image_url: { type: String, default: "N/A" },
    sold: { type: Number, default: 0, min: 0 },  // Prevents negative sales count
    created_at: { type: Date, default: Date.now },  // Corrected timestamp
});

/**
 * Get or create a Mongoose model dynamically based on category name.
 * @param {string} category - The main category name (e.g., "Laptops", "Mobiles").
 * @returns {mongoose.Model} - The corresponding Mongoose model.
 */
const getProductModel = (category) => {
    const collectionName = category.toLowerCase().replace(/\s+/g, "_"); // Normalize name
    
    if (mongoose.models[collectionName]) {
        return mongoose.models[collectionName];  // Use existing model if already defined
    }
    
    return mongoose.model(collectionName, productSchema, collectionName);  // Create new model
};

export default getProductModel;
