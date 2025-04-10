const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    body: String,
    author: 
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, 
{ timestamps: true }); // Adds createdAt & updatedAt automatically

module.exports = mongoose.model("Comment", commentSchema);