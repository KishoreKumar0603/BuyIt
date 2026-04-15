import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRouter.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import forgotPassRoutes from "./routes/forgotPasswordRoutes.js";
import cookieParser from "cookie-parser";
import addressRoutes from "./routes/addressRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import passport from "./config/passport.js";
import session from "express-session";

dotenv.config();

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://buy-it-git-main-kishorekumars-projects-f69373c8.vercel.app",
  "https://buy-it-pink.vercel.app",
  "https://buy-ab976nzi5-kishorekumars-projects-f69373c8.vercel.app/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Session configuration for passport
app.use(
  session({
    secret: process.env.JWT_SECRET || "BuyItSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/user/forgot", forgotPassRoutes);
app.use("/api/products", productRoutes);
app.use("/api/products/category", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/admin", adminRoutes);

app.get(["/", "/home", "/index"], (req, res) => {
  res.send("BuyIt Backend is Running!");
});

const PORT = process.env.PORT;
mongoose
  .connect(
    process.env.MONGO_URI ||
      "mongodb+srv://kishorekumar0603:kk1606@buyit.2kfyowp.mongodb.net/BuyIt",
  )
  .then(() => {
    console.log(process.env.MONGO_URI);
    console.log("MongoDB Connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
