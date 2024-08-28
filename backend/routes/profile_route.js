const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ProfileModel = mongoose.model("ProfileModel");
const protectedRoute = require("../middleware/protectedResource");

// 1. Create a Profile
router.post("/createprofile", protectedRoute, async (req, res) => {
    const { username, description, link, profileImg } = req.body;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    try {
        const newProfile = new ProfileModel({
            username,
            description,
            link,
            profileImg,
            author: req.user._id // Associate the profile with the logged-in user
        });

        await newProfile.save();
        res.status(201).json({ profile: newProfile });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 2. Get the Profile of the Logged-in User
router.get("/getmyprofile", protectedRoute, async (req, res) => {
    try {
        const userProfile = await ProfileModel.findOne({ author: req.user._id });

        if (!userProfile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        res.status(200).json({ profile: userProfile });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 3. Edit Profile
router.post("/editprofile", protectedRoute, async (req, res) => {
    const { username, description, link, profileImg } = req.body;

    if (!username) {
        return res.status(400).json({ error: "Username is required" });
    }

    try {

        const userProfile = await ProfileModel.findOne({ author: req.user._id });
        if (!userProfile) {
            return res.status(404).json({ error: "user not found" });
        }

        // Update the profile fields
        userProfile.username = username;
        userProfile.description = description;
        userProfile.link = link;
        userProfile.profileImg = profileImg;

        const updatedProfile = await userProfile.save();
        res.status(200).json({ profile: updatedProfile });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// 4. Delete Profile
router.delete("/deleteprofile", protectedRoute, async (req, res) => {
    try {
        const userProfile = await ProfileModel.findOneAndDelete({ author: req.user._id });

        if (!userProfile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        res.status(200).json({ message: "Profile deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
