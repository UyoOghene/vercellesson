const mongoose = require('mongoose');
const Comment = require('./comment');

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
    author: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
}, { timestamps: true }); // 👈 This enables automatic createdAt/updatedAt fields

// Delete associated comments when a post is deleted
postSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: { $in: doc.comments }
        });
    }
});

module.exports = mongoose.model("Post", postSchema);