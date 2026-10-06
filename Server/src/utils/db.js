const mongoose = require("mongoose");

const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log(`Error in DB connection: ${error.message}`);
        process.exit(1);
    }
};

module.exports = ConnectDB;