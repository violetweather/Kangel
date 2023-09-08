const { model, Schema } = require('mongoose');

let userRepComments = new Schema({
    Author: String,
    UserID: Number,
    Reputation: Number,
    Comments: Array,
    Updated: { type: Date, default: Date.now}
});

module.exports = model('userRepComments', userRepComments);