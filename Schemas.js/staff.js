const { model, Schema } = require('mongoose');

let kangelStaffSchema = new Schema({
    UserID: String,
    Username: String
});

module.exports = model('kangelStaff', kangelStaffSchema);