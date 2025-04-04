const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const Comment = require('../models/comment');
const User = require('../models/user')
const Joi = require('joi');
const { cloudinary } = require('../cloudinary/index'); 



router.get('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
        .populate('author')
        .populate({
            path: 'comments',
            populate: { path: 'author' } // Ensures author details appear in comments
        });

    if (!post) {
        req.flash('error', 'Post not found!');
        return res.redirect('/posts',);
    }

    res.render('posts/show', { post, currentUser: req.user, moment });
});
