const Post = require('./models/post');        
const Comment = require('./models/comment');  
const User = require('./models/user')
const passport = require('passport');
const { commentSchema, postSchema } = require('./schemas.js');  
const Joi = require('joi');
const multer = require('multer');
const { storage } = require('./cloudinary/index.js'); 
const upload = multer({ storage });
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError')



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

// module.exports.validatePost = (req, res, next) => {
//     const { error } = postSchema.validate(req.body);
//     if (error) {
//         const msg = error.details.map(el => el.message).join(',');
//         throw new ExpressError(msg, 400);
//     } else {
//         next();
//     }
// };

module.exports.validatePost = (req, res, next) => {
    if (!req.body.deleteImages) {
        req.body.deleteImages = [];
    } else if (!Array.isArray(req.body.deleteImages)) {
        req.body.deleteImages = [req.body.deleteImages];
    }
    
    const { error } = postSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
module.exports.validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join(',');
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };


module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/posts/${id}`);
    }
    next();
}

module.exports.isCommentAuthor = async (req, res, next) => {
    const { id, commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/posts/${id}`);
    }
    next();
}

