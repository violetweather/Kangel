const { model, Schema } = require('mongoose');

let starSchema = new Schema({
    AuthorID: String,
    Author: String,
    StarRating: Number,
    Comment: String,
    Updated: { type: Date, default: Date.now}
});

let userRepComments = new Schema({
    UserID: String,
    Ratings: [starSchema],
    Updated: { type: Date, default: Date.now}
});

module.exports = model('User', userRepComments);