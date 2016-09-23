/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/supertest/supertest.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />


import * as supertest from 'supertest';
import * as _ from 'lodash';
import * as Q from 'q';
import {expect} from 'chai';

import {exo, exoDefer} from "../simplep/simplep"

import {Device, DeviceFromAPI, Dataports, Location} from '../definitions/device';

function makeId(length: number)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function makeDevice() {
  return {
    sn: "0",
    model: 'test',
    vendor: 'test_vendor',
    name: "test_device_" + makeId(10)
  }
}

function verifyDevice(device) {
    // check that the users are returned with {'type':'user'} and they have an email / id
    let d = new Device(device as DeviceFromAPI);
    return d.type === "device" && d.rid.length === 40
}

describe('Device API', function() {
  var server;
  beforeEach(function(done) {
    server = require('../app');
    done();
  });
  afterEach(function() {
  });

  describe("device creation", function() {
    it('Can create and delete a new device', function(done) {
      this.timeout(10000);
      let device = makeDevice();
      //console.log("(TEST) Creating device: ", device);
      supertest.agent(server)
        .post('/devices/create')
        .send(device)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(verifyDevice(res.body)).to.be.true;
          let receivedDevice = new Device(res.body as DeviceFromAPI);
          expect(receivedDevice.name).to.equal(device.name);

          supertest.agent(server)
            .post('/devices/delete')
            .send(receivedDevice)
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
        });
    });
  })

  describe("device management", function() {
    var createDevices = _.map(_.range(2), function() {
      return makeDevice()
    });
    let devices = [];

    beforeEach(function(done) {
      let device_promises = _.map(devices, function(createDevice) {
        let d = Q.defer();
        supertest.agent(server)
          .post('/devices/create')
          .send(createDevice)
          .set('Content-Type', 'application/json')
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            expect(verifyDevice(res.body)).to.be.true;
            let device = new Device(res.body as DeviceFromAPI);
            devices.push(device);
            d.resolve(true)
          })
        return d.promise;
      })

      Q.all(device_promises).done(function() {
          done();
      })
    })

    afterEach(function(done) {
      let device_promises = _.map(devices, function(createDevice) {
        let d = Q.defer();
        supertest.agent(server)
          .post('/devices/delete')
          .send()
          .set('Content-Type', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200, done);
        return d.promise;
        })

        Q.all(device_promises).done(function() {
          done();
        })

    });

    it('responds to /devices w/ a 200', function(done) {
      supertest.agent(server)
        .get('/devices')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('responds to /devices w/ a list of devices', function(done) {
      supertest.agent(server)
        .get('/devices')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          _.each(res.body, function(device) {
            expect(verifyDevice(device)).to.be.true
          })
          done();
        });
    });
  })

  describe("Device Reading / Writing", function() {

    var device;
    let createDevice = makeDevice();
    let aliases = _.map(_.range(5), function() { return makeId(10) })
    let values = _.map(aliases, function(alias){ return {"value": makeId(60)} })
    //console.log("Aliases: ", aliases, " values: ", values);

    beforeEach(function(done) {
      this.timeout(10000);
      supertest.agent(server)
        .post('/devices/create')
        .send(createDevice)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(verifyDevice(res.body)).to.be.true;
          device = new Device(res.body as DeviceFromAPI);

          let alias_deferreds = _.map(aliases, function(alias) {
            let d = Q.defer();
            exo.create({"cik":process.env['CIK'],"client_id":device.rid}, alias, "dataport", "string").then(function(result) {
              d.resolve(true);
            })
            return d.promise;
          })

          Q.all(alias_deferreds).done(function(values) {
            done();
          });
        })
    })

    afterEach(function(done) {
      supertest.agent(server)
        .post('/devices/delete')
        .send(device)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done);
    })

    it("can write / read from a single device dataport", function(done) {
      let alias = aliases[0];
      let value = values[0];

      supertest.agent(server)
        .post('/devices/write/'+device.rid+'/'+alias)
        .send(value)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          //console.log("Write Res: ", res.body)
          let readBody = [{"alias": alias, "options": {}}]

          supertest.agent(server)
            .post('/devices/read/'+device.rid)
            .send(readBody)
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .end(function(err, res) {
              //console.log("Read Res: ", res.body)
              done();
            })
        })
      })

    it("can write / read multiple device dataports", function(done) {
      this.timeout(10000)
      let write_deferreds = _.map(aliases, function(alias, index) {
        let d = Q.defer();

        //console.log("Writing ", values[index], " to alias: ", alias);
        supertest.agent(server)
          .post('/devices/write/'+device.rid+'/'+alias)
          .send(values[index])
          .set('Content-Type', 'application/json')
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            d.resolve(true);
          })

          return d.promise;
        })

        Q.all(write_deferreds).then(function() {
          let readBody = _.map(aliases, function(alias) {
            return {alias: alias, options: {}}
          })

          supertest.agent(server)
            .post('/devices/read/'+device.rid)
            .send(readBody)
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .end(function(err, res) {
              //console.log("Result: ", JSON.stringify(res.body))
              _.each(res.body, function(call, index) {
                let receivedValue = JSON.parse(call['result'][0][1]).value;
                let expectedValue = values[index].value;
                expect(expectedValue).to.deep.equal(receivedValue);
              })

              done();
            })
        })
      })
    })
});
