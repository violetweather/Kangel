const { model, Schema } = require('mongoose');

let pullRecordSchema = new Schema({
    ItemRecordDate: { type: Date, default: Date.now},
    ItemRecordRarity: String,
    ItemRecordName: String,
    ItemRecordID: Number
});

let itemSchema = new Schema({
    ItemDate: { type: Date, default: Date.now},
    ItemRarity: String,
    ItemName: String,
    ItemID: Number
});


let accountSchema = new Schema({
    Perks: [Array],
    Pulls: [pullRecordSchema],
    Items: [itemSchema],
    Guild: String,
    User: String,
    Followers: Number,
    Bank: Number,
    LastDaily: {type: Number, default: 0},
    Wallet: Number,
    Crystal: Number,
    StressStat: Number,
    AffectionStat: Number,
    MentalDarknessStat: Number,
    DailyActivityCount: Number,
    LastActivity: {type: Number, default: 0}
});

module.exports = model('Account', accountSchema);