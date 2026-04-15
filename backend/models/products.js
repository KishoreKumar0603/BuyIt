import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  category: { type: String, required: true, lowercase: true, trim: true },
  stock: { type: Number, required: true, min: 0 },
  price: { type: Number, required: true, min: 0 },
  rating: { type: Number, default: 0 }, // Changed to Number for average
  description: { type: String },
  features: { type: mongoose.Schema.Types.Mixed },
  image_url: { type: String, default: "N/A" },
  sold: { type: Number, default: 0, min: 0 },
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, trim: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  created_at: { type: Date, default: Date.now },
});

// Method to calculate average rating
productSchema.methods.calculateAverageRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    return;
  }
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.rating = sum / this.reviews.length;
};

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
