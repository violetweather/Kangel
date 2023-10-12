const { model, Schema } = require("mongoose");
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('1234567890abcdef', 10);

let reminderSchema = new Schema({
    _id: {
        type: String,
        default: () => nanoid(5),
    },
    User: String,
    Time: String,
    Remind: String
})

module.exports = model("Reminders", reminderSchema)