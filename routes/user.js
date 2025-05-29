const express = require("express");
const router = express.Router();
const User = require("../models/user"); 
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");

// Sign up
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        if (username.length < 4) {
            return res.status(400).json({ message: "Username length should be greater than 4" });
        }

        const existingUsername = await User.findOne({ username }); 
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const existingEmail = await User.findOne({ email }); 
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password length should be greater than 6" });
        }

        const hashPass = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashPass,
            address,
        });

        await newUser.save();
        return res.status(200).json({ message: "Registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Sign in
router.post("/sign-in", async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const authClaims = {
            id: existingUser._id,
            name: existingUser.username,
            role: existingUser.role,
        };

        const token = jwt.sign(authClaims, "bookStore123", {
            expiresIn: "3d",
        });

        return res.status(200).json({
            id: existingUser._id,
            role: existingUser.role,
            token,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get user information
router.get("/get-user-information", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const data = await User.findById(id).select("-password");
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Update address
router.put("/update-address", authenticateToken, async (req, res) => {
    try {
        const { address } = req.body;
        const userId = req.user._id;

        await User.findByIdAndUpdate(userId, { address });

        return res.status(200).json({ message: "Address updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
