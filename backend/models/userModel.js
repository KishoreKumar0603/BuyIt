import mongoose from "mongoose";
import bcrypt from "bcryptjs";



const userSchema = new mongoose.Schema(
  {
    username :{ type : String , required : true, unique: true},
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    phone: { type: String },
    gender: { type: String, enum: ["male", "female"], required: false },
    address: {
      street: { type: String },
      city: { type: String },
      zip: { type: String },
      country: { type: String },
    },
    profilePic: { type: String, default: "default.png" },
  },
  {
    timestamps:true
  }
);


userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
