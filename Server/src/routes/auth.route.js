const express = require("express");
const router = express.Router();
const {
    registerUser,
    verifyOtpAndRegister,
    loginUser,
    logoutUser
} = require("../controllers/auth.controller");

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtpAndRegister);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;