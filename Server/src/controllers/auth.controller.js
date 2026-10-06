const User = require("../models/User");
const OTP = require("../models/OTP");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper function to generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// 1. Step 1: Initiate Registration & Send OTP
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must be at least 8 characters long"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user already exists
        const isUserExists = await User.findOne({ email: normalizedEmail });
        if (isUserExists) {
            return res.status(400).json({
                message: "User already exists with this email"
            });
        }

        // Generate 6-digit OTP
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

        // Clean previous OTPs for this email
        await OTP.deleteMany({ email: normalizedEmail, action: "register" });

        // Save OTP
        await OTP.create({
            email: normalizedEmail,
            otp: generatedOtp,
            action: "register"
        });

        // Send OTP via Email
        await sendEmail(
            normalizedEmail,
            "Verify Your Email",
            `Use this OTP to verify your email: ${generatedOtp}. Valid for 5 minutes.`
        );

        return res.status(200).json({
            success: true,
            message: "OTP sent successfully to your email. Please verify to complete registration."
        });

    } catch (error) {
        console.error("Error while initiating registration:", error);
        return res.status(500).json({
            message: "Error while sending registration OTP"
        });
    }
};

// 2. Step 2: Verify OTP and Register User
const verifyOtpAndRegister = async (req, res) => {
    try {
        const { name, email, password, otp } = req.body;

        if (!name || !email || !password || !otp) {
            return res.status(400).json({ message: "All fields including OTP are required" });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if user already registered in between
        const isUserExists = await User.findOne({ email: normalizedEmail });
        if (isUserExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Verify OTP
        const existingOtp = await OTP.findOne({
            email: normalizedEmail,
            otp: otp.toString().trim(),
            action: "register",
        });

        if (!existingOtp) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        // Create user (password will be hashed by pre-save hook in User model)
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password,
            isVerified: true
        });

        // Delete used OTP
        await OTP.deleteMany({ email: normalizedEmail, action: "register" });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        console.error("Error while verifying OTP:", error);
        return res.status(500).json({
            message: "Error while verifying OTP and creating user"
        });
    }
};

// 3. Login User
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email & Password are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        // Compare plain password with stored bcrypt hashed password
        const isValidPass = await bcrypt.compare(password, user.password);

        if (!isValidPass) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = generateToken(user._id);

        // Set token cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        return res.status(200).json({
            message: "Login successful.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("Something went wrong while logging in user:", error);
        return res.status(500).json({
            message: "Something went wrong while logging in. Please try again."
        });
    }
};

// 4. Logout User
const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({
            message: "Logged out successfully."
        });
    } catch (error) {
        console.error("Error logging out:", error);
        return res.status(500).json({ message: "Failed to log out. Please try again." });
    }
};

module.exports = {
    registerUser,
    verifyOtpAndRegister,
    loginUser,
    logoutUser
};