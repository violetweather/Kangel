const { model, Schema } = require('mongoose');

let banSchema = new Schema({
    isknd: Boolean,
    isExempt: Boolean,
    kndOption: Boolean,
    CaseID: Number,
    GuildID: Number,
    UserID: Number,
    Notes: String,
    Updated: { type: Date, default: Date.now}
});

module.exports = model('bans', banSchema);