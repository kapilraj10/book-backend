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

// delete api
router.delete("/remove-book-from-favourite", authenticateToken, async ( req, res) => {
    try{
        const {bookid, id} = req. headers;
        const userData = await User.findById(id);
        const isBookFavourite = user.Data.favourites.include(bookid);
        if (isBookFavourite){
                    await User.findByIdAndUpdate(id, {$pull: {favourites: bookid} });
        }
        return res.status(200).json({message: "Book remove  from  favourites"});
    } catch (error){
        res.status(500).json({message:" Internal server error "})
    }
})

// get vFAvourite books of a aprticuler user 
router.get("/get-favourite-books", authenticateToken, async (req, res) => {
  try {
    const { _id } = req.user; 

    const userData = await User.findById(_id).populate("favourites");
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      status: "Success",
      data: userData.favourites,
    });
  } catch (error) {
    console.error("Error fetching favourite books:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
