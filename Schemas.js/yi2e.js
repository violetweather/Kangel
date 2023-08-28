const { model, Schema } = require('mongoose');

let yi2eSchema = new Schema({
    Auths: Array,
    CaseID: Number,
    GuildID: Number,
    UserID: Number,
    Notes: String,
    Updated: { type: Date, default: Date.now}
});

module.exports = model('yi2e', yi2eSchema);