const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const deviceTelemetrySchema = new Schema({
    deviceId: {
        type: Schema.Types.ObjectId,
        ref: 'Device',
        required: true
    },
    firmwareVersion: {
        type: String,
        required: true
    },
    configurationVersion: {
        type: String,
        required: true
    },
    lastConnection: {
        type: Date,
        default: Date.now
    }
});

const DeviceTelemetry = mongoose.model('DeviceTelemetry', deviceTelemetrySchema);

module.exports = DeviceTelemetry;