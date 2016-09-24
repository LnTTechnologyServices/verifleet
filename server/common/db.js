"use strict";
var Sequelize = require('sequelize');
var userModel = require('../definitions/model_user');
var permissionModel = require('../definitions/model_permission');
var deviceModel = require('../definitions/model_device');
var notificationModel = require('../definitions/model_notification');
var config_1 = require('../config');
var started = false;
var db = null;
if (!started) {
    var sequelize = new Sequelize(config_1.config.database.url, config_1.config.database.options);
    db = {
        Sequelize: Sequelize,
        sequelize: sequelize,
        User: sequelize.import('../definitions/model_user'),
        Permission: sequelize.import('../definitions/model_permission'),
        Notification: sequelize.import('../definitions/model_notification'),
        Device: sequelize.import('../definitions/model_device')
    };
    /*
      Associations can be defined here. E.g. like this:
      global.db.User.hasMany(global.db.SomethingElse)
    */
    db.sequelize
        .authenticate()
        .then(function (err) {
        console.log('Connection has been established successfully.');
    }, function (err) {
        console.log('Unable to connect to the database:', err);
    });
}
function getDB() {
    return db;
}
exports.getDB = getDB;
//# sourceMappingURL=db.js.map