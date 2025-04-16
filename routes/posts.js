const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const posts = require('../controllers/posts');
const Comment = require('../models/comment');
const User = require('../models/user')
const Joi = require('joi');
const passport = require("passport");
const LocalStrategy = require('passport-local');

const session = require('express-session')
const { cloudinary } = require('../cloudinary/index'); 
const multer = require('multer');
 const { storage } = require('../cloudinary/index');
 const upload = multer({ storage });
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError')
const {postSchema}= require('../schemas')
const {commentSchema} = require('../schemas')
const { isLoggedIn, isAuthor, isCommentAuthor, validatePost, validateComment } = require("../middleware");


// Home Route
router.get('/', posts.index );

router.post('/',isLoggedIn,upload.array('image') ,validatePost,catchAsync(posts.createNew));

router.get("/new",isLoggedIn, (posts.newform))

router.get('/:id/edit', isLoggedIn,catchAsync(posts.editform));
  
  router.put('/:id',validatePost, catchAsync(posts.updatedpost));
  
// Show a single post
router.get('/:id', posts.showpost);

router.post('/:id/like', isLoggedIn,(posts.likepost));

  router.delete("/:id", isLoggedIn, catchAsync(posts.deletepost));
  
  module.exports = router;