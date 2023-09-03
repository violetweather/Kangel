const { model, Schema } = require('mongoose');

let banSchema = new Schema({
    isYI2E: Boolean,
    isExempt: Boolean,
    YI2EOption: Boolean,
    CaseID: Number,
    GuildID: Number,
    UserID: Number,
    Notes: String,
    Updated: { type: Date, default: Date.now}
});

module.exports = model('bans', banSchema);