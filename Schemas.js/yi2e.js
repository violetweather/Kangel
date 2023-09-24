const { model, Schema } = require('mongoose');

let kndSchema = new Schema({
    iskndEnabled: Boolean,
    Guilds: Array,
    UserID: Number,
    AutomatedMessage: String,
    Updated: { type: Date, default: Date.now}
});

module.exports = model('knd', kndSchema);