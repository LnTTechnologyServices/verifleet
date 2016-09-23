import * as Sequelize from 'sequelize';

import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

var userModel = require('../definitions/model_user');
var permissionModel = require('../definitions/model_permission');
var deviceModel = require('../definitions/model_device');
var notificationModel = require('../definitions/model_notification');


import {config} from '../config';

let started = false;
let db = null;

if(!started) {

  let sequelize = new Sequelize(config.database.url, config.database.options);

  interface DB {
    sequelize: any;
    Sequelize: any;
    User: any;
    Notification: any;
    Permission: any;
    Device: any
  }

  db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    User:      sequelize.import('../definitions/model_user'),
    Permission:      sequelize.import('../definitions/model_permission'),
    Notification:      sequelize.import('../definitions/model_notification'),
    Device:      sequelize.import('../definitions/model_device')
    // add your other models here
  } as DB

  /*
    Associations can be defined here. E.g. like this:
    global.db.User.hasMany(global.db.SomethingElse)
  */

  db.sequelize
  .authenticate()
  .then(function(err) {
    console.log('Connection has been established successfully.');
  }, function (err) {
    console.log('Unable to connect to the database:', err);
  });

}

function getDB() {
  return db;
}

export {getDB};
