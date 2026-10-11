import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    FaPlus,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaTicketAlt,
    FaUsers,
    FaMoneyBillWave,
    FaEdit,
    FaTrash,
    FaTimes,
    FaShieldAlt,
    FaSearch,
    FaLayerGroup,
    FaEye
} from 'react-icons/fa';
import { createEvent, updateEvent, deleteEvent, getAllEvents } from '../utils/axios';

// Dummy Sample Data matching Backend Schemas (Event & Booking)
const dummyEvents = [
    {
        _id: "evt_1",
        title: "Tech Innovation Summit 2026",
        category: "Technology",
        date: "2026-11-15T10:00:00.000Z",
        location: "Bengaluru International Center, Hall A",
        totalSeats: 200,
        availableSeats: 120,
        ticketPrice: 1499,
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop",
        description: "Join industry leaders and senior engineers for a power-packed full-day summit on AI and Cloud Architecture."
    },
    {
        _id: "evt_2",
        title: "Sunburn Music & Beats Festival",
        category: "Music",
        date: "2026-12-20T17:00:00.000Z",
        location: "Vagator Beach Ground, Goa",
        totalSeats: 500,
        availableSeats: 85,
        ticketPrice: 2999,
        imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop",
        description: "Experience electrifying EDM beats, high-energy live acts, and seaside vibes under the stars."
    },
    {
        _id: "evt_3",
        title: "Fullstack Web & AI Masterclass",
        category: "Workshop",
        date: "2026-10-30T11:00:00.000Z",
        location: "Virtual (Online Zoom)",
        totalSeats: 150,
        availableSeats: 30,
        ticketPrice: 0,
        imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1000&auto=format&fit=crop",
        description: "Comprehensive hands-on workshop building production-grade MERN web apps with AI features."
    }
];

const dummyBookings = [
    {
        _id: "bkg_1",
        event: {
            _id: "evt_1",
            title: "Tech Innovation Summit 2026"
        },
        user: {
            name: "Rahul Sharma",
            email: "rahul.sharma@example.com"
        },
        seatsBooked: 2,
        totalAmount: 2998,
        status: "confirmed",
        createdAt: "2026-10-08T14:32:00.000Z"
    },
    {
        _id: "bkg_2",
        event: {
            _id: "evt_2",
            title: "Sunburn Music & Beats Festival"
        },
        user: {
            name: "Pooja Verma",
            email: "pooja.v@example.com"
        },
        seatsBooked: 1,
        totalAmount: 2999,
        status: "confirmed",
        createdAt: "2026-10-09T09:15:00.000Z"
    },
    {
        _id: "bkg_3",
        event: {
            _id: "evt_3",
            title: "Fullstack Web & AI Masterclass"
        },
        user: {
            name: "Aman Gupta",
            email: "aman.gupta@example.com"
        },
        seatsBooked: 1,
        totalAmount: 0,
        status: "confirmed",
        createdAt: "2026-10-09T18:45:00.000Z"
    },
    {
        _id: "bkg_4",
        event: {
            _id: "evt_1",
            title: "Tech Innovation Summit 2026"
        },
        user: {
            name: "Vikram Malhotra",
            email: "vikram.m@example.com"
        },
        seatsBooked: 1,
        totalAmount: 1499,
        status: "cancelled",
        createdAt: "2026-10-07T11:20:00.000Z"
    }
];

