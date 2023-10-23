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
})


let guildSetupSchema = new Schema({
    GuildID: Number,
    Bans: [banSchema],
    Authority: Array,
    LogChannelID: Number,
    knd: Boolean,
    kndOption: String,
    Token: String,
    AutomatedMessage: String,
});

module.exports = model('guild_setup', guildSetupSchema);