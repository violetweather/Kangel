const { model, Schema } = require('mongoose');

let guildSetupSchema = new Schema({
    GuildID: Number,
    Authoritatives: Array,
    LogChannelID: Number,
    YI2E: Boolean,
    YI2EOption: String,
    Token: String,
});

module.exports = model('guild_setup', guildSetupSchema);