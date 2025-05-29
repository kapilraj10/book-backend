const express = require("express");
const app = express();
require("dotenv").config();
const conn = require("./conn");
const cors = require("cors")
const user = require("./routes/user");
const Book = require("./routes/book");
const Favourite = require("./routes/favourite");
const Cart = require("./routes/cart");
const Order = require("./routes/order");

conn();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1", user); 
app.use("/api/v1", Book); 
app.use("/api/v1", Favourite);
app.use("/api/v1", Cart);
app.use('/api/v1', Order)

app.get("/", (req, res) => {
  res.send("Hello from backend side");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
