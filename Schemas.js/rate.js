const { model, Schema } = require('mongoose');

let starSchema = new Schema({
    Author: String,
    UserID: Number,
    StarRating: Number,
    Comment: String,
    Updated: { type: Date, default: Date.now}
});

module.exports = model('starSchema', starSchema);