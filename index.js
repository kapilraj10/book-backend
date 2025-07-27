const express = require("express");
const app = express();
require("dotenv").config();
const conn = require("./conn");
const cors = require("cors");

// Import Routes
const userRoutes = require("./routes/user");
const bookRoutes = require("./routes/book");
const favouriteRoutes = require("./routes/favourite");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

// Connect to MongoDB
conn();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", bookRoutes);
app.use("/api/v1", favouriteRoutes);
app.use("/api/v1", cartRoutes);
app.use("/api/v1", orderRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Hello from backend side");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
