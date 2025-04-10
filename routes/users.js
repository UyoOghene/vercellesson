const express = require("express");
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require("../utilities/catchAsync");
const { storeReturnTo } = require('../middleware');

router.get('/register', (req, res) => {
    res.render('users/register');  
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error', 'Email already registered');
            return res.redirect('/register');
        }

        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Glam-box!');
            res.redirect('/posts');
        });
    } catch (e) {
        req.flash('error', 'Registration failed. Please try again.');
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login',
    storeReturnTo,
    passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),
    (req, res) => {
        req.flash('success', 'Welcome back!');
        const redirectUrl = res.locals.returnTo || '/posts'; // update this line to use res.locals.returnTo now
        res.redirect(redirectUrl);
    });


    router.get('/logout', (req, res, next) => {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Goodbye!');
            res.redirect('/posts');
        });
    }); 
module.exports = router;