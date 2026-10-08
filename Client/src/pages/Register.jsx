import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, verifyUser } from '../utils/Axios';

const Register = () => {
    const navigate = useNavigate();

    const [isOtpSent, setIsOtpSent] = useState(false);
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            if (!isOtpSent) {
                const result = await registerUser(formData);
                console.log(result);
                setIsOtpSent(true);
                setMessage("OTP has been sent to your email! Please enter it below.");
            } else {
                const otpResult = await verifyUser({ ...formData, otp });
                console.log(otpResult);
                alert("Registration successful! Please login.");
                navigate("/login");
            }
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                    {isOtpSent ? "Verify Your Email" : "Create an Account"}
                </h2>
                <p className="text-gray-500">
                    {isOtpSent ? "Enter the 6-digit code sent to your email" : "Join Eventora today"}
                </p>
            </div>

            {/* Success / Error Message Banner */}
            {message && (
                <div className={`p-3 rounded-lg text-sm mb-4 text-center ${isOtpSent ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-600 border border-red-200"
                    }`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {!isOtpSent ? (
                    // Step 1: User Registration Details
                    <>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                            <input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                type="text"
                                required
                                placeholder="John Doe"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition shadow-sm outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                            <input
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                type="email"
                                required
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition shadow-sm outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <input
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                type="password"
                                required
                                placeholder="At least 8 characters"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition shadow-sm outline-none"
                            />
                        </div>
                    </>
                ) : (
                    // Step 2: Only OTP Input
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Verification Code (OTP)</label>
                        <input
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            type="text"
                            required
                            maxLength="6"
                            placeholder="Enter 6-digit OTP"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition shadow-sm outline-none text-center text-xl font-bold tracking-widest"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black focus:ring-4 focus:ring-gray-200 transition shadow-md mt-4 cursor-pointer disabled:opacity-50"
                >
                    {loading ? "Processing..." : isOtpSent ? "Verify & Register" : "Send OTP & Register"}
                </button>
            </form>

            <p className="text-center mt-6 text-gray-600">
                Already have an account? <Link to="/login" className="text-gray-900 font-bold hover:underline">Sign in</Link>
            </p>
        </div>
    );
};

export default Register;