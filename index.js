const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieSession = require('cookie-session');
const morgan = require('morgan');
require('./passport-setup');
const config = require('./config');
const pug = require('pug');

app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cookieSession({
    name: 'r9k-session',
    keys: ['key1', 'key2']
  }));

app.use(passport.initialize());
app.use(passport.session());
app.use('/public', express.static('public'));


const isLogIn = ((req, res, next) => {
    if (req?.user) {
        next();
    } else {
        res.status(401).send(pug.renderFile('./templates/logIn.pug', {
            user: req?.user
        }))
    }
});

app.get('/', isLogIn, async (req, res) => {
    res.send(pug.renderFile('./templates/home.pug', {
        user: req.user,
        urlToSend: config.urlToSendFromForm
    }))
});

app.get('/failed', (req, res) => res.send('You Failed to log in!'));

// Auth Routes
app.get('/google/log-in', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
});

app.listen(config.port, () => console.log(`Listening on port ${config.port}!`));