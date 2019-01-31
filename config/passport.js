const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

// Load User model
var User = require('../models/user');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy(function(username, password, done) {
            // Find an user if exists, sets user as null in callback when not found
            User.findOne({ username: username }, function(err, user) {
                // Error Handler
                if (err) return done(err);

                // When user is not found
                if (!user) return done(null, false);

                // User found, compares password with bcrypt
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) handleError(err);

                    // Password does not match
                    if (!isMatch) return done(null, false);

                    // Successfully found user and password matched
                    return done(null, user);
                });
            });
        })
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
};
