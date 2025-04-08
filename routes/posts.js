const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const Comment = require('../models/comment');
const User = require('../models/user')
const Joi = require('joi');
const session = require('express-session')
// const { cloudinary } = require('../cloudinary/index'); 
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError')
const {postSchema}= require('../schemas')
const {commentSchema} = require('../schemas')

const validatePost = (req,res, next) =>{
  const {error} = postSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg, 400)
  }else{
    next();
  }

}


router.get("/new", (req, res)=>{
    res.render('posts/new')
  })

  router.get('/:id/edit', catchAsync((async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      console.log('post not found')
        return res.redirect('/posts');
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
  
  router.get('/:id', catchAsync(async(req, res) => {
    const post = await Post.findById(req.params.id).populate('comments');
    if (!post) {
      throw new ExpressError('Post not found', 404);
    }
    res.render('posts/show', { post });
  }));
  
  router.delete("/:id", async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect("/"); 
  });
  
  module.exports = router;