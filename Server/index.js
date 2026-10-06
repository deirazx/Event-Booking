const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");
const { notFound, errorHandler } = require("./src/middlewares/error.middleware");

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// API Routes
app.use("/api/auth", require("./src/routes/auth.route"));
app.use("/api/events", require("./src/routes/event.route"));
app.use("/api/event", require("./src/routes/event.route")); // Backwards compatibility for singular route
app.use("/api/bookings", require("./src/routes/booking.route"));

// Health / Root route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Event Booking System API is running smoothly",
        environment: process.env.NODE_ENV || "development"
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});

// 404 Not Found Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

// Database connection & Server start
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
});