const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect middleware: verifies authentication token from cookies or Authorization header
const protect = async (req, res, next) => {
    try {
        let token = req.cookies?.token;

        if (!token && req.headers?.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, no token provided"
            });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decodedToken.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, user no longer exists"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Authentication error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Not authorized, token invalid or expired"
        });
    }
};

// Admin middleware: verifies user has admin role
const admin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, please authenticate first"
            });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required"
            });
        }

        next();
    } catch (error) {
        console.error("Authorization error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error during authorization"
        });
    }
};

module.exports = {
    protect,
    admin
};
