const express = require("express");
const router = express.Router();
const {
    registerUser,
    verifyOtpAndRegister,
    loginUser,
    logoutUser,
    getCurrentUser
} = require("../controllers/auth.controller");
const protect = require("../middlewares/protect");

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtpAndRegister);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/current-user", protect, getCurrentUser);

module.exports = router;