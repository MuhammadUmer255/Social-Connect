const express = require('express');
const router = express.Router();
const User = require('../models/user');
const upload = require('../middleware/upload');
const fs = require('fs');
const bcrypt = require('bcryptjs'); // For password hashing

// 1. Get User Profile
// URL: http://localhost:3500/api/user/profile/laheem_king
router.get('/profile/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
            .select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Search Users
// URL: http://localhost:3500/api/user/search?q=laheem
router.get('/search', async (req, res) => {
    try {
        const query = req.query.q; // Get 'q' query parameter
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        // Search in database (case-insensitive)
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { fullName: { $regex: query, $options: 'i' } }
            ]
        }).select('username fullName profilePic');

        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// 3. Update User Profile
// URL: http://localhost:3500/api/user/update
/*
  bio: ""
  fullName: ""
  password: ""
  currentPassword: ""
  profilePic: ""
*/
router.put('/update', upload.single('profilePic'), async (req, res) => {
    try {
        // Handle undefined req.body
        const { bio, fullName, password: newPassword, currentPassword } = req.body || {};

        const user = await User.findById(req.user._id);

        // 1. Update Text Fields
        if (bio) user.bio = bio;
        if (fullName) user.fullName = fullName;

        // 2. Update Password
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: "Please provide your current password to set a new one." });
            }

            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Incorrect current password" });
            }

            user.password = await bcrypt.hash(newPassword, 10);
        }

        // 3. Update Image
        if (req.file) {
            if (user.profilePic && user.profilePic !== "default.png") {
                const oldPath = user.profilePic;
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }
            user.profilePic = req.file.path;
        }

        await user.save();

        res.json({
            message: "Profile updated successfully",
            user: {
                username: user.username,
                fullName: user.fullName,
                bio: user.bio,
                profilePic: user.profilePic
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;