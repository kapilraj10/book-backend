const express = require("express");
const router = express.Router();
const { authenticateToken } = require("./userAuth");
const User = require("../models/User");

// PUT /api/v1/add-to-cart
router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.body;
    const id = req.user._id; 

    const userData = await User.findById(id);
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
// PUT /api/v1/remove-from-cart/:bookid
router.put("/remove-from-cart/:bookid", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.params;
    const userId = req.user.id;

    await User.findByIdAndUpdate(userId, {
      $pull: { cart: bookid },
    });

    return res.json({
      status: "Success",
      message: "Book removed from cart",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

// GET /api/v1/get-user-cart
router.get("/get-user-cart", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const userData = await User.findById(userId).populate("cart");
    const cart = userData.cart.reverse();

    return res.json({
      status: "Success",
      data: cart,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
