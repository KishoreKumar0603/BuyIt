// models/addressModel.js
import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: String,
  phone: String,
  address: String,
});

const Address = mongoose.model("Address", addressSchema);
export default Address;
