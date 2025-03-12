import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
    },
  ],
});

export default mongoose.model("Wishlist", WishlistSchema);
