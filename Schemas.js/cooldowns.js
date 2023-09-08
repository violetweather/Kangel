const { model, Schema } = require('mongoose');

let cooldownData = new Schema({
    UserID: Number,
    Commands: Array,
    Time: Number
});

module.exports = model('cooldownData', cooldownData);