import * as express from 'express';
import {Device, DeviceFromAPI, Location, Dataports} from '../definitions/device';
import {CreateDevice, DeleteDevice} from '../definitions/device_actions';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as Q from 'q';

import {exo, exoDefer} from '../simplep/simplep';

import {getDB} from '../common/db';

import {getDevice} from '../common/deviceAPI';

var router = express.Router();

/* GET device listing . */
router.get('/', function(req, res, next) {
  let did = req.query.did;

  if(did) {
    console.log("get devivces", did)
    getDevice(did).then(function(device) {
      device['readData']({'limit':10}).then(function(data) {
        device['data'] = data
        let d = new Device(device as DeviceFromAPI);
        res.send(d);
      });
    })
  } else {
    getDevice().then(function(devices) {
      return _.map(devices, function(device) {
        return device['readData']({'limit':10}).then(function(data) {
          device['data'] = data
          let d = new Device(device as DeviceFromAPI);
          return d
        });
      });
    }).then(function(devicePromises) {
      console.log("Device promises: ", devicePromises);
      Q.all(devicePromises).then(function(devices) { res.send(devices) })
    })
  }
});

let verifyString = function(item: string) {
  return typeof item === "string" && item.length !== 0
}

router.post('/create', function(req, res, next) {
  console.log("Creating device: ", req.body)
  let device = req.body as CreateDevice
  // console.log("(DeviceAPI) Body: ", device)
  if(verifyString(device.sn) && verifyString(device.model) && verifyString(device.vendor)) {
    let cik = process.env['CIK'];
    exo.createDevice(cik, device).then(function(result) {
      //console.log("[DeviceAPI - exo_device_create] ", result);
      getDB().Device.create(result).then(function(create) {
        res.send(create)
      }, function(error) {
        res.status(500).send({"status": "error", "message": error})
      })
    }, function(error) {
      res.status(500).send({"status": "error", "message": error})
    })
  } else {
    res.status(400).send({"status":"error", "message": "SN, model, or vendor not given"})
  }

})

router.post('/delete', function(req, res, next) {
  let deleteDevice = req.body as DeleteDevice;
  //console.log("Body: ", device)
  let cik = process.env['CIK'];
  exo.drop(cik, deleteDevice.rid).then(function(result) {
    //console.log("Drop result: ", result)
    return getDB().Device.destroy({
      where: deleteDevice
    });
  }, function(error) {
    console.log("Error dropping device! ", error)
    return error
  }).then(function(result) {
    // console.log("[Device HTTP API - Create Device Result] ", result)
    res.send({"status": result.status, "rid": deleteDevice.rid})
  }, function(error) {
    console.log("[Device HTTP API - Create Device Error] ", error)
    res.send({"status":"error", "message": error})
  });
})

function readDeviceRequest(req, res, next) {
  let rid = req.params.rid;
  if(!rid) {
    res.status(400).json({status: "error", err: "No device RID specified"});
  }

  let aliases = req.body

  getDevice(rid).then(function(device) {
    let deferred = new exoDefer({"cik": process.env['CIK'], "client_id":device.rid})

    _.each(aliases, function(ao) {
      let alias = ao.alias;
      let options = ao.options;
      if(!options) {
        options = {limit: 1};
      }
      //console.log("Alias: ", alias, " read options: ", options)
      deferred = deferred.read(alias, options)
    })

    deferred.then(function(result) {
      //console.log("Deferred result: ", result);
      res.send(result);
    })

  })
}

router.post('/read/:rid', readDeviceRequest)

router.post('/write/:rid/:alias', function(req, res, next) {
  let rid = req.params.rid;
  let alias = req.params.alias;
  let payload = req.body;

  getDevice(rid).then(function(device) {
    device.write(alias, payload).then(function(result) {
      //console.log("ts write result: ", result);
      res.send({"status": "ok", "alias": alias})
    })
  })
})

router.get('/keys/:did', function(req, res, next) {
  let did = req.params.did;
  let keys = req.query.keys;

  if(typeof keys === "undefined" || keys.length === 0 || (keys.length === 1 && keys[0] === '')) {
    res.status(400).json({err:'No keys supplied'})
    return
  }

  keys = keys.split(',')

  let response = {}
  res.send(response);
})

// Set keys for a userID /user/keys/:uid
router.post('/keys/:did', function(req, res, next) {
  let did = req.params.did;
  //console.log("Setting keys on user: ", did);
  _.each(req.body, function(value, key) {
      //console.log("Setting key: ", key, " to ", value);
  })

  res.send(true);
})


export = router;
