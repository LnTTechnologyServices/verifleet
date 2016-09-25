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
router.post('/livedata/:rid',  function (req, res, next) {
    res.send({id:req.params.rid, DGE: 20, DistanceToEmpty: 10, DGE_Hour: 13});
});

/* GET Last Trip Data . */
router.post('/lasttrip/:rid',  function (req, res, next) {
    res.send({id:req.params.rid, EngineHours: 20, MilesDriven: 10, FaultCode: 13, DGE_Hour:20, TotalGasUsed: 60});
});

/* GET Gas Filled Day Wise . */
router.post('/gasfilled/:rid/:starttime/:endtime',  function (req, res, next) {
    res.send({id:req.params.rid, gasfilled : [{timestamp:0, dgefilled: 45}, {timestamp: 1, dgefilled: 50}]});
});

/* GET Gas Filled & Gas Consumed Day Wise . */
router.post('/gasfilledconsumed/:rid/:starttime/:endtime',  function (req, res, next) {
     res.send({id:req.params.rid, gasfilledconsumed : [{timestamp:0, dgefilled: 25}, {timestamp: 1, dgefilled: 35}]});
});

module.exports = router;