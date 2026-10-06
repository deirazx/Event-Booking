const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
const ConnectDB = require("./src/utils/db");
const cookieParse = require("cookie-parser");

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParse());

app.use("/api/auth", require("./src/routes/auth.route"));

// Root route
app.get('/', (req, res) => {
    res.send('Event Booking System Backend is Running');
});

ConnectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})