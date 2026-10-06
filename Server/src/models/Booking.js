const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Booking user is required"]
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: [true, "Booked event is required"]
    },
    seatsBooked: {
        type: Number,
        required: [true, "Number of seats is required"],
        min: [1, "At least 1 seat must be booked"]
    },
    totalAmount: {
        type: Number,
        required: [true, "Total amount is required"],
        min: [0, "Total amount cannot be negative"]
    },
    status: {
        type: String,
        enum: {
            values: ["confirmed", "cancelled"],
            message: "{VALUE} is not a valid booking status"
        },
        default: "confirmed"
    }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
