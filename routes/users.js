var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/user');

// Get /user page, if someone try in case
router.get('/', function(req, res, next) {
    res.send('This page is yet to implement');
});

// Get Login page
router.get('/login', function(req, res, next) {
    res.render('login', { message: req.query.m });
});

// Handle Login request with passport
router.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/?m=' + encodeURIComponent('Login Successful'),
        failureRedirect:
            '/users/login?m=' + encodeURIComponent('Invalid Credentials'),
        failureFlash: false
    })
);

// Logout and redirect to home
router.get('/logout', function(req, res, next) {
    req.logOut();
    return res.redirect('/?m=' + encodeURIComponent('You Have Looged Out!'));
});

// Get Signup page
router.get('/signup', function(req, res, next) {
    res.render('signup');
});

// Handle Signup request
router.post('/signup', function(req, res, next) {
    var username = req.body.username;

    var requestedUser = {
        username: req.body.username,
        password: req.body.password,
        role: req.body.role
    };

    // Check if the username already exists
    User.findOne({ username: username }, function(err, user) {
        if (err) handleError(err);

        // Username is unique
        if (!user) {
            User.createNewUser(requestedUser, function(createdUser) {
                // Login automatically after successful registation
                req.login(createdUser, function(err) {
                    if (err) return next(err);

                    return res.redirect(
                        '/?m=' + encodeURIComponent('Registation Successful')
                    );
                });
            });
        } else
            res.render('signup', {
                message: 'Someone already took that user ID, Oops!'
            });
    });
});

module.exports = router;
