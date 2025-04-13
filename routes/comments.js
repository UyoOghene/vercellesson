const express = require("express");
const router = express.Router({mergeParams: true});
const Post = require("../models/post");
const Comment = require('../models/comment');
const User = require('../models/user');
const comments = require('../controllers/comments');

const Joi = require('joi');
// const { cloudinary } = require('../cloudinary/index'); 
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError')
const {postSchema}= require('../schemas')
const {commentSchema} = require('../schemas')
const { isLoggedIn, isAuthor, isCommentAuthor, validatePost, validateComment } = require("../middleware");


  

  router.post('/', isLoggedIn, validateComment, catchAsync(comments.createComment));  

router.delete('/:commentId', isLoggedIn, catchAsync(comments.deleteComment));
module.exports = router;