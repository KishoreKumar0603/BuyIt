import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRouter.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from './routes/orderRoutes.js';
import forgotPassRoutes from './routes/forgotPasswordRoutes.js';
import cookieParser from "cookie-parser";
import addressRoutes from './routes/addressRoutes.js';


dotenv.config();

const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'https://buy-it-git-main-kishorekumars-projects-f69373c8.vercel.app',
  'https://buy-it-pink.vercel.app',
  'https://buy-ab976nzi5-kishorekumars-projects-f69373c8.vercel.app/',

];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//     methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: "Content-Type,Authorization",
//   })
// );
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/user/forgot", forgotPassRoutes);
app.use("/api/products", productRoutes);
app.use("/api/products/category", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/addresses", addressRoutes);

app.get(["/", "/home", "/index"], (req, res) => {
  res.send("BuyIt Backend is Running!");
});

const PORT = process.env.PORT;
mongoose
  .connect(process.env.MONGO_URI || "mongodb+srv://kishorekumar0603:kk1606@buyit.2kfyowp.mongodb.net/BuyIt")
  .then(() => {
    console.log(process.env.MONGO_URI);
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
