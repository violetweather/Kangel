const { model, Schema } = require('mongoose');

let guildSetupSchema = new Schema({
    GuildID: Number,
    Authoritatives: Array,
    LogChannelID: Number,
    knd: Boolean,
    kndOption: String,
    Token: String,
});

module.exports = model('guild_setup', guildSetupSchema);