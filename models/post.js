const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    caption: {
        type: String,
        required: false 
    },
    image: {
        type: String,
        required: true 
    },
    location: {
        type: String,
        required: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment' 
    }],
    
    createdAt: {
        type: Date,
        default: Date.now 
    }
});

module.exports = mongoose.model('Post', postSchema);