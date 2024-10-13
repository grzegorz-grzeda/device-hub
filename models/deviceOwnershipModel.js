const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const deviceOwnershipSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    deviceId: {
        type: Schema.Types.ObjectId,
        ref: 'Device',
        required: true
    },
    controlLevel: {
        type: String,
        enum: ['read', 'write', 'admin'],
        default: 'read'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const DeviceOwnership = mongoose.model('DeviceOwnership', deviceOwnershipSchema);

module.exports = DeviceOwnership;