/// <reference path="../typings/sequelize/sequelize.d.ts" />

import * as sequelize from 'sequelize';
import * as _ from 'lodash';

import {getDB} from './db';

import {Device, DeviceFromAPI, Location} from '../definitions/device';


function getDevice(rid?: string): any {
  if(!rid) {
    return getDB().Device.findAll().then(function(devices) {
      return devices;
    })
  } else {
    return getDB().Device.findOne({where: {rid: rid}}).then(function(device) {
      return device;
    })
  }
}
export {getDevice};
