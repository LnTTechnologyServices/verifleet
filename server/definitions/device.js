/// <reference path="../typings/sequelize/sequelize.d.ts" />
// Definition of device and available methods
"use strict";
var Device = (function () {
    function Device(device) {
        this.created = device.created;
        this.children = device.children;
        this.data = device.data;
        this.location = device.location;
        this.location_gps = device.location_gps;
        this.model = device.model;
        this.name = device.name;
        this.rid = device.rid;
        this.sn = device.sn;
        this.status = device.status;
        this.tags = device.tags;
        this.type = device.type;
        this.updated = device.updated;
    }
    Device.prototype.read = function (alias, timeframe) {
        console.log("Reading alias: ", alias, " with parameters: ", timeframe);
    };
    Device.prototype.write = function (alias, payload) {
        console.log("Writing alias: ", alias, " with payload: ", payload);
    };
    Device.prototype.set = function (key, value) { };
    Device.prototype.get = function (key) { };
    return Device;
}());
exports.Device = Device;
//# sourceMappingURL=device.js.map