"use strict";
var express = require('express');
var device_1 = require('../definitions/device');
var _ = require('lodash');
var Q = require('q');
var simplep_1 = require('../simplep/simplep');
var db_1 = require('../common/db');
var deviceAPI_1 = require('../common/deviceAPI');
var router = express.Router();
/* GET device listing . */

router.post('/', function(req, res, next) {
    var did = req.query.did;
    var ao = req.body;
    // console.log("get devivces", ao[0].alias);
    if (did) {
        console.log("get devivces", ao);
        deviceAPI_1.getDevice(did).then(function(device) {
            device['readData'](ao, { 'limit': 5 }).then(function(data) {
                device['data'] = data;
                var d = new device_1.Device(device);
                res.send(d);
            });
        });
    } else {
        deviceAPI_1.getDevice().then(function(devices) {
            return _.map(devices, function(device) {
                return device['readData'](ao, { 'limit': 5 }).then(function(data) {
                    device['data'] = data;
                    var d = new device_1.Device(device);
                    // console.log("Device promises - DAta: ", JSON.stringify(d));
                    return d;
                });
            });
        }).then(function(devicePromises) {
            console.log("Device promises: ", JSON.stringify(devicePromises));
            Q.all(devicePromises).then(function(devices) {
                console.log("Device promises - Result: ", JSON.stringify(devices));
                res.send(devices);
            });
        });
    }
});

router.get('/', function(req, res, next) {
    var did = req.query.did;
    if (did) {
        console.log("get devivces", did);
        deviceAPI_1.getDevice(did).then(function(device) {
            device['readData']({ 'limit': 10 }).then(function(data) {
                device['data'] = data;
                var d = new device_1.Device(device);
                res.send(d);
            });
        });
    } else {
        deviceAPI_1.getDevice().then(function(devices) {
            return _.map(devices, function(device) {
                return device['readData']({ 'limit': 10 }).then(function(data) {
                    device['data'] = data;
                    var d = new device_1.Device(device);
                    console.log("Device promises - DAta: ", JSON.stringify(d));
                    return d;
                });
            });
        }).then(function(devicePromises) {
            console.log("Device promises: ", JSON.stringify(devicePromises));
            Q.all(devicePromises).then(function(devices) {
                console.log("Device promises - Result: ", JSON.stringify(devices));
                res.send(devices);
            });
        });
    }
});
var verifyString = function(item) {
    return typeof item === "string" && item.length !== 0;
};
router.post('/create', function(req, res, next) {
    console.log("Creating device: ", req.body);
    var device = req.body;
    // console.log("(DeviceAPI) Body: ", device)
    if (verifyString(device.sn) && verifyString(device.model) && verifyString(device.vendor)) {
        var cik = '07b03708551eb9e995fbff5fcbb762cfa079f9ff';
        simplep_1.exo.createDevice(cik, device).then(function(result) {
            //console.log("[DeviceAPI - exo_device_create] ", result);
            db_1.getDB().Device.create(result).then(function(create) {
                res.send(create);
            }, function(error) {
                res.status(500).send({ "status": "error", "message": error });
            });
        }, function(error) {
            res.status(500).send({ "status": "error", "message": error });
        });
    } else {
        res.status(400).send({ "status": "error", "message": "SN, model, or vendor not given" });
    }
});
router.post('/delete', function(req, res, next) {
    var deleteDevice = req.body;
    //console.log("Body: ", device)
    var cik = '07b03708551eb9e995fbff5fcbb762cfa079f9ff';
    simplep_1.exo.drop(cik, deleteDevice.rid).then(function(result) {
        //console.log("Drop result: ", result)
        return db_1.getDB().Device.destroy({
            where: deleteDevice
        });
    }, function(error) {
        console.log("Error dropping device! ", error);
        return error;
    }).then(function(result) {
        // console.log("[Device HTTP API - Create Device Result] ", result)
        res.send({ "status": result.status, "rid": deleteDevice.rid });
    }, function(error) {
        console.log("[Device HTTP API - Create Device Error] ", error);
        res.send({ "status": "error", "message": error });
    });
});
router.post('/read/:rid', function(req, res, next) {
    return deviceAPI_1.readDeviceRequest(req, res, next);
});

router.post('/write/:rid/:alias', function(req, res, next) {
    var rid = req.params.rid;
    var alias = req.params.alias;
    var payload = req.body;
    deviceAPI_1.getDevice(rid).then(function(device) {
        device.write(alias, payload).then(function(result) {
            //console.log("ts write result: ", result);
            res.send({ "status": "ok", "alias": alias });
        });
    });
});
router.get('/keys/:did', function(req, res, next) {
    var did = req.params.did;
    var keys = req.query.keys;
    if (typeof keys === "undefined" || keys.length === 0 || (keys.length === 1 && keys[0] === '')) {
        res.status(400).json({ err: 'No keys supplied' });
        return;
    }
    keys = keys.split(',');
    var response = {};
    res.send(response);
});
// Set keys for a userID /user/keys/:uid
router.post('/keys/:did', function(req, res, next) {
    var did = req.params.did;
    //console.log("Setting keys on user: ", did);
    _.each(req.body, function(value, key) {
        //console.log("Setting key: ", key, " to ", value);
    });
    res.send(true);
});
module.exports = router;
//# sourceMappingURL=device.js.map