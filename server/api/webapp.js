"use strict";
var express = require('express');
var passport = require('passport');
var router = express.Router();
// Auth0 callback handler
router.get('/callback', passport.authenticate('auth0', { failureRedirect: '#/login' }), function (req, res) {
    console.log(req.session);
    res.redirect(req.session['returnTo'] || '/');
});
module.exports = router;
//# sourceMappingURL=webapp.js.map