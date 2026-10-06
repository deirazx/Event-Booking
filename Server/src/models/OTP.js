const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true
    },
    otp: {
        type: String,
        required: [true, "OTP is required"],
        minlength: [6, "OTP must be 6 digits"],
        maxlength: [6, "OTP must be 6 digits"]
    },
    action: {
        type: String,
        enum: {
            values: ["register", "verify_email"],
            message: "{VALUE} is not a valid action"
        },
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // 5 minutes TTL
    }
}, { timestamps: true });

module.exports = mongoose.model("OTP", otpSchema);