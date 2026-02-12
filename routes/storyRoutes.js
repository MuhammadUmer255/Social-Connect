const express = require('express');
const router = express.Router();
const Story = require('../models/story');
const User = require('../models/user');
const upload = require('../middleware/upload');

// 1. Upload Story
// URL: http://localhost:3500/api/stories/upload
/*
  image: ""
*/
router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        // Validate image
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required for story' });
        }

        // Save story to database
        const newStory = new Story({
            image: req.file.path,
            author: req.user._id
        });

        await newStory.save();

        res.status(201).json({
            message: "Story uploaded successfully! (Will disappear in 24h)",
            story: newStory
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Get Stories Feed
// URL: http://localhost:3500/api/stories/feed
router.get('/feed', async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);

        // Logic: Get stories from followed users and self
        const stories = await Story.find({
            author: { $in: [...currentUser.following, req.user._id] }
        })
            .populate('author', 'username profilePic')
            .sort({ createdAt: -1 });

        res.json(stories);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;