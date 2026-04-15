import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // username :{ type : String , required : true, unique: true},
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: function () {
        return !this.googleId;
      },
    }, // Password required only for non-OAuth users
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
    refreshToken: { type: String },
    // Google OAuth fields
    googleId: { type: String, sparse: true },
    isVerified: { type: Boolean, default: false },
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    needsAdditionalInfo: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
