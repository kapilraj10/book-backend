const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./userAuth");
const User = require('../models/user');


// PUT /api/v1/add-to-cart
router.post("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.body;
    const id = req.user.id; // 

    const userData = await User.findById(id);
    if (!userData) {
      return res.status(404).json({
        status: "Fail",
        message: "User not found",
      });
    }

    const isBookInCart = userData.cart.includes(bookid);
    if (isBookInCart) {
      return res.json({
        status: "Success",
        message: "Book is already in cart",
      });
    }

    await User.findByIdAndUpdate(id, {
      $push: { cart: bookid },
    });

    return res.json({
      status: "Success",
      message: "Book added to cart",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// Remove from cart API
router.delete("/remove-from-cart/:bookid", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookId = req.params.bookid;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ status: "Fail", message: "User not found" });
    }

    // Remove book from cart
    await User.findByIdAndUpdate(userId, {
      $pull: { cart: bookId },
    });

    return res.json({ status: "Success", message: "Book removed from cart" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "Fail", message: "Server error" });
  }
});

// GET /api/v1/get-user-cart
router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("favourites");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      status: "Success",
      data: user.favourites.reverse(), 
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
