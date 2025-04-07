const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    // Add author reference when you implement authentication:
    // author: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User'
    // }
});

module.exports = mongoose.model("Comment", commentSchema);