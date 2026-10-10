import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTicketAlt, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../redux/slice';
import { logoutUser } from '../utils/axios';

const Navbar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { isLoggedIn, user } = useSelector((state) => state.auth);

    // Logout Handler
    const handleLogout = async () => {
        try {
            await logoutUser();
            dispatch(clearUser());
            navigate('/login');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <nav className="bg-gray-900 shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
                    {/* Brand Logo */}
                    <Link to="/" className="text-white text-2xl font-bold flex items-center gap-2 hover:opacity-90 transition">
                        <FaTicketAlt className="text-gray-300" /> Eventora
                    </Link>

                    {/* Navigation Items */}
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                        <Link to="/" className="text-gray-300 hover:text-white transition font-medium">
                            Events
                        </Link>

                        {/* Agar User Logged In Hai */}
                        {isLoggedIn && user ? (
                            <>
                                {/* User greeting / Role badge */}
                                <Link to="/dashboard" className="text-gray-300 hover:text-white transition font-medium">
                                    Dashboard
                                </Link>
                                {/* <div className="flex items-center gap-2 text-gray-300 text-sm font-medium bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
                                    <FaUserCircle className="text-lg text-gray-400" />
                                    <span>{user?.name || "Account"}</span>
                                    {user?.role === 'admin' && (
                                        <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            Admin
                                        </span>
                                    )}
                                </div> */}

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium text-sm transition shadow-sm cursor-pointer"
                                >
                                    <FaSignOutAlt /> Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-gray-300 hover:text-white transition font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-md font-semibold text-sm transition shadow-sm"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;