const { model, Schema } = require('mongoose');
const { customAlphabet } = require('nanoid')
const nanoid = customAlphabet('1234567890abcdef', 10)

let starSchema = new Schema({
    _id: {
        type: String,
        default: () => nanoid(5),
    },
    AuthorID: String,
    Author: String,
    StarRating: Number,
    Comment: String,
    Updated: { type: Date, default: Date.now}
});

let guildRepComments = new Schema({
    ServerID: String,
    Ratings: [starSchema],
    Updated: { type: Date, default: Date.now}
});

module.exports = model('serverReviews', guildRepComments);