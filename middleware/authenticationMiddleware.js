const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per `window`
    message: 'Too many login attempts, please try again later.'
});

module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
    },
    ensureNotAuthenticated: (req, res, next) => {
        if (!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/dashboard');
    },
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
    loginLimiter: loginLimiter
}