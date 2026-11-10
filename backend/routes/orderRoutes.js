
import express from "express";
import jwt from "jsonwebtoken";
import Order from "../models/Order.js";

const router = express.Router();

// =====================================
// VERIFY LOGIN TOKEN
// =====================================

function verifyToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Please login first."
        });
    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.userId = decoded.userId;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired login session."
        });

    }
}


// =====================================
// CREATE A NEW ORDER
// =====================================

router.post("/", verifyToken, async (req, res) => {

    try {

        const { customer, items } = req.body;

        if (
            !customer ||
            !Array.isArray(items) ||
            items.length === 0
        ) {

            return res.status(400).json({
                success: false,
                message: "Customer details and cart items are required."
            });

        }

        // Validate customer information
        const requiredFields = [
            "name",
            "email",
            "phone",
            "address",
            "city",
            "pincode"
        ];

        for (const field of requiredFields) {

            if (
                !customer[field] ||
                String(customer[field]).trim() === ""
            ) {

                return res.status(400).json({
                    success: false,
                    message: `Please provide ${field}.`
                });

            }

        }

        // Validate products and calculate total
        let total = 0;

        const safeItems = items.map(item => {

            const price = Number(item.price);
            const quantity = Number(item.quantity);

            if (
                !item.name ||
                !Number.isFinite(price) ||
                price < 0 ||
                !Number.isInteger(quantity) ||
                quantity < 1
            ) {

                throw new Error("Invalid product information.");

            }

            total += price * quantity;

            return {
                name: String(item.name),
                price,
                quantity
            };

        });

        // Create order document
        const order = new Order({

            orderId: "ORD" + Date.now(),

            userId: req.userId,

            customer: {
                name: customer.name.trim(),
                email: customer.email.trim(),
                phone: customer.phone.trim(),
                address: customer.address.trim(),
                city: customer.city.trim(),
                pincode: customer.pincode.trim()
            },

            items: safeItems,

            total: total,

            status: "Placed"

        });

        // Save order in MongoDB
        await order.save();

        res.status(201).json({

            success: true,

            message: "Order placed successfully!",

            order: order

        });

    } catch (error) {

        console.error("Order creation error:", error);

        res.status(400).json({

            success: false,

            message: error.message || "Unable to place order."

        });

    }

});


// =====================================
// GET ALL ORDERS OF LOGGED-IN USER
// =====================================

router.get("/my-orders", verifyToken, async (req, res) => {

    try {

        const orders = await Order.find({

            userId: req.userId

        }).sort({ createdAt: -1 });

        res.status(200).json({

            success: true,

            count: orders.length,

            orders: orders

        });

    } catch (error) {

        console.error("Fetch orders error:", error);

        res.status(500).json({

            success: false,

            message: "Unable to fetch orders."

        });

    }

});


// =====================================
// EXPORT ROUTER
// =====================================

export default router;
