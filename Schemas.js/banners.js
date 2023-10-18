const { model, Schema } = require('mongoose');

let bannerInfo = new Schema({
    BannerName: String,
    BannerStarted: {type: Number, default: 0}
});

module.exports = model('Banner', bannerInfo);