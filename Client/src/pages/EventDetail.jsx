import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaChair,
    FaMoneyBillWave,
    FaArrowLeft,
    FaShieldAlt,
    FaUserCheck,
    FaClock
} from 'react-icons/fa';
import { getEventById } from '../utils/axios';

const EventDetail = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await getEventById(id);
                if (result?.event) {
                    setEvent(result.event);
                } else {
                    setError("Event not found");
                }
            } catch (err) {
                console.error("Error fetching event:", err);
                setError(err.response?.data?.message || "Failed to load event details");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEvent();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-900 border-t-transparent"></div>
                <p className="mt-4 text-gray-600 font-medium text-lg">Loading event details...</p>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="max-w-5xl mx-auto py-16 text-center">
                <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-md max-w-lg mx-auto">
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Event Not Found</h2>
                    <p className="text-gray-500 mb-6 text-sm">
                        {error || "The requested event could not be found or has been removed."}
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-gray-900 hover:bg-black text-white font-bold px-6 py-3 rounded-xl transition shadow-md"
                    >
                        <FaArrowLeft className="text-sm" /> Back to All Events
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-6">
            {/* Back Button */}
            <Link
                to="/"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-black font-semibold mb-6 transition"
            >
                <FaArrowLeft className="text-sm" /> Back to All Events
            </Link>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                {/* Hero Banner Image */}
                <div className="relative h-80 md:h-96 w-full overflow-hidden bg-gray-900">
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    <div className="absolute top-6 left-6">
                        <span className="bg-white/90 text-gray-900 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md backdrop-blur-sm">
                            {event.category}
                        </span>
                    </div>
                </div>

                {/* Content Container */}
                <div className="p-8 md:p-12">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
                        {/* Left Details Column */}
                        <div className="lg:w-7/12">
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 leading-tight">
                                {event.title}
                            </h1>
                            <p className="text-gray-500 font-medium text-sm mb-8">
                                Hosted by <span className="text-gray-900 font-bold">{event.organizer || event.createdBy?.name || "Event Organizer"}</span>
                            </p>

                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-3">About the Event</h2>
                                <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                                    {event.description}
                                </p>
                            </div>

                            {/* Event Highlights / Agenda Perks */}
                            <div className="border-t border-gray-100 pt-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">What's Included</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                        <FaUserCheck className="text-gray-900 text-lg" />
                                        <span className="text-sm font-semibold text-gray-700">Full Summit Access</span>
                                    </div>
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                        <FaClock className="text-gray-900 text-lg" />
                                        <span className="text-sm font-semibold text-gray-700">Dedicated Q&A Sessions</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Booking Summary Box */}
                        <div className="lg:w-5/12 w-full bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm shrink-0">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Event Summary</h2>

                            <div className="space-y-5 mb-8">
                                <div className="flex items-center gap-4 text-gray-700">
                                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-900 shrink-0 text-lg">
                                        <FaMoneyBillWave />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ticket Price</p>
                                        <p className="font-extrabold text-2xl text-gray-900">
                                            {event.ticketPrice === 0 ? (
                                                <span className="text-green-600">FREE</span>
                                            ) : (
                                                `₹${event.ticketPrice}`
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-gray-700">
                                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-900 shrink-0 text-lg">
                                        <FaCalendarAlt />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date & Time</p>
                                        <p className="font-bold text-gray-800 text-sm">
                                            {new Date(event.date).toLocaleDateString(undefined, {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {event.time || (event.date ? new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '')}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-gray-700">
                                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-900 shrink-0 text-lg">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Venue / Location</p>
                                        <p className="font-bold text-gray-800 text-sm">{event.location}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-gray-700">
                                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-900 shrink-0 text-lg">
                                        <FaChair />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Availability</p>
                                            <span className="text-xs font-bold text-gray-800">
                                                {event.availableSeats} / {event.totalSeats} seats
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gray-900 h-2 rounded-full"
                                                style={{ width: `${event.totalSeats ? Math.min(100, Math.max(0, (event.availableSeats / event.totalSeats) * 100)) : 0}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Action Button (Dummy UI) */}
                            <button
                                type="button"
                                className="w-full py-4 px-6 rounded-xl font-bold text-base bg-gray-900 hover:bg-black text-white transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer text-center"
                            >
                                Book Tickets Now
                            </button>

                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
                                <FaShieldAlt /> 100% Secure & Verified Event Registration
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetail;