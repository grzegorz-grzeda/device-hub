/**
 * @license
 * MIT License
 * 
 * Copyright (c) 2024 Grzegorz Grzęda
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const config = require('./configuration/configuration');

function setUpExpressApp() {
    const express = require("express");
    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const path = require("path");
    app.use(express.static(path.join(__dirname, "views/public")));

    const bodyParser = require("body-parser");
    app.use(bodyParser.urlencoded({ extended: true }));

    const morgan = require('morgan');
    app.use(morgan('dev'));

    return app;
}

async function configureApp(app) {
    const sessionConfig = require("./configuration/sessionConfig");
    await sessionConfig(app);

    const flashMessageConfig = require("./configuration/flashMessageConfig");
    flashMessageConfig(app);

    const passportConfig = require("./configuration/passportConfig");
    passportConfig(app);

    const layoutsConfig = require("./configuration/layoutsConfig");
    layoutsConfig(app);
}

function establishErrorHandling(app, server) {
    const errorHandling = require("./middleware/errorMiddleware");
    errorHandling(app);

    process.on('unhandledRejection', (err) => {
        console.error('Unhandled Rejection! Shutting down...');
        console.error(err.name, err.message);
        server.close(() => {
            process.exit(1);
        });
    });

    process.on('uncaughtException', (err) => {
        console.error('Uncaught Exception! Shutting down...');
        console.error(err.name, err.message);
        server.close(() => {
            process.exit(1);
        });
    });
}

function setUpRoutes(app) {
    app.get('/', (req, res) => {
        res.render('index', { title: 'Home' });
    });

    app.get('/login', (req, res) => {
        res.render('login', { title: 'Login', message: req.flash('error') });
    });

    const authenticationMiddleware = require('./middleware/authenticationMiddleware');
    app.get('/welcome', authenticationMiddleware.ensureAuthenticated('/login'), (req, res) => {
        res.render('welcome', { title: 'Welcome', user: req.user });
    });

    app.post('/login', authenticationMiddleware.login('/welcome', '/login'));

    const profileRouter = require('./routes/profileRouter');
    app.use('/profile', profileRouter);
}

async function main() {
    const app = setUpExpressApp();

    await configureApp(app);

    setUpRoutes(app);

    const server = app.listen(config.http_port, () => {
        console.log(`Device Hub listening at http://localhost:${config.http_port}`);
    });

    establishErrorHandling(app, server);
}

main();