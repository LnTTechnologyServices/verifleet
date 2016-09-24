"use strict";
var express = require('express');
var device_1 = require('../definitions/device');
var _ = require('lodash');
var Q = require('q');
var simplep_1 = require('../simplep/simplep');
var db_1 = require('../common/db');
var deviceAPI_1 = require('../common/deviceAPI');
var router = express.Router();

/* GET Test API . */
router.get('/', function (req, res, next) {
    res.send("Hello");
});

/* GET Live Data . */
router.post('/alerts/:starttime/:endtime',  function (req, res, next) {
    res.send("alerts");
});


module.exports = router;