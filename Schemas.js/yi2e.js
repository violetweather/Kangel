const { model, Schema } = require('mongoose');

let yi2eSchema = new Schema({
    isYI2EEnabled: Boolean,
    Guilds: Array,
    UserID: Number,
    AutomatedMessage: String,
    Updated: { type: Date, default: Date.now}
});

module.exports = model('yi2e', yi2eSchema);