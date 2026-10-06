const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true, minlength: 6, maxlength: 6 },
    action: { type: String, enum: ['register', 'verify_email'], required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 },
}, { timestamps: true });

module.exports = mongoose.model('OTP', otpSchema);