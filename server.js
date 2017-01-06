'use strict';

var express = require('express');
var path = require('path');
var logger = require('morgan');
var compression = require('compression');
var methodOverride = require('method-override');
var session = require('express-session');
var flash = require('express-flash');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.load();

// Controllers
var HomeController = require('./controllers/home');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(methodOverride('_method'));
app.use(session({ secret: process.env.SESSION_SECRET, resave: true, saveUninitialized: true }));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', HomeController.index);

// Production error handler
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.sendStatus(err.status || 500);
  });
}

app.set('huejay', new (require('huejay')).Client({
  host: process.env.HUE_BRIDGE_HOST,
  username: process.env.HUE_API_USERNAME
}));

app.get('huejay').bridge.ping()
    .then(() => {
        console.log('Established connection to Hue Bridge at ' + process.env.HUE_BRIDGE_HOST + '.');
    })
    .catch(error => {
        console.error('Could not reach Hue Bridge at ' + process.env.HUE_BRIDGE_HOST + ": " + error);
        process.exit(1);
    })
    .then(() => {
        app.get('huejay').bridge.isAuthenticated()
        .then(() => {
            console.log('Hue Bridge authentication successful.');
        })
        .catch(error => {
            console.error('Failed to authenticate with Hue Bridge using username ' + process.env.HUE_API_USERNAME +
                    ': ' + error);
            process.exit(2);
        })
    });

app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
