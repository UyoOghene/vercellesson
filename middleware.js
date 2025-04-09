const Post = require('./models/post');        
const Comment = require('./models/comment');  
const User = require('./models/user')
const passport = require('passport');
const { commentSchema, postSchema } = require('./schemas.js');  
const Joi = require('joi');
// const multer = require('multer');
// const { storage } = require('./cloudinary'); 
// const upload = multer({ storage });


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

module.exports.validatePost = (req, res, next) => {
    const { error } = postSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};