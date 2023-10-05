const { model, Schema } = require("mongoose");

let vote = new Schema({
    Guild: String,
    Message: String,
    LikeMembers: Array,
    DislikeMembers: Array,
    Likes: Number,
    Dislikes: Number,
    Owner: String
})

module.exports = model("vote", vote)