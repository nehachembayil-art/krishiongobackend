const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Create a new user
router.post("/", async (req, res) => {
    try {
        const user = new User(req.body);

        const savedUser = await user.save();

        res.status(201).json(savedUser);

    } catch (error) {
        res.status(500).json({
            message: "Error creating user",
            error: error.message
        });
    }
});
// Get all users
router.get("/", async (req, res) => {
    try {

        const users = await User.find();

        res.json(users);

    } catch (error) {

        res.status(500).json({
            message: "Error getting users",
            error: error.message
        });

    }
});
module.exports = router;