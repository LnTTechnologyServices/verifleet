"use strict";
var Q = require('q');
var _ = require('lodash');
var simplep_1 = require('../simplep/simplep');
module.exports = function (sequelize, DataTypes) {
    var Device = sequelize.define('device', {
        rid: { type: DataTypes.STRING, unique: true, primaryKey: true },
        created: { type: DataTypes.FLOAT, defaultValue: new Date().getTime() },
        model: DataTypes.STRING,
        name: DataTypes.STRING,
        sn: DataTypes.STRING,
        vendor: DataTypes.STRING,
        updated: { type: DataTypes.FLOAT, defaultValue: new Date().getTime() },
        type: { type: DataTypes.STRING, defaultValue: "device" }
    }, {
        classMethods: {
            associate: function (models) {
                Device.hasMany(models.Notifications);
                Device.hasMany(models.Permissions);
            }
        },
        instanceMethods: {
            read: function (alias, options) {
                console.log("This: ", this);
            },
            write: function (alias, payload) {
                var auth = { "cik": '07b03708551eb9e995fbff5fcbb762cfa079f9ff', "client_id": this.rid };
                return simplep_1.exo.write(auth, alias, payload).then(function (result) {
                    //console.log("exo write result:" , result);
                    return result;
                });
            },
            getDataports: function () {
                var defer = Q.defer();
                var auth = { "cik": '07b03708551eb9e995fbff5fcbb762cfa079f9ff', "client_id": this.rid };
                var infoDefer = new simplep_1.exoDefer(auth);
                infoDefer.info().then(function (info) {
                    var aliases = _.map(info[0].result.aliases, function (value, key) {
                        return value[0];
                    });
                    defer.resolve(aliases);
                });
                return defer.promise;
            },
            readData: function (options) {
                var defer = Q.defer();
                if (!options) {
                    options = { limit: 1 };
                }
                var auth = { "cik": "07b03708551eb9e995fbff5fcbb762cfa079f9ff", "client_id": this.rid };
                var infoDefer = new simplep_1.exoDefer(auth);
                infoDefer.info().then(function (info) {
                    var aliases = _.map(info[0].result.aliases, function (value, key) {
                        return value[0];
                    });
                    if (aliases.length) {
                        var data_1 = {};
                        var readDefer_1 = new simplep_1.exoDefer(auth);
                        _.each(aliases, function (alias) {
                            //console.log("Reading alias: ", alias);
                            readDefer_1.read(alias, options);
                        });
                        readDefer_1.then(function (results) {
                            _.each(results, function (result) {
                                var alias = aliases[result.id];
                                var datapoints = _.map(result.result, function (datapoint) {
                                    var point;
                                    try {
                                        point = JSON.parse(datapoint[1]);
                                        if (!point['timestamp']) {
                                            point['timestamp'] = datapoint[0] * 1000;
                                        }
                                    }
                                    catch (e) {
                                        point = {
                                            'value': datapoint[1],
                                            'timestamp': datapoint[0] * 1000
                                        };
                                    }
                                    return point;
                                });
                                datapoints = _.filter(datapoints, function (x) { return x.timestamp; });
                                data_1[alias] = datapoints;
                            });
                            //console.log("Results from read defer: ", data);
                            defer.resolve(data_1);
                        });
                    }
                    else {
                        defer.resolve({});
                    }
                });
                return defer.promise;
            }
        }
    });
    return Device;
};
//# sourceMappingURL=model_device.js.map