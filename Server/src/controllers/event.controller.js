const mongoose = require("mongoose");
const Event = require("../models/Event");

// 1. Create a new event (Admin only)
const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            availableSeats,
            ticketPrice,
            imageUrl
        } = req.body;

        // Check if user is authenticated
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Please log in with an admin account."
            });
        }

        // Validate required fields
        if (!title || !description || !date || !location || !category || totalSeats === undefined || ticketPrice === undefined || !imageUrl) {
            return res.status(400).json({
                success: false,
                message: "All fields are required (title, description, date, location, category, totalSeats, ticketPrice, imageUrl)"
            });
        }

        const numericTotalSeats = Number(totalSeats);
        const numericTicketPrice = Number(ticketPrice);

        if (isNaN(numericTotalSeats) || numericTotalSeats <= 0) {
            return res.status(400).json({
                success: false,
                message: "Total seats must be a positive number"
            });
        }

        if (isNaN(numericTicketPrice) || numericTicketPrice < 0) {
            return res.status(400).json({
                success: false,
                message: "Ticket price must be a non-negative number"
            });
        }

        const eventDate = new Date(date);
        if (isNaN(eventDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid event date format"
            });
        }

        const event = await Event.create({
            title: title.trim(),
            description: description.trim(),
            date: eventDate,
            location: location.trim(),
            category: category.trim(),
            totalSeats: numericTotalSeats,
            availableSeats: availableSeats !== undefined ? Math.min(Number(availableSeats), numericTotalSeats) : numericTotalSeats,
            ticketPrice: numericTicketPrice,
            imageUrl: imageUrl.trim(),
            createdBy: req.user._id
        });

        return res.status(201).json({
            success: true,
            message: "Event created successfully",
            event
        });

    } catch (error) {
        console.error("Error creating event:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while creating event",
            error: error.message
        });
    }
};

// 2. Get all events (with optional category, search, and pagination)
const getAllEvents = async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, page = 1, limit = 50 } = req.query;

        const filter = {};

        if (category) {
            filter.category = { $regex: new RegExp(`^${category}$`, "i") };
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } }
            ];
        }

        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.ticketPrice = {};
            if (minPrice !== undefined) filter.ticketPrice.$gte = Number(minPrice);
            if (maxPrice !== undefined) filter.ticketPrice.$lte = Number(maxPrice);
        }

        const skip = (Number(page) - 1) * Number(limit);

        const events = await Event.find(filter)
            .populate("createdBy", "name email")
            .sort({ date: 1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Event.countDocuments(filter);

        return res.status(200).json({
            success: true,
            message: "Events fetched successfully",
            count: events.length,
            total,
            events
        });

    } catch (error) {
        console.error("Error fetching all events:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching events",
            error: error.message
        });
    }
};

// 3. Get single event by ID
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid event ID format"
            });
        }

        const event = await Event.findById(id).populate("createdBy", "name email");

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Event fetched successfully",
            event
        });

    } catch (error) {
        console.error("Error fetching event by ID:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching event",
            error: error.message
        });
    }
};

// 4. Update event by ID (Admin only)
const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid event ID format"
            });
        }

        const event = await Event.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Event updated successfully",
            event
        });

    } catch (error) {
        console.error("Error updating event:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while updating event",
            error: error.message
        });
    }
};

// 5. Delete event by ID (Admin only)
const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid event ID format"
            });
        }

        const event = await Event.findByIdAndDelete(id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: "Event not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Event deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting event:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while deleting event",
            error: error.message
        });
    }
};

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
};