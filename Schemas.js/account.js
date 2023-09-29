const { model, Schema } = require('mongoose');

let accountSchema = new Schema({
    Guild: String,
    User: String,
    Followers: Number,
    Bank: Number,
    LastDaily: {type: Number, default: 0},
    Wallet: Number
});

module.exports = model('Account', accountSchema);