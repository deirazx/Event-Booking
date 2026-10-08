import React from 'react';
import { Link } from 'react-router-dom';
import { FaTicketAlt } from 'react-icons/fa';

const Navbar = () => {
    return (
        <nav className="bg-gray-900 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
                    <Link to="/" className="text-white text-2xl font-bold flex items-center gap-2">
                        <FaTicketAlt /> Eventora
                    </Link>
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                        <Link to="/" className="text-gray-200 hover:text-white transition cursor-pointer">
                            Events
                        </Link>
                        <Link to="/login" className="text-gray-200 hover:text-white transition">
                            Login
                        </Link>
                        <Link to="/register" className="bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-md font-semibold transition">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;