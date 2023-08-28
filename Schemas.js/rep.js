const { model, Schema } = require('mongoose');

let repSchema = new Schema({
    Author: String,
    UserID: Number,
    Reputation: Number,
    Comment: String,
    Updated: { type: Date, default: Date.now}
});

module.exports = model('repSchema', repSchema);