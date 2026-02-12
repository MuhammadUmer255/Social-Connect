const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const upload = require('../middleware/upload');
const fs = require('fs');

// 1. Create Post
// URL: http://localhost:3500/api/posts/create

/*
  caption: "",
  image: "",
  location: ""
*/

router.post('/create', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Image is required!' });
        }

        const newPost = new Post({
            caption: req.body.caption,
            image: req.file.path,
            location: req.body.location,
            author: req.user._id
        });

        const savedPost = await newPost.save();

        res.status(201).json({
            message: 'Post created successfully!',
            post: savedPost
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Get Feed
// URL: http://localhost:3500/api/posts/feed

router.get('/feed', async (req, res) => {
    try {
        // Step 1: Get current user details
        const currentUser = await User.findById(req.user._id);

        // Step 2: Find posts from followed authors
        const posts = await Post.find({
            author: { $in: currentUser.following }
        })
            .sort({ createdAt: -1 }) // Sort by newest 
            .populate('author', 'username profilePic') // Populate author details
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'username' } // Populate comment authors
            });

        res.json(posts);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Get All Posts (Explore)
// URL: http://localhost:3500/api/posts/all
router.get('/all', async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate('author', 'username profilePic');

        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Get User Posts
// URL: http://localhost:3500/api/posts/user/laheem_king
router.get('/user/:username', async (req, res) => {
    try {
        // Find user by username
        const user = await User.findOne({ username: req.params.username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find posts by user ID
        const posts = await Post.find({ author: user._id })
            .sort({ createdAt: -1 })
            .populate('author', 'username profilePic');

        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Delete Post
// URL: http://localhost:3500/api/posts/:postId
router.delete('/:postId', async (req, res) => {
    try {
        // Find post
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Security Check: Verify author
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized: You can only delete your own posts" });
        }

        // Delete image from server
        if (fs.existsSync(post.image)) {
            fs.unlinkSync(post.image);
        }

        // Delete post from database
        await post.deleteOne();

        res.json({ message: "Post deleted successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Edit Post Caption
// URL: http://localhost:3500/api/posts/:postId
/*
{
  "caption": ""
}
*/
router.put('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Security Check: Verify author
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Update caption
        post.caption = req.body.caption || post.caption;

        await post.save();

        res.json({ message: "Post updated", post });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;