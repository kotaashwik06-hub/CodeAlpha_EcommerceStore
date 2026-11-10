
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

// Order routes
app.use("/api/orders", orderRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to ShopEase Backend API!");
});

// Test route
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "ShopEase Backend is working successfully!"
    });
});

// Server port
const PORT = process.env.PORT || 5001;

// Connect MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(`ShopEase server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(
            "MongoDB connection failed:",
            error.message
        );

        process.exit(1);
    });
