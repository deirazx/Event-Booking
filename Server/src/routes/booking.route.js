const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middlewares/auth.middleware");
const {
    createBooking,
    getMyBookings,
    getEventBookings,
    cancelBooking
} = require("../controllers/booking.controller");

// Customer routes (Protected)
router.post("/", protect, createBooking);
router.get("/my-bookings", protect, getMyBookings);
router.put("/:id/cancel", protect, cancelBooking);

// Admin-only route
router.get("/event/:eventId", protect, admin, getEventBookings);

module.exports = router;
