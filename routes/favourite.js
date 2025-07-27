const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { authenticateToken } = require('./userAuth');


// ad  book to favourite
router.put("/add-book-to-favourite", authenticateToken, async (req, res) => {
  try {
    console.log("User from token:", req.user);
    const userId = req.user.id;
    const { bookid } = req.body;

    if (!userId) return res.status(401).json({ message: "User ID missing" });
    if (!bookid) return res.status(400).json({ message: "Book ID missing" });

    const userData = await User.findById(userId);
    if (!userData) return res.status(404).json({ message: "User not found" });

    if (userData.favourites.includes(bookid)) {
      return res.status(200).json({ message: "Book is already in favourites" });
    }

    userData.favourites.push(bookid);
    await userData.save();

    res.status(201).json({ message: "Book added to favourites" });
  } catch (error) {
    console.error("Error adding to favourites:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /api/v1/remove-book-from-favourite
router.delete("/remove-book-from-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;

    if (!bookid || !id) {
      return res.status(400).json({ message: "Book ID and User ID are required in headers" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isBookFavourite = user.favourites.includes(bookid);
    if (!isBookFavourite) {
      return res.status(400).json({ message: "Book is not in favorites" });
    }

    await User.findByIdAndUpdate(id, {
      $pull: { favourites: bookid },
    });

    return res.status(200).json({
      success: true,
      message: "Book removed from favourites successfully"
    });
  } catch (error) {
    console.error("Error removing book from favorites:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
});
// get vFAvourite books of a aprticuler user 
router.get("/get-favourite-books", authenticateToken, async (req, res) => {
  try {
    const { id } = req.user; 

    const userData = await User.findById(id).populate("favourites");
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const favouriteBooks = userData.favourites;
    return res.json({
      status: "Success",
      data: favouriteBooks,
    });
  } catch (error) {
    console.error(error); 
    return res.status(500).json({ message: "An error occurred" });
  }
});


module.exports = router;
