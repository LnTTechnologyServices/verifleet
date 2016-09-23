/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/supertest/supertest.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
/// <reference path="../typings/lodash/lodash.d.ts" />

import * as supertest from 'supertest';
import * as _ from 'lodash';
import {expect} from 'chai';

import { Device } from '../definitions/device';

const URL = process.env["API_URL"] || "https://poof4.apps.exosite.io"
const API_TOKEN = process.env['API_TOKEN'] || 'Bearer testAuthToken'
const API_AUTHENTICATION_HEADER = 'authorization'

function makeId(length: number) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ ) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function verifyDevice(device) {
  expect(device.pid).to.be.a('string');
  expect(device.pid.length).to.be.above(14);
  expect(device.pid.length).to.be.below(17);
  expect(device.sn).to.be.a('string');
  expect(device.data).to.be.an('object');
  return true
}

function finishTest(err, res, done) {
  if(err) {
    console.log("ERROR: ", err)
    console.log("RES BODY: ", res.body)
    console.log("RES ERROR: ", res.error)
    throw err;
  }
  done();
}

describe('Device API', function()  {
  var server;
  beforeEach(() => {});
  afterEach(() => {});

  describe('Unauthorized API requests', function() {
    it(`responds w/ a 401 unauthorized when the ${API_AUTHENTICATION_HEADER} header is not set`, function(done) {
      this.timeout(8000);
      supertest(URL)
      .get("/api/v1/authtest")
      .expect(401)
      .end((err, res) => {
        finishTest(err, res, done)
      });
    })
    it(`responds w/ a 200 ok when the ${API_AUTHENTICATION_HEADER} header is set`, function(done) {
      this.timeout(8000);
      supertest(URL)
      .get("/api/v1/authtest")
      .set(API_AUTHENTICATION_HEADER, API_TOKEN)
      .expect(200)
      .end((err, res) => {
        finishTest(err, res, done)
      });
    })

  })

  describe("/api/v1/products endpoint", function() {
    this.timeout(8000);
    it('responds to /api/v1/products w/ an object of {pid:[sn]}', (done) =>  {
      supertest(URL)
      .get('/api/v1/products')
      .set(API_AUTHENTICATION_HEADER, API_TOKEN)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        _.each(res.body, function(sns, pid) {
          expect(pid).to.be.a('string');
          expect(pid.length).to.be.above(14);
          expect(pid.length).to.be.below(17);
          expect(sns).to.be.a('array');
          expect(sns).to.have.length.above(0)
        })
      })
      .end((err, res) => {
        finishTest(err, res, done)
      });
    });

    it(`responds to /api/v1/products/$PID w/ an information object about the PID`, (done) =>  {
      var PID;

      supertest(URL)
      .get('/api/v1/products')
      .set(API_AUTHENTICATION_HEADER, API_TOKEN)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) =>  {
        if (err) {
          console.log("ERROR: ", err)
        }
        _.each(res.body, function(sns, pid) {
          expect(pid).to.be.a('string');
          expect(pid.length).to.be.above(14);
          expect(pid.length).to.be.below(17);
          expect(sns).to.be.a('array');
          expect(sns).to.have.length.above(0)
        })
        PID = _.sample(_.keys(res.body))

        supertest(URL)
        .get(`/api/v1/products/${PID}`)
        .set(API_AUTHENTICATION_HEADER, API_TOKEN)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).to.have.property('bizid')
          expect(res.body).to.have.property('endpoint')
          expect(res.body).to.have.property('id')
          expect(res.body.id).to.equal(PID)
          expect(res.body).to.have.property('resources')
          expect(res.body.resources).to.be.an('array')
        })
        .end((err, res) => {
          finishTest(err, res, done)
        });
      });
    });
  });

  describe("/api/v1/devices endpoint", function()  {
    this.timeout(8000);

    it('responds to /api/v1/devices w/ a list of devices', done =>  {
      supertest(URL)
      .get('/api/v1/devices')
      .set(API_AUTHENTICATION_HEADER, API_TOKEN)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        res.body.map(device => {
            expect(verifyDevice(device)).to.be.true;
        })
      })
      .end((err, res) => {
        finishTest(err, res, done)
      });
    });
  })

  describe("/api/v1/devices/$PID endpoint", function() {
    this.timeout(8000);
    var PID;
    beforeEach((done) => {
      supertest(URL)
      .get('/api/v1/products')
      .set(API_AUTHENTICATION_HEADER, API_TOKEN)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        PID = _.sample(_.keys(res.body))
      })
      .end((err, res) => {
        finishTest(err, res, done)
      });
    });

    it('responds to /api/v1/devices/$PID with devices of certain PID', (done) => {
      supertest(URL)
      .get('/api/v1/devices/'+PID)
      .set(API_AUTHENTICATION_HEADER, API_TOKEN)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        expect(res.body).to.be.an('array')
        res.body.map( (device) => {
          expect(verifyDevice(device)).to.be.true;
          expect(device.pid).to.equal(PID);
        })
      })
      .end((err, res) => {
        finishTest(err, res, done)
      });
    });
  })

  describe("/api/v1/devices/$PID/$SN endpoints", function() {
    this.timeout(8000);
    var PID;
    var SN;

    beforeEach((done) => {
      supertest(URL)
      .get('/api/v1/products')
      .set(API_AUTHENTICATION_HEADER, API_TOKEN)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        var pids = _.keys(res.body)
        PID = pids[Math.floor(Math.random()*pids.length)]
        SN = res.body[PID][Math.floor(Math.random()*res.body[PID].length)]
      })
      .end((err, res) => {
        finishTest(err, res, done)
      });
    });

    it(`responds to /api/v1/devices/$PID/$SN with device of certain PID / SN pair`, (done) => {
      supertest(URL)
      .get(`/api/v1/devices/${PID}/${SN}`)
      .set(API_AUTHENTICATION_HEADER, API_TOKEN)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect((res) => {
        let device = res.body;
        expect(device.pid).to.equal(PID);
        expect(device.sn).to.equal(SN);
      })
      .end((err, res) => {
        finishTest(err, res, done)
      });
    });

    it(`responds to /api/v1/devices/$PID/$SN/$ALIAS with an object of {alias:[data]}`, (done) => {
      supertest(URL)
      .get(`/api/v1/devices/${PID}/${SN}`)
      .set(API_AUTHENTICATION_HEADER, API_TOKEN)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        let device = res.body;
        expect(device.pid).to.equal(PID);
        expect(device.sn).to.equal(SN);
        let alias = _.sample(_.keys(device.data))
        supertest(URL)
        .get(`/api/v1/devices/${PID}/${SN}/${alias}`)
        .set(API_AUTHENTICATION_HEADER, API_TOKEN)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property(alias)
          expect(res.body[alias]).to.be.an('array')
          expect(res.body[alias]).to.have.length(1)
        })
        .end((err, res) => {
          finishTest(err, res, done)
        });
      });
    });

    it(`responds to /api/v1/devices/$PID/$SN/$ALIAS?limit=10 with an object of {alias:[data]} and length 10`, (done) =>  {
      let LIMIT = 10;
      supertest(URL)
      .get(`/api/v1/devices/${PID}/${SN}`)
      .set(API_AUTHENTICATION_HEADER, API_TOKEN)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        let device = res.body;
        expect(device.pid).to.equal(PID);
        expect(device.sn).to.equal(SN);
        let alias = _.sample(_.keys(device.data))
        supertest(URL)
        .get(`/api/v1/devices/${PID}/${SN}/${alias}`)
        .set(API_AUTHENTICATION_HEADER, API_TOKEN)
        .query({limit:LIMIT})
        .expect(200)
        .expect('Content-Type', /json/)
        .expect((res) => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property(alias)
          expect(res.body[alias]).to.be.an('array')
          expect(res.body[alias]).to.have.length(LIMIT)
        })
        .end((err, res) => {
          finishTest(err, res, done)
        });
      });
    });

    it(`responds to /api/v1/devices/$PID/$SN/$ALIAS?starttime=0&limit=1`, (done) =>  {
      let LIMIT = 1
      supertest(URL)
      .get(`/api/v1/devices/${PID}/${SN}`)
      .set(API_AUTHENTICATION_HEADER, API_TOKEN)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) =>  {
        let device = res.body;
        expect(device.pid).to.equal(PID);
        expect(device.sn).to.equal(SN);
        let alias = _.sample(_.keys(device.data))
        supertest(URL)
        .get(`/api/v1/devices/${PID}/${SN}/${alias}`)
        .set(API_AUTHENTICATION_HEADER, API_TOKEN)
        .query({limit:LIMIT})
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).to.be.an('object')
          expect(res.body).to.have.property(alias)
          expect(res.body[alias]).to.be.an('array')
          expect(res.body[alias]).to.have.length(LIMIT)
        })
        .end((err, res) => {
          finishTest(err, res, done)
        });
      });
    });
  });
});