const AdminDashboard = () => {
    // UI State Management (Dummy State for Preview)
    const [events, setEvents] = useState(dummyEvents);
    const [bookings] = useState(dummyBookings);
    const [activeTab, setActiveTab] = useState('events'); // 'events' | 'bookings'
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Fetch Events
    const fetchEvents = async () => {
        try {
            const result = await getAllEvents();
            console.log(result);

            setEvents(result?.event || result?.events || [])
        } catch (error) {

        }
    }
    // fetchEvents()
    // Modal & Edit States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingEventId, setEditingEventId] = useState(null); // null = Create Mode, ID = Edit Mode
    const [selectedEventAttendees, setSelectedEventAttendees] = useState(null);

    // Form State (matching backend schema: title, description, date, location, category, totalSeats, ticketPrice, imageUrl)
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        category: 'Technology',
        totalSeats: '',
        ticketPrice: '',
        imageUrl: ''
    });

    // Open Modal in CREATE Mode (Empty fields)
    const handleOpenCreateModal = () => {
        setEditingEventId(null);
        setFormData({
            title: '',
            description: '',
            date: '',
            location: '',
            category: 'Technology',
            totalSeats: '',
            ticketPrice: '',
            imageUrl: ''
        });
        setIsCreateModalOpen(true);
    };

    // Open Modal in EDIT Mode (Pre-fill with event data)
    const handleOpenEditModal = (evt) => {
        setEditingEventId(evt._id || evt.id);

        // Format ISO date to YYYY-MM-DDTHH:mm for datetime-local input
        const formattedDate = evt.date ? new Date(evt.date).toISOString().slice(0, 16) : '';

        setFormData({
            title: evt.title || '',
            description: evt.description || '',
            date: formattedDate,
            location: evt.location || '',
            category: evt.category || 'Technology',
            totalSeats: evt.totalSeats !== undefined ? evt.totalSeats : '',
            ticketPrice: evt.ticketPrice !== undefined ? evt.ticketPrice : 0,
            imageUrl: evt.imageUrl || ''
        });

        setIsCreateModalOpen(true);
    };

    // Handle Delete Event
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            try {
                await deleteEvent(id);
                fetchEvents();
            } catch (error) {
                console.error("Error deleting event:", error);
                alert(error.response?.data?.message || "Failed to delete event");
            }
        }
    };

    // Handle Form Submit for Both Create & Edit
    const handleSubmitEvent = async (e) => {
        e.preventDefault();
        try {
            if (editingEventId) {
                // UPDATE Mode
                await updateEvent(editingEventId, formData);
                alert("Event updated successfully!");
            } else {
                // CREATE Mode
                await createEvent(formData);
                alert("Event created successfully!");
            }

            setIsCreateModalOpen(false);
            setEditingEventId(null);
            fetchEvents();
        } catch (error) {
            console.error("Error saving event:", error);
            alert(error.response?.data?.message || "Failed to save event");
        }
    };

    // Quick Stats Calculations
    const totalEventsCount = events.length;
    const totalSeatsSold = bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.seatsBooked, 0);
    const totalRevenue = bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.totalAmount, 0);

    // Filter events by search & category
    const filteredEvents = events.filter(evt => {
        const matchesSearch = evt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            evt.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || evt.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-12">
            {/* Top Admin Header Banner */}
            <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white rounded-3xl p-8 sm:p-10 shadow-xl overflow-hidden border border-gray-800">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 text-xs font-bold uppercase tracking-wider mb-3">
                            <FaShieldAlt /> Admin Control Center
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-400 text-sm sm:text-base max-w-xl">
                            Create and manage live events, monitor bookings, and inspect attendee lists directly.
                        </p>
                    </div>

                    <button
                        onClick={handleOpenCreateModal}
                        className="inline-flex items-center gap-2.5 bg-white text-gray-950 hover:bg-gray-100 font-extrabold px-6 py-3.5 rounded-xl shadow-lg transition transform hover:-translate-y-0.5 cursor-pointer text-sm"
                    >
                        <FaPlus className="text-xs" /> Create New Event
                    </button>
                </div>
            </div>

            {/* Metric KPI Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Total Events</p>
                        <h3 className="text-3xl font-black text-gray-900">{totalEventsCount}</h3>
                        <p className="text-xs text-gray-500 mt-1">Live in catalogue</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-gray-50 text-gray-900 flex items-center justify-center text-xl">
                        <FaLayerGroup />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Seats Booked</p>
                        <h3 className="text-3xl font-black text-blue-600">{totalSeatsSold}</h3>
                        <p className="text-xs text-gray-500 mt-1">Confirmed attendees</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                        <FaTicketAlt />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Total Revenue</p>
                        <h3 className="text-3xl font-black text-green-600">₹{totalRevenue.toLocaleString()}</h3>
                        <p className="text-xs text-gray-500 mt-1">Gross sales</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl">
                        <FaMoneyBillWave />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">Total Registrations</p>
                        <h3 className="text-3xl font-black text-purple-600">{bookings.length}</h3>
                        <p className="text-xs text-gray-500 mt-1">Orders processed</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl">
                        <FaUsers />
                    </div>
                </div>
            </div>

            {/* Navigation Tabs Switcher */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('events')}
                    className={`pb-4 px-6 text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${activeTab === 'events'
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-900'
                        }`}
                >
                    <FaLayerGroup /> Events Catalog ({events.length})
                </button>
                <button
                    onClick={() => setActiveTab('bookings')}
                    className={`pb-4 px-6 text-sm font-bold flex items-center gap-2 border-b-2 transition cursor-pointer ${activeTab === 'bookings'
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-900'
                        }`}
                >
                    <FaUsers /> Bookings & Attendees ({bookings.length})
                </button>
            </div>

            {/* ======================================================== */}
            {/* TAB 1: ALL EVENTS MANAGEMENT */}
            {/* ======================================================== */}
            {activeTab === 'events' && (
                <div className="space-y-6">
                    {/* Filters Row */}
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="relative w-full sm:w-80">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Search by title or venue..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm transition"
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                            {['All', 'Technology', 'Music', 'Workshop'].map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer shrink-0 ${selectedCategory === cat
                                        ? 'bg-gray-900 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Events Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-400 uppercase text-[11px] font-black tracking-wider border-b border-gray-100">
                                        <th className="py-4 px-6">Event Info</th>
                                        <th className="py-4 px-6">Date & Venue</th>
                                        <th className="py-4 px-6">Seat Capacity</th>
                                        <th className="py-4 px-6">Ticket Price</th>
                                        <th className="py-4 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {filteredEvents.map((evt) => (
                                        <tr key={evt._id} className="hover:bg-gray-50/70 transition">
                                            {/* Event Info */}
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={evt.imageUrl}
                                                        alt={evt.title}
                                                        className="w-14 h-14 rounded-xl object-cover shrink-0 shadow-sm border border-gray-100"
                                                    />
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 leading-tight mb-1">
                                                            {evt.title}
                                                        </h4>
                                                        <span className="inline-block bg-gray-100 text-gray-700 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
                                                            {evt.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Date & Venue */}
                                            <td className="py-4 px-6 text-gray-600">
                                                <div className="space-y-1">
                                                    <p className="flex items-center gap-1.5 text-xs font-semibold text-gray-800">
                                                        <FaCalendarAlt className="text-gray-400" />
                                                        {new Date(evt.date).toLocaleDateString(undefined, {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                    <p className="flex items-center gap-1.5 text-xs text-gray-500">
                                                        <FaMapMarkerAlt className="text-gray-400 shrink-0" />
                                                        <span className="truncate max-w-[180px]">{evt.location}</span>
                                                    </p>
                                                </div>
                                            </td>

                                            {/* Seat Capacity */}
                                            <td className="py-4 px-6">
                                                <div className="w-36">
                                                    <div className="flex justify-between items-center text-xs font-bold text-gray-800 mb-1">
                                                        <span>{evt.availableSeats} left</span>
                                                        <span className="text-gray-400">{evt.totalSeats}</span>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                                        <div
                                                            className="bg-gray-900 h-1.5 rounded-full"
                                                            style={{
                                                                width: `${(evt.availableSeats / evt.totalSeats) * 100}%`
                                                            }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Ticket Price */}
                                            <td className="py-4 px-6">
                                                <span className="font-extrabold text-gray-900 text-base">
                                                    {evt.ticketPrice === 0 ? (
                                                        <span className="text-green-600 text-sm font-black">FREE</span>
                                                    ) : (
                                                        `₹${evt.ticketPrice}`
                                                    )}
                                                </span>
                                            </td>

                                            {/* Action Buttons */}
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* View Attendees Action */}
                                                    <button
                                                        onClick={() => setSelectedEventAttendees(evt)}
                                                        title="View Attendees"
                                                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition cursor-pointer text-xs flex items-center gap-1 font-semibold"
                                                    >
                                                        <FaEye /> Attendees
                                                    </button>

                                                    {/* Edit Event Action */}
                                                    <button
                                                        onClick={() => handleOpenEditModal(evt)}
                                                        title="Edit Event"
                                                        className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition cursor-pointer text-xs"
                                                    >
                                                        <FaEdit />
                                                    </button>

                                                    {/* Delete Event Action */}
                                                    <button
                                                        onClick={() => handleDelete(evt._id || evt.id)}
                                                        title="Delete Event"
                                                        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition cursor-pointer text-xs"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* TAB 2: BOOKINGS & ATTENDEES INSPECTION */}
            {/* ======================================================== */}
            {activeTab === 'bookings' && (
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-400 uppercase text-[11px] font-black tracking-wider border-b border-gray-100">
                                        <th className="py-4 px-6">Attendee</th>
                                        <th className="py-4 px-6">Event</th>
                                        <th className="py-4 px-6">Seats</th>
                                        <th className="py-4 px-6">Amount</th>
                                        <th className="py-4 px-6">Status</th>
                                        <th className="py-4 px-6">Booked Date</th>
                                        <th className="py-4 px-6 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {bookings.map((bkg) => (
                                        <tr key={bkg._id} className="hover:bg-gray-50/70 transition">
                                            {/* Attendee */}
                                            <td className="py-4 px-6">
                                                <div>
                                                    <p className="font-bold text-gray-900">{bkg.user.name}</p>
                                                    <p className="text-xs text-gray-400">{bkg.user.email}</p>
                                                </div>
                                            </td>

                                            {/* Event Title */}
                                            <td className="py-4 px-6">
                                                <span className="font-semibold text-gray-800 line-clamp-1">
                                                    {bkg.event.title}
                                                </span>
                                            </td>

                                            {/* Seats Booked */}
                                            <td className="py-4 px-6">
                                                <span className="font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-md text-xs">
                                                    {bkg.seatsBooked} {bkg.seatsBooked > 1 ? 'seats' : 'seat'}
                                                </span>
                                            </td>

                                            {/* Amount */}
                                            <td className="py-4 px-6 font-extrabold text-gray-900">
                                                {bkg.totalAmount === 0 ? 'FREE' : `₹${bkg.totalAmount}`}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-4 px-6">
                                                <span
                                                    className={`px-2.5 py-1 text-[10px] font-black rounded uppercase tracking-wider ${bkg.status === 'confirmed'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                        }`}
                                                >
                                                    {bkg.status}
                                                </span>
                                            </td>

                                            {/* Created At */}
                                            <td className="py-4 px-6 text-xs text-gray-500">
                                                {new Date(bkg.createdAt).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </td>

                                            {/* Cancel Action */}
                                            <td className="py-4 px-6 text-right">
                                                {bkg.status === 'confirmed' ? (
                                                    <button
                                                        title="Cancel Booking"
                                                        className="text-red-500 hover:text-red-700 font-semibold text-xs transition cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Cancelled</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* CREATE EVENT MODAL (Ready to connect with createEvent API) */}
            {/* ======================================================== */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center pb-5 mb-6 border-b border-gray-100">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900">
                                    {editingEventId ? "Edit Event" : "Create New Event"}
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {editingEventId
                                        ? "Update the details of this event in the catalogue"
                                        : "Fill in event details matching the backend schema"}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsCreateModalOpen(false);
                                    setEditingEventId(null);
                                }}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition cursor-pointer"
                            >
                                <FaTimes className="text-xs" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitEvent} className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Event Title *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Next.js & AI Developers Conference"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm transition"
                                />
                            </div>

                            {/* Category & Date */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Category *
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm transition bg-white"
                                    >
                                        <option value="Technology">Technology</option>
                                        <option value="Music">Music</option>
                                        <option value="Workshop">Workshop</option>
                                        <option value="Business">Business</option>
                                        <option value="Design">Design</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Event Date *
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm transition"
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Venue / Location *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Bengaluru Exhibition Centre or Online Zoom"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm transition"
                                />
                            </div>

                            {/* Total Seats & Ticket Price */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Total Seats *
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 200"
                                        value={formData.totalSeats}
                                        onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Ticket Price (₹) * (0 for Free)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="e.g. 1499"
                                        value={formData.ticketPrice}
                                        onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm transition"
                                    />
                                </div>
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Cover Image URL *
                                </label>
                                <input
                                    type="url"
                                    placeholder="https://images.unsplash.com/..."
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm transition"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Event Description *
                                </label>
                                <textarea
                                    rows="4"
                                    placeholder="Describe agenda, keynote speakers, and what attendees will learn..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none text-sm transition resize-none"
                                ></textarea>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreateModalOpen(false);
                                        setEditingEventId(null);
                                    }}
                                    className="px-5 py-2.5 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-100 transition text-sm cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-xl bg-gray-900 hover:bg-black font-bold text-white transition shadow-md text-sm cursor-pointer"
                                >
                                    {editingEventId ? "Update Event" : "Publish Event"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* VIEW ATTENDEES MODAL (Corresponds to GET /api/bookings/event/:eventId) */}
            {/* ======================================================== */}
            {selectedEventAttendees && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                    <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-start pb-5 mb-6 border-b border-gray-100">
                            <div>
                                <h3 className="text-xl font-black text-gray-900">
                                    Attendees List
                                </h3>
                                <p className="text-xs text-gray-500 font-medium mt-1">
                                    {selectedEventAttendees.title}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedEventAttendees(null)}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition cursor-pointer"
                            >
                                <FaTimes className="text-xs" />
                            </button>
                        </div>

                        {/* Attendees List */}
                        <div className="space-y-3">
                            {dummyBookings.filter(b => b.event._id === selectedEventAttendees._id).length === 0 ? (
                                <p className="text-center py-8 text-gray-400 font-medium text-sm">
                                    No attendees registered for this event yet.
                                </p>
                            ) : (
                                dummyBookings
                                    .filter(b => b.event._id === selectedEventAttendees._id)
                                    .map((bkg) => (
                                        <div
                                            key={bkg._id}
                                            className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between"
                                        >
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm">{bkg.user.name}</h4>
                                                <p className="text-xs text-gray-500">{bkg.user.email}</p>
                                                <p className="text-[11px] text-gray-400 mt-1">
                                                    Booked: {new Date(bkg.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <span
                                                    className={`inline-block px-2 py-0.5 text-[10px] font-black rounded uppercase tracking-wider mb-1 ${bkg.status === 'confirmed'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                        }`}
                                                >
                                                    {bkg.status}
                                                </span>
                                                <p className="text-xs font-bold text-gray-700">
                                                    {bkg.seatsBooked} {bkg.seatsBooked > 1 ? 'seats' : 'seat'}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 text-right">
                            <button
                                onClick={() => setSelectedEventAttendees(null)}
                                className="px-5 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs hover:bg-black transition cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;