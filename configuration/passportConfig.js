const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const userModel = require('../models/userModel');

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    app.use((req, res, next) => {
        res.locals.currentUser = req.user;
        next();
    });

    passport.use(new LocalStrategy({ usernameField: 'email' },
        async (email, password, done) => {
            try {
                const user = await userModel.findOne({ email: email });
                if (!user) {
                    return done(null, false, { message: 'Incorrect email' });
                }

                const isMatch = await user.checkPassword(password);
                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect password' });
                }

                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userModel.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};