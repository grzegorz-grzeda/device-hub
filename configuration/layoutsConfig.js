const expressLayouts = require("express-ejs-layouts");

module.exports = async (app) => {
    app.set("view engine", "ejs");
    app.set("layout", "layouts/layout");
    app.set('layout extractStyles', true);
    app.set('layout extractScripts', true);
    app.use(expressLayouts);
}