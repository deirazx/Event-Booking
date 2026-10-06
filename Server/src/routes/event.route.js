const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middlewares/auth.middleware");
const {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
} = require("../controllers/event.controller");

// Public routes
router.get("/", getAllEvents);
router.get("/:id", getEventById);

// Admin-only protected routes
router.post("/", protect, admin, createEvent);
router.put("/:id", protect, admin, updateEvent);
router.delete("/:id", protect, admin, deleteEvent);

module.exports = router;