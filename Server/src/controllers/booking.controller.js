const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Event = require("../models/Event");

// 1. Create a new booking
const createBooking = async (req, res) => {
    try {
        const { eventId, seatsBooked } = req.body;

        if (!eventId || seatsBooked === undefined) {
            return res.status(400).json({
                success: false,
                message: "eventId and seatsBooked are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid event ID format"
            });
        }

        const seats = Number(seatsBooked);
        if (isNaN(seats) || seats <= 0 || !Number.isInteger(seats)) {
            return res.status(400).json({
                success: false,
                message: "seatsBooked must be a positive integer"
            });
        }

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        if (event.availableSeats < seats) {
            return res.status(400).json({
                success: false,
                message: `Not enough seats available. Only ${event.availableSeats} seat(s) remaining.`
            });
        }

        const totalAmount = event.ticketPrice * seats;

        // Atomically decrement seats to avoid race conditions
        const updatedEvent = await Event.findOneAndUpdate(
            { _id: eventId, availableSeats: { $gte: seats } },
            { $inc: { availableSeats: -seats } },
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(400).json({
                success: false,
                message: "Seats were just taken by another booking. Please try again."
            });
        }

        const booking = await Booking.create({
            user: req.user._id,
            event: eventId,
            seatsBooked: seats,
            totalAmount,
            status: "confirmed"
        });

        const populatedBooking = await Booking.findById(booking._id)
            .populate("event", "title date location ticketPrice imageUrl")
            .populate("user", "name email");

        return res.status(201).json({
            success: true,
            message: "Booking confirmed successfully",
            booking: populatedBooking
        });

    } catch (error) {
        console.error("Error creating booking:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while creating booking",
            error: error.message
        });
    }
};

// 2. Get current user's bookings
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate("event", "title date location ticketPrice imageUrl")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "User bookings fetched successfully",
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error("Error fetching user bookings:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching bookings",
            error: error.message
        });
    }
};

// 3. Get bookings for a specific event (Admin only)
const getEventBookings = async (req, res) => {
    try {
        const { eventId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid event ID format"
            });
        }

        const bookings = await Booking.find({ event: eventId })
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Event bookings fetched successfully",
            count: bookings.length,
            bookings
        });

    } catch (error) {
        console.error("Error fetching event bookings:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching event bookings",
            error: error.message
        });
    }
};

// 4. Cancel a booking
const cancelBooking = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID format"
            });
        }

        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Only booking owner or admin can cancel
        const isOwner = booking.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === "admin";

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You can only cancel your own bookings."
            });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Booking is already cancelled"
            });
        }

        booking.status = "cancelled";
        await booking.save();

        // Release seats back to event
        await Event.findByIdAndUpdate(booking.event, {
            $inc: { availableSeats: booking.seatsBooked }
        });

        return res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            booking
        });

    } catch (error) {
        console.error("Error cancelling booking:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while cancelling booking",
            error: error.message
        });
    }
};

module.exports = {
    createBooking,
    getMyBookings,
    getEventBookings,
    cancelBooking
};
