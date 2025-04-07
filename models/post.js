const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    caption: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: { 
        type: Date,
        default: Date.now
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

module.exports = mongoose.model("Post", postSchema);