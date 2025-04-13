const Post = require('../models/post');

module.exports.index = async(req, res) => {
  const posts = await Post.find({}).populate('author'); 
  res.render('posts/posts',{posts});
};