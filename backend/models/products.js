import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, lowercase: true, trim: true },  
    stock: { type: Number, required: true, min: 0 }, 
    price: { type: Number, required: true, min: 0 },  
    rating: { type: String, default: "N/A" },
    description:{type : String},
    features: { type: mongoose.Schema.Types.Mixed },
    image_url: { type: String, default: "N/A" },
    sold: { type: Number, default: 0, min: 0 },  
    created_at: { type: Date, default: Date.now },
});

/**
 * Get or create a Mongoose model dynamically based on category name.
 * @param {string} category - The main category name (e.g., "Laptops", "Mobiles").
 * @returns {mongoose.Model} - The corresponding Mongoose model.
 */
const getProductModel = (category) => {
    const collectionName = category.toLowerCase().replace(/\s+/g, "_");
    
    if (mongoose.models[collectionName]) {
        return mongoose.models[collectionName];  
    }
    
    return mongoose.model(collectionName, productSchema, collectionName);
};

export default getProductModel;
