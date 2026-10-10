import axios from "axios";

// 1. Axios Instance with Cookies Enabled
// withCredentials: true ka matlab browser automatically cookies ko har request ke sath bhejega aur receive karega
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
    withCredentials: true,
});

// =======================================================
// 2. AUTH APIS (/api/auth)
// =======================================================

// Step 1: Register User (OTP generate hoke email pe jayega)
export const registerUser = async (userDetails) => {
    const response = await API.post("/auth/register", userDetails);
    return response.data;
};

// Step 2: Verify OTP and Register
export const verifyUser = async (data) => {
    const response = await API.post("/auth/verify-otp", data);
    return response.data;
};

// Step 3: Login User (Backend token cookie set kar deta hai)
export const loginUser = async (credentials) => {
    const response = await API.post("/auth/login", credentials);
    return response.data;
};

// Step 4: Logout User (Backend token cookie clear kar deta hai)
export const logoutUser = async () => {
    const response = await API.post("/auth/logout");
    return response.data;
};

// Step 5: Get Current User Profile (GET Request)
export const currentUser = async () => {
    const response = await API.get("/auth/current-user");
    return response.data;
};

// =======================================================
// 2. EVENT APIS (/api/events)
// =======================================================

export const getAllEvents = async () => {
    const response = await API.get("/events");
    return response.data
}

export const getEventById = async (id) => {
    const response = await API.get(`/events/${id}`);
    return response.data;
};

export default API;