module.exports = (app) => {
    app.use((req, res, next) => {
        res.status(404).render('error', { subject: "Page Not Found", message: "Sorry, the page you are looking for does not exist." });
    });
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).render('error', { subject: "Internal Server Error", message: "Sorry, something went wrong on our end. Please try again later." });
    });
}