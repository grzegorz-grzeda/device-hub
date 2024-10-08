const flash = require('connect-flash');

module.exports = async (app) => {
    app.use(flash());
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error = req.flash('error');
        next();
    });
}   