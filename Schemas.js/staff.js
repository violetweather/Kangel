const { model, Schema } = require('mongoose');

let staffSchema = new Schema({
    UserID: String,
    Username: String,
});

let kangelStaffSchema = new Schema({
    Staff: [staffSchema]
});

module.exports = model('kangelStaff', kangelStaffSchema);