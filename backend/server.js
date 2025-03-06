import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";


dotenv.config();

const app = express();
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
}));
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.get(["/","/home",'/index'], (req, res) => {
  res.send("BuyIt Backend is Running!");
});

const PORT = process.env.PORT;
mongoose
.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

})
.catch((err) => console.error(err));