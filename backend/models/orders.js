import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, required: true },
        category: { type: String, required: true }, // Collection name
        quantity: { type: Number, required: true, default: 1 },
        price: { type: Number, required: true },
      },
    ],

    shippingAddress: { type: String},
    totalAmount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Canceled"],
      default: "Processing",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
