const { model, Schema } = require('mongoose');

let pullRecordSchema = new Schema({
    ItemRecordDate: { type: Date, default: Date.now},
    ItemRecordRarity: String,
    ItemRecordName: String,
    ItemRecordID: Number
});

let itemSchema = new Schema({
    ItemDate: Date,
    ItemRarity: String,
    ItemName: String,
    ItemID: Number,
    ItemRarityStandard: String
});

let redeemSchema = new Schema({
    RedeemCode: String,
    RedeemDate: { type: Date, default: Date.now}
})


let accountSchema = new Schema({
    Redeems: [redeemSchema],
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