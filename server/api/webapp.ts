import * as express from 'express';
import * as _ from 'lodash';
import passport = require('passport');

var router = express.Router();

// Auth0 callback handler
router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '#/login' }),
  function(req, res) {
    console.log(req.session)
    res.redirect(req.session['returnTo'] || '/');
  });

export = router;
