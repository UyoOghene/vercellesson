const express = require("express");
const router = express.Router();
const Post = require("../models/post");

const Comment = require('../models/comment');
const User = require('../models/user')
const Joi = require('joi');
const passport = require("passport");
const LocalStrategy = require('passport-local');

const session = require('express-session')
// const { cloudinary } = require('../cloudinary/index'); 
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError')
const {postSchema}= require('../schemas')
const {commentSchema} = require('../schemas')
const { isLoggedIn, validatePost } = require('../middleware');


// Home Route
router.get('/', async(req, res) => {
  const posts = await Post.find({}); 
  res.render('posts/posts',{posts});
});

router.post('/',isLoggedIn, validatePost,catchAsync(async(req, res) => {
  const { caption, title, image, author } = req.body.post; 
    req.flash('sucess', 'made a new post')
      const newpost = new Post({
      caption: caption.trim(),
      title: title.trim(),
      image: image.trim(),
      author: req.user._id
    });

    const savedPost = await newpost.save();
    console.log('Saved post:', savedPost);
    res.redirect(`/posts/${savedPost._id}`);
  
}));



router.get("/new",isLoggedIn,(req, res)=>{
    res.render('posts/new')
  })

  router.get('/:id/edit', isLoggedIn,catchAsync((async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      console.log('post not found')
        return res.redirect('posts/posts');
    }
    res.render('posts/edit', { post });
  })));
  
  router.put('/:id',validatePost, catchAsync(async (req, res) => {
    const { id } = req.params;
    const { caption, image, title } = req.body.post;
  
  
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { caption, image, title },
      { new: true }
    );
  
    res.redirect(`/posts/${updatedPost._id}`);
  }));
  
// Show a single post
router.get('/:id', async (req, res) => {
  const post = await Post.findById(req.params.id)
      .populate('author')
      .populate({
          path: 'comments',
          populate: { 
              path: 'author',
              select: 'username email' // Only fetch these fields for security
          }
      });

  if (!post) {
      req.flash('error', 'Post not found!');
      return res.redirect('/posts');
  }
  res.render('posts/show', { post, currentUser: req.user });
});

router.post('/:id/like', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);

  if (!post) {
      req.flash('error', 'Post not found.');
      return res.redirect('/posts');
  }

  const likeIndex = post.likes.indexOf(req.user._id);
  let liked = false;

  if (likeIndex === -1) {
      post.likes.push(req.user._id);
      liked = true;
  } else {
      post.likes.splice(likeIndex, 1);
  }

  await post.save();

  // Send JSON data for AJAX functionality or redirect for traditional form
  if (req.headers['accept'].includes('application/json')) {
      return res.json({ likesCount: post.likes.length, liked });
  }

  res.redirect(`/posts/${id}`);
});

  router.delete("/:id", isLoggedIn, catchAsync(async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    req.flash('success', 'Deleted post');
    res.redirect("/posts");
}));
  
  module.exports = router;