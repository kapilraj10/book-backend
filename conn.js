const mongoose = require("mongoose");
require("dotenv").config();

const conn = async () => {
  try {
    await mongoose.connect(process.env.URI);
    console.log("Connected to Database");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

module.exports = conn;
