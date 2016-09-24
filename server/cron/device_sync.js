"use strict";
/// <reference path="../typings/cron/cron.d.ts" />
var cron_1 = require('cron');
var _ = require('lodash');
var simplep_1 = require('../simplep/simplep');
var db_1 = require('../common/db');
var config_1 = require('../config');
function syncDevices() {
    var cik = config_1.config.CIK;
    simplep_1.exo.listing(cik).then(function (result) {
        var clientRids = result.result.client;
        _.each(clientRids, function (rid) {
            // check if we have the device in the DB
            db_1.getDB().Device.findOne({ where: { rid: rid } }).then(function (device) {
                if (!device) {
                    // device not found in DB, add to database
                    simplep_1.exo.info({ 'cik': cik, 'client_id': rid }).then(function (infoResult) {
                        var description = infoResult.result.description;
                        var name = description.name;
                        var device = {
                            rid: rid,
                            name: name
                        };
                        db_1.getDB().Device.create(device).then(function (createResult) {
                            console.log("Added device to local DB w/ name: ", device.name);
                        });
                    });
                }
            });
        });
    });
}
exports.syncDevices = syncDevices;
var deviceSyncCron = new cron_1.CronJob({
    cronTime: "* 0 * * * *",
    onTick: syncDevices,
    start: false,
    timeZone: null
});
exports.deviceSyncCron = deviceSyncCron;
//# sourceMappingURL=device_sync.js.map