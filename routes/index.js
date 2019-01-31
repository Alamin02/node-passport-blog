var express = require('express');
var router = express.Router();
var ensureLogin = require('connect-ensure-login').ensureLoggedIn;

var Post = require('../models/blog');

// Get the Home Page
router.get('/', function(req, res, next) {
    // Find all posts from the database
    Post.find({}, function(err, posts) {
        if (err) handleError(err);

        var isLoggedIn = req.user ? true : false;

        message = req.query.m;

        console.log(message);
        res.render('index', {
            posts: posts,
            isLoggedIn: isLoggedIn,
            message: message
        });
    });
});

// Get detailed Blog Post
router.get('/post/:postID', function(req, res, next) {
    var query = { _id: req.params.postID };

    // Find the blogpost with requested ID
    Post.findOne(query, function(err, post) {
        var isLoggedIn = req.user ? true : false;

        res.render('post', {
            isLoggedIn: isLoggedIn,
            post: post,
            message: ''
        });
    });
});

// Get Create Blog Page
router.get(
    '/createblog',
    ensureLogin(
        '/users/login?m=' + encodeURIComponent('You are not Logged in!')
    ),
    function(req, res, next) {
        if (req.user.role === 'user') {
            var isLoggedIn = req.user ? true : false;

            res.render('create-blog', {
                isLoggedIn: isLoggedIn,
                message: null
            });
        } else
            res.redirect(
                '/?m=' + encodeURIComponent('You do not have the permission')
            );
    }
);

// Handle Create Blog POST request
router.post('/createblog', function(req, res, next) {
    var title = req.body.title;
    var author = req.user.username;
    var post = req.body.post;

    var newPost = {
        title: title,
        author: author,
        post: post
    };

    Post.createNewPost(newPost, function() {
        res.redirect('/');
    });
});

module.exports = router;
