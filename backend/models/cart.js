import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, required: true },
            category: { type: String, required: true }, // ✅ Ensure category is required
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
    totalPrice: { type: Number, default: 0 }
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
