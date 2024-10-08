const rateLimit = require('express-rate-limit');
const passport = require('passport');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per `window`
    message: 'Too many login attempts, please try again later.'
});

function ensureNotAuthenticated(redirectOnFailure) {
    return function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect(redirectOnFailure);
    }
}

module.exports = {
    ensureAuthenticated: (redirectOnFailure) => (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect(redirectOnFailure);
    },
    ensureNotAuthenticated: ensureNotAuthenticated,
    ensureApiAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.status(401).json({ message: 'Not authenticated' });
    },
    ensureApiNotAuthenticated: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.json({ message: 'Already authenticated' });
    },
    loginLimiter: loginLimiter,
    login: (redirectOnSuccess, redirectOnFailure) => [
        loginLimiter,
        ensureNotAuthenticated(redirectOnSuccess),
        passport.authenticate('local', {
            successRedirect: redirectOnSuccess,
            failureRedirect: redirectOnFailure,
            failureFlash: true
        })
    ],
    logout: (redirectOnSuccess, redirectOnFailure) => [
        this.ensureAuthenticated(redirectOnFailure),
        (req, res, next) => {
            req.logout((err) => {
                if (err) {
                    return next(err);
                } req.session.destroy((err) => {
                    if (err) {
                        return next(err);
                    }
                    res.clearCookie('connect.sid');
                    res.redirect(redirectOnSuccess);
                });
            })
        }
    ]
}