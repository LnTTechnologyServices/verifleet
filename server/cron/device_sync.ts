/// <reference path="../typings/cron/cron.d.ts" />
import {CronJob} from 'cron';
import * as _ from 'lodash';

import {exo} from '../simplep/simplep';
import {getDB} from '../common/db';
import {config} from '../config';

function syncDevices() {
  let cik = config.CIK;
  exo.listing(cik).then(function(result) {
    let clientRids = result.result.client;
    _.each(clientRids, function(rid) {
      // check if we have the device in the DB
      getDB().Device.findOne({where: {rid: rid}}).then(function(device) {
        if(!device) {
          // device not found in DB, add to database
          exo.info({'cik':cik, 'client_id':rid}).then(function(infoResult) {
            let description = infoResult.result.description;
            let name = description.name;
            let device = {
              rid: rid,
              name: name
            }
            getDB().Device.create(device).then(function(createResult) {
              console.log("Added device to local DB w/ name: ", device.name);
            })
          })
        }
      })
    })
  })
}

let deviceSyncCron = new CronJob({
  cronTime: "* 0 * * * *",
  onTick: syncDevices,
  start: false,
  timeZone: null
});

export {deviceSyncCron, syncDevices}
