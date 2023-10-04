const { model, Schema } = require('mongoose');

let accountSchema = new Schema({
    Guild: String,
    User: String,
    Followers: Number,
    Bank: Number,
    LastDaily: {type: Number, default: 0},
    Wallet: Number,
    StressStat: Number,
    AffectionStat: Number,
    MentalDarknessStat: Number,
    DailyActivityCount: Number,
    LastActivity: {type: Number, default: 0}
});

module.exports = model('Account', accountSchema);