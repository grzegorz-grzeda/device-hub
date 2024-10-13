const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const deviceSchema = new Schema({
    deviceName: {
        type: String,
        required: true
    },
    MAC: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Device = mongoose.model('Device', deviceSchema);

module.exports = Device;