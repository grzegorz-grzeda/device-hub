const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sessionSecretSchema = new Schema({
    currentSecret: {
        type: String,
        required: true
    },
    previousSecret: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const SessionSecret = mongoose.model('SessionSecret', sessionSecretSchema);

module.exports = SessionSecret;