const mongoose = require('mongoose');

const firstLaunchSchema = new mongoose.Schema({
    firstLaunch: {
        type: Boolean,
        required: true,
        default: true
    },
    launchDate: {
        type: Date,
        default: Date.now
    }
});

const FirstLaunch = mongoose.model('FirstLaunch', firstLaunchSchema);

module.exports = FirstLaunch;