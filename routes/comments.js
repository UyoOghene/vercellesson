const express = require("express");
const router = express.Router({mergeParams: true});
const Post = require("../models/post");
const Comment = require('../models/comment');
const User = require('../models/user')
const Joi = require('joi');
// const { cloudinary } = require('../cloudinary/index'); 
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError')
const {postSchema}= require('../schemas')
const {commentSchema} = require('../schemas')
const { isLoggedIn, isAuthor, isCommentAuthor, validatePost, validateComment } = require("../middleware");


  

  router.post('/', isLoggedIn, validateComment, catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
        req.flash('error', 'Post not found');
        return res.redirect('/posts');
    }
    
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    post.comments.push(comment);
    
    await comment.save();
    await post.save();
    
    req.flash('success', 'Comment added successfully');
    res.redirect(`/posts/${post._id}`);
}));  

router.delete('/:commentId', isLoggedIn, catchAsync(async (req, res) => {
  const { id, commentId } = req.params;
  
  // Find the comment first to check ownership
  const comment = await Comment.findById(commentId);
  
  if (!comment) {
      req.flash('error', 'Comment not found');
      return res.redirect(`/posts/${id}`);
  }
  
  // Check if current user is the author
  if (!comment.author.equals(req.user._id)) {
      req.flash('error', 'You do not have permission to delete this comment');
      return res.redirect(`/posts/${id}`);
  }
  
  await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
  await Comment.findByIdAndDelete(commentId);
  req.flash('success', 'Comment deleted successfully');
  res.redirect(`/posts/${id}`);
}));
module.exports = router;