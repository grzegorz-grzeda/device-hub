
const session = require('express-session');
const MongoStore = require('connect-mongo');
const crypto = require('crypto');
const cron = require('node-cron');
const sessionSecretModel = require('../models/sessionSecretModel');

let currentSecret;
let previousSecret;

async function initializeSecrets() {
    const sessionSecret = await sessionSecretModel.findOne();
    if (!sessionSecret) {
        currentSecret = crypto.randomBytes(64).toString('hex');
        previousSecret = crypto.randomBytes(64).toString('hex');
        await sessionSecretModel.create({ currentSecret: currentSecret, previousSecret: previousSecret });
    } else {
        currentSecret = sessionSecret.currentSecret;
        previousSecret = sessionSecret.previousSecret;
    }

}

module.exports = async (app) => {
    await initializeSecrets()
    app.use(session({
        secret: [currentSecret, previousSecret],
        store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/session' }),
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,        // Not accessible via JavaScript
            sameSite: 'strict',    // Protect against CSRF,
            maxAge: 10 * 24 * 60 * 60 * 1000
        }
    }));
    app.use((req, res, next) => {
        req.session.cookie.secret = [currentSecret, previousSecret];
        next();
    });

    cron.schedule('0 0 * * 0', async () => {
        try {
            previousSecret = currentSecret;
            currentSecret = crypto.randomBytes(64).toString('hex');
            await SessionSecret.findOneAndUpdate({}, {
                currentSecret,
                previousSecret,
                updatedAt: Date.now(),
            });
            console.log('Session secret rotated');
        } catch (err) {
            console.error(err);
        }
    });
}