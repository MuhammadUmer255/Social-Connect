const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    image: {
        type: String,
        required: true 
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 86400 
    }
});

module.exports = mongoose.model('Story', storySchema);