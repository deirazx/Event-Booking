const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        min: 8
    },

    role: {
        type: String,
        enum: ["admin", "customer", "partner"],
        default: "customer"
    },

    isVerified: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", userSchema);
module.exports = User;