const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');



// 1. Follow User 
// URL: http://localhost:3500/api/social/follow/:id
router.put('/follow/:id', async (req, res) => {
    try {
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: "You cannot follow yourself" });
        }

        const targetUser = await User.findByIdAndUpdate(req.params.id, {
            $addToSet: { followers: req.user._id }
        });

        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { following: req.params.id }
        });

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "Followed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. UNFOLLOW USER 
// URL: http://localhost:3500/api/social/unfollow/:id
router.put('/unfollow/:id', async (req, res) => {
    try {
        const targetUser = await User.findByIdAndUpdate(req.params.id, {
            $pull: { followers: req.user._id }
        });

        await User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.params.id }
        });

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "Unfollowed successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Like/Unlike Post 
// URL: http://localhost:3500/api/social/like/:postId
router.put('/like/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Toggle Logic
        if (post.likes.includes(req.user._id)) {
            await post.updateOne({ $pull: { likes: req.user._id } }); // Remove like
            res.json({ message: "Post Unliked" });
        } else {
            await post.updateOne({ $push: { likes: req.user._id } }); // Add like
            res.json({ message: "Post Liked" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Add Comment 
// URL: http://localhost:3500/api/social/comment/:postId
/*
{
  "text": ""
}
*/
router.post('/comment/:postId', async (req, res) => {
    try {
        // Create comment
        const newComment = new Comment({
            text: req.body.text,
            post: req.params.postId,
            author: req.user._id
        });
        const savedComment = await newComment.save();

        // Add comment ID to post
        await Post.findByIdAndUpdate(req.params.postId, {
            $push: { comments: savedComment._id }
        });

        res.status(201).json({ message: "Comment added", comment: savedComment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Delete Comment
// URL: http://localhost:3500/api/social/comment/:commentId
router.delete('/comment/:commentId', async (req, res) => {
    try {
        // Find comment
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Security Check: Verify author
        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized: You can only delete your own comments" });
        }

        // Remove comment ID from post
        await Post.findByIdAndUpdate(comment.post, {
            $pull: { comments: req.params.commentId }
        });

        // Delete comment from database
        await comment.deleteOne();

        res.json({ message: "Comment deleted successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;