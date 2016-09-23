import express = require('express');
import path = require('path');
import logger = require('morgan');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
var jwt = require('express-jwt');
let cors = require('cors')

import {config} from './config';

// auth0 user auth requires
import passport = require('passport');
var Auth0Strategy = require('passport-auth0')
import session = require('express-session');

// custom routes
import routes = require('./api/index');
import userAPI = require('./api/user');
import deviceAPI = require('./api/device');
import webApp = require('./api/webapp');

if(!config.CIK || config.CIK.length === 0) {
  console.log("NO ROOT CIK SUPPLIED - CANNOT PERFORM ACTIONS! Exiting. Set ENVVAR CIK='$CIK' or edit .env file to include a CIK")
  process.exit()
}

// This will configure Passport to use Auth0
var strategy = new Auth0Strategy({
    domain:       config.auth0.domain,
    clientID:     config.auth0.client_id,
    clientSecret: config.auth0.client_secret,
    callbackURL:  config.auth0.callback || 'http://localhost:3000/callback'
  }, function(accessToken, refreshToken, extraParams, profile, done) {
    console.log("Access: ", accessToken);
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  });

passport.use(strategy);

// you can use this section to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
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
app.use(session({ secret: config.APP_SECRET, resave: false,  saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

var whitelist = [/https:\/\/.*\.exosite\.io/, /http:\/\/localhost:.*/];
var corsOptions = {
  origin: whitelist,
  credentials: true
};

app.use(cors(corsOptions));

let jwtCheck = jwt({
  secret: new Buffer(config.auth0.client_secret, 'base64'),
  audience: config.auth0.client_id
});

if(config.env === "TEST") {
  app.use('/users', userAPI);
  app.use('/devices', deviceAPI);
  app.use('/', webApp);
} else {
  app.use('/users', jwtCheck, userAPI);
  app.use('/devices', jwtCheck, deviceAPI);
  app.use('/', webApp);
}

app.use(express.static(path.join(__dirname, 'web')));

//catch 404 and forward to error handler
app.use((req, res, next) => {
   var err = new Error('Not Found');
   err['status'] = 404;
   next(err);
});

// error handlers

// development error handler
// will print stacktrace
let x = true
if (x) {
   app.use((err: any, req, res, next) => {
     console.log("Error: ", err)
      res.status(err['status'] || 500);
      res.send({
        message: err.message,
        error: err
      })
   });
} else {
  // production error handler
  // no stacktraces leaked to user
  app.use((err: any, req, res, next) => {
     res.status(err.status || 500);
     res.send({
         message: err.message,
         error: {}
     });
  });
}
export = app;
