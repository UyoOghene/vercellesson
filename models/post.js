const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    image: String,
    caption: String,
    createdAt: { 
        type: Date,
         default: Date.now
         },
})

module.exports = mongoose.model("Post", postSchema);
