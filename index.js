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

const express = require('express');
const app = express();

const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local').Strategy;

const MongoStore = require('connect-mongo');

const expressLayouts = require('express-ejs-layouts');

app.set('view engine', 'ejs');
app.use(expressLayouts);

passport.use(new LocalStrategy(
    (username, password, done) => {
        if (username === 'admin' && password === 'admin') {
            return done(null, { username: 'admin' });
        } else {
            return done(null, false, { message: 'Incorrect username or password' });
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser((username, done) => {
    done(null, { username });
}
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: config.mongodb_uri,
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60
    })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login', message: req.flash('error') });
});

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

function isNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/welcome');
    }
    next();
}

app.get('/welcome', isAuthenticated, (req, res) => {
    res.render('welcome', { title: 'Welcome', user: req.user });
});

app.post('/login', isNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/welcome',
    failureRedirect: '/login',
    failureFlash: true
}));

app.listen(config.http_port, () => {
    console.log(`Server is running on port ${config.http_port}`);
});