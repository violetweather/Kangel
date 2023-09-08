const { model, Schema } = require('mongoose');

let userRepComments = new Schema({
    UserID: Number,
    Ratings: {
        Comments: {
            Author: Number,
            Comment: String,
            Time: String,
        }
    },

    Updated: { type: Date, default: Date.now}
});

module.exports = model('userRepComments', userRepComments);