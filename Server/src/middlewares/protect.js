const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const protect = async (req, res, next) => {
    try {
        const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null);

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token provided' });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decodedToken.id).select("-password");

        if (!req.user) {
            return res.status(401).json({
                message: "Not authorized, user not found"
            })
        }
        next()
    } catch (error) {
        console.error('Auth error:', error.message);
        res.status(401).json({ message: 'Not authorized, invalid token' });
    }
}

module.exports = protect;