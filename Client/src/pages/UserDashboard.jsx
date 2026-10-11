import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { myBookings, cancelBooking } from '../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaTimesCircle, FaCalendarAlt, FaMapMarkerAlt, FaChair } from 'react-icons/fa';

const UserDashboard = () => {
    const { user, isLoggedIn, loading: authLoading } = useSelector(state => state.auth);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const result = await myBookings();
            setBookings(result.bookings || []);
        } catch (error) {
            console.error('Error fetching bookings', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Wait for App to finish checking authentication from cookies
        if (authLoading) return;

        if (!user && !isLoggedIn) {
            navigate('/login');
            return;
        }
        fetchBookings();
    }, [user, isLoggedIn, authLoading, navigate]);

    const handleCancelBooking = async (id) => {
        if (window.confirm('Are you sure you want to cancel this booking?')) {
            try {
                await cancelBooking(id);
                await fetchBookings();
            } catch (error) {
                alert(error.response?.data?.message || 'Error cancelling booking');
            }
        }
    };

    if (authLoading || loading) {
        return (
            <div className="max-w-6xl mx-auto py-20 text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-900 border-t-transparent"></div>
                <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-4">
            {/* User Profile Header */}
            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-8 border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
                <div className="w-20 h-20 bg-gray-900 text-white rounded-full flex items-center justify-center text-3xl font-extrabold uppercase tracking-wider shrink-0 shadow-md">
                    {user?.name?.charAt(0) || "U"}
                </div>
                <div className="flex flex-col items-center sm:items-start">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">Welcome, {user?.name}!</h1>
                    <p className="text-gray-500 text-sm mb-2">{user?.email}</p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span> Verified Account
                    </span>
                </div>
            </div>

            {/* Bookings Section Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
                    <FaTicketAlt className="text-gray-900" /> My Bookings
                </h2>
                <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
                </span>
            </div>

            {/* Bookings Grid or Empty State */}
            {bookings.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-3xl">
                        <FaTicketAlt />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No Bookings Found</h3>
                    <p className="text-gray-500 mb-6 font-medium max-w-md mx-auto">
                        You haven't booked any events yet. Explore upcoming conferences, festivals, and workshops!
                    </p>
                    <Link
                        to="/"
                        className="inline-block bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-xl transition shadow-md"
                    >
                        Browse Events
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookings.map((booking) => {
                        const eventData = booking.event || booking.eventId;
                        return (
                            <div
                                key={booking._id}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col"
                            >
                                <div className="p-6 border-b border-gray-50 flex-grow">
                                    {eventData ? (
                                        <>
                                            <div className="flex justify-between items-start mb-3 gap-2">
                                                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                                    {eventData.title}
                                                </h3>
                                                <span
                                                    className={`px-2.5 py-1 text-[11px] font-black rounded-md uppercase tracking-wider shrink-0 ${booking.status === 'confirmed'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                        }`}
                                                >
                                                    {booking.status}
                                                </span>
                                            </div>

                                            <div className="text-sm text-gray-600 mb-4 space-y-2">
                                                {eventData.date && (
                                                    <p className="flex items-center gap-2">
                                                        <FaCalendarAlt className="text-gray-400 shrink-0 text-xs" />
                                                        <span>{new Date(eventData.date).toLocaleDateString(undefined, {
                                                            weekday: 'short',
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}</span>
                                                    </p>
                                                )}
                                                {eventData.location && (
                                                    <p className="flex items-center gap-2">
                                                        <FaMapMarkerAlt className="text-gray-400 shrink-0 text-xs" />
                                                        <span className="truncate">{eventData.location}</span>
                                                    </p>
                                                )}
                                                <p className="flex items-center gap-2">
                                                    <FaChair className="text-gray-400 shrink-0 text-xs" />
                                                    <span>{booking.seatsBooked} {booking.seatsBooked > 1 ? 'Seats' : 'Seat'} booked</span>
                                                </p>
                                            </div>

                                            <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                                                <span>Total Paid:</span>
                                                <span className="font-extrabold text-sm text-gray-900">
                                                    {booking.totalAmount === 0 ? 'FREE' : `₹${booking.totalAmount}`}
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-red-500 italic text-sm">
                                            Event details unavailable (event might have been deleted)
                                        </p>
                                    )}
                                </div>

                                {/* Bottom Actions */}
                                <div className="p-4 bg-gray-50 flex justify-between items-center shrink-0">
                                    {eventData && booking.status !== 'cancelled' ? (
                                        <>
                                            <Link
                                                to={`/events/${eventData._id}`}
                                                className="text-gray-900 font-semibold text-sm hover:underline"
                                            >
                                                View Event
                                            </Link>
                                            <button
                                                onClick={() => handleCancelBooking(booking._id)}
                                                className="text-red-600 hover:text-red-700 font-semibold text-sm transition flex items-center gap-1.5 cursor-pointer"
                                            >
                                                <FaTimesCircle /> Cancel Booking
                                            </button>
                                        </>
                                    ) : (
                                        <div className="w-full text-center text-sm font-semibold text-red-500">
                                            Booking Cancelled
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default UserDashboard;