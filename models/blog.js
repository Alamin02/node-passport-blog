var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new Schema(
    {
        title: {
            type: String
        },
        time: {
            type: Date,
            default: Date.now
        },
        author: {
            type: String
        },
        post: {
            type: String
        }
    },
    { collection: 'blogs' }
);

var Post = (module.exports = mongoose.model('Post', postSchema));

// Adding a property to Post model for creating new posts
module.exports.createNewPost = function(post, callback) {
    var newPost = new Post(post);

    newPost.save(function(err) {
        if (err) return handleError(err);
        callback();
    });
};
