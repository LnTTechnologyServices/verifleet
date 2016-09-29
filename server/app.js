"use strict";
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var cors = require('cors');
var config_1 = require('./config');
// auth0 user auth requires
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');
var session = require('express-session');
var userAPI = require('./api/user');
var deviceAPI = require('./api/device');
var truckAPI = require('./api/truck');
var siteAPI = require('./api/site');
var webApp = require('./api/webapp');
if (!config_1.config.CIK || config_1.config.CIK.length === 0) {
    console.log("NO ROOT CIK SUPPLIED - CANNOT PERFORM ACTIONS! Exiting. Set ENVVAR CIK='$CIK' or edit .env file to include a CIK");
    process.exit();
}
// This will configure Passport to use Auth0
var strategy = new Auth0Strategy({
    domain: config_1.config.auth0.domain,
    clientID: config_1.config.auth0.client_id,
    clientSecret: config_1.config.auth0.client_secret,
    callbackURL: config_1.config.auth0.callback || 'http://localhost:3000/callback'
}, function (accessToken, refreshToken, extraParams, profile, done) {
    console.log("Access: ", accessToken);
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
});
passport.use(strategy);
// you can use this section to keep a smaller payload
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
var app = express();
//import websocketAPI = require('./api/websocket');
//console.log("WS api: ", websocketAPI);
app.set('view engine', 'html');
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
// See express session docs for information on the options: https://github.com/expressjs/session
//app.use(session({ secret: config_1.config.APP_SECRET, resave: false, saveUninitialized: false }));
//app.use(passport.initialize());
//app.use(passport.session());
var whitelist = [/https:\/\/.*\.exosite\.io/, /http:\/\/localhost:.*/,/http:\/\/59.145.122.180:.*/];
var corsOptions = {
    origin: whitelist,
    credentials: true
};
app.use(cors(corsOptions));
var jwtCheck = jwt({
    secret: new Buffer(config_1.config.auth0.client_secret, 'base64'),
    audience: config_1.config.auth0.client_id
});
if (config_1.config.env === "TEST") {
    app.use('/users', userAPI);
    app.use('/devices', deviceAPI);
    app.use('/truck', truckAPI);
    app.use('/site', siteAPI);
    app.use('/', webApp);
}
else {
    app.use('/users', userAPI);
    app.use('/devices', deviceAPI);
    app.use('/truck', truckAPI);
    app.use('/site', siteAPI);
    app.use('/', webApp);
}
app.use(express.static(path.join(__dirname, 'web')));
//catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
var x = true;
if (x) {
    app.use(function (err, req, res, next) {
        console.log("Error: ", err);
        res.status(err['status'] || 500);
        res.send({
            message: err.message,
            error: err
        });
    });
}
else {
    // production error handler
    // no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: {}
        });
    });
}
module.exports = app;
//# sourceMappingURL=app.js.map
