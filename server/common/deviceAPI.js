/// <reference path="../typings/sequelize/sequelize.d.ts" />
"use strict";
var db_1 = require('./db');
var simplep_1 = require('../simplep/simplep');
var _ = require('lodash');

function getDevice(rid) {
    if (!rid) {
        return db_1.getDB().Device.findAll().then(function(devices) {
            return devices;
        });
    } else {
        return db_1.getDB().Device.findOne({ where: { rid: rid } }).then(function(device) {
            return device;
        });
    }
}

function readDeviceRequest(req, res, next) {
    var rid = req.params.rid;
    if (!rid) {
        res.status(400).json({ status: "error", err: "No device RID specified" });
    }
    // console.log("Request body: ", req.body);
    var aliases = req.body;
    getDevice(rid).then(function(device) {
        var deferred = new simplep_1.exoDefer({ "cik": "07b03708551eb9e995fbff5fcbb762cfa079f9ff", "client_id": device.rid });
        _.each(aliases, function(ao) {

            console.log("Request ao: ", ao);
            var alias = ao.alias;
            var options = ao.options;
            if (!options) {
                options = { limit: 1 };
            }
            //console.log("Alias: ", alias, " read options: ", options)
            deferred = deferred.read(alias, options);
        });
        deferred.then(function(result) {
            //console.log("Deferred result: ", result);
            res.send(result);
        });
    });
};

exports.getDevice = getDevice;
exports.readDeviceRequest = readDeviceRequest;
//# sourceMappingURL=deviceAPI.js.map