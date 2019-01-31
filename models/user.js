var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var userSchema = new Schema(
    {
        username: {
            type: String
        },
        password: {
            type: String
        },
        role: {
            type: String
        }
    },
    { collection: 'users' }
);

var User = (module.exports = mongoose.model('User', userSchema));

// Adding a new property to User for creating a new user
module.exports.createNewUser = function(user, callback) {
    var newUser = new User(user);

    // Encrypting the password with bcryptjs before storing
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            // Assigning the encrypted password to user
            newUser.password = hash;

            newUser.save(function(err, createdUser) {
                if (err) return handleError(err);

                // Pass the newly created user to the callback function
                callback(createdUser);
            });
        });
    });
};
