/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import * as supertest from 'supertest';
import * as _ from 'lodash';
import {expect} from 'chai';

import {exo, exoDefer, exoWs} from './simplep';
import {checkRpcOk, makeDevice, makeId} from './helpers';

let cik = process.env['CIK'];

if(!cik) {
  console.log('NO "CIK" environment variable set!')
  process.exit()
}

describe("RPC deferred functionality", function() {
  var exodefer;
  let device = makeDevice("vendor");
  var rid;

  beforeEach(function(done) {
    exo.createDevice(cik, device).then(function(result) {
      rid = result.rid;
      let auth = {"cik": cik, "client_id":rid}
      exodefer = new exoDefer({"cik":cik, "client_id":rid});
      exo.create(auth, 'alarm', "dataport", "string").then(function(result) {
        exo.create(auth, 'raw_data', "dataport", "string").then(function(result) {
          done();
        })
      })
    })
  })

  afterEach(function(done) {
    exo.drop(cik, rid).then(function(result) {
      done();
    })
  })

  it("can create a deferred call", function(done) {
    exodefer
    .info()
    .read('alarm')
    .read('raw_data')
    .then(function(res) {
      //console.log("Res: ", res);
      expect(_.every(_.map(res, checkRpcOk))).to.be.true;
      done();
    })
  })

  it("can read a dataport deferred", function(done) {
    exodefer
    .read('alarm')
    .then(function(result) {
      expect(result)
      done();
    }).catch(function(err) {
      console.log("Error: ", err)
    })
  })
})

describe('RPC Functionality', function() {
  let device = makeDevice("vendor");
  var rid;
  var auth;

  beforeEach(function(done) {
    exo.createDevice(cik, device).then(function(result) {
      rid = result.rid;
      auth = {"cik": cik, "client_id":rid}

      exo.create(auth, 'alarm', "dataport", "string").then(function(result) {
        exo.create(auth, 'raw_data', "dataport", "string").then(function(result) {
          done();
        })
      })
    })
  })

  afterEach(function(done) {
    exo.drop(cik, rid).then(function(result) {
      done();
    })
  })

  it("can read a dataport", function(done) {
    exo.read(auth, 'alarm').then(function(result) {
      expect(result.status).to.equal('ok')
      done();
    })
  })

  it("can write a dataport", function(done) {
    let data = {'data': Math.random()}
    exo.write(auth, 'alarm', data).then(function(res) {
      exo.read(auth, 'alarm').then(function(result) {
        expect(result.status).to.equal('ok')
        let returned = JSON.parse(result.result[0][1])
        expect(returned).to.deep.equal(data)
        done();
      })
    })
  })

  it("can create a dataport", function(done) {
    let name = 'test_' + makeId(5)
    exo.create(auth, name, "dataport", "string").then(function(result) {
      expect(result.status).to.equal('ok');
      done();
    })
  })

  it("can create and drop a device", function(done) {
    let device = makeDevice("vendor");
    exo.createDevice(cik, device).then(function(result) {
      expect(result.rid).to.have.length(40);
      exo.drop(cik, result.rid).then(function(dropResult) {
        expect(dropResult.status).to.equal('ok');
        done();
      })
    })
  })

  it("can list the children", function(done) {
    exo.listing(auth).then(function(result) {
      expect(result.status).to.equal('ok');
      done();
    })
  })
})


describe("WS functionality", function() {
  it("can connect to wss://m2.exosite.com/ws", function(done) {
    let ws = new exoWs(cik);
    ws.connected().then(function(open) {
      expect(open).to.be.true;
      done();
    }, function(err) {
      expect(err).to.be.undefined;
    })
  })

  it("can subscribe to a device alias & get a message when written", function(done) {
    this.timeout(10000);

    let ws = new exoWs(cik);
    let device = makeDevice("vendor");

    exo.createDevice(cik, device).then(function(result) {
      let rid = result.rid;
      let alias = 'test_' + makeId(5);
      let auth = {"cik": cik, "client_id":rid}
      let data = {'data': Math.random()}

      exo.create({"cik":cik, "client_id":rid}, alias, "dataport", "string").then(function(result) {

        ws.error(function(error) {
          expect(error).to.be.undefined
        })

        ws.on(function(payload) {
          expect(payload.rid).to.equal(rid);
          expect(payload.alias).to.equal(alias);
          expect(payload.value).to.deep.equal(data);
          exo.drop(cik, rid).then(function(res) {
            expect(res.status).to.equal('ok', 'Could not drop rid! '+rid)
            done();
          })
        })

        ws.connected().then(function() {
          // does not work!
          //ws.subscribe({"rid": rid, "alias":alias})
          // works!
          ws.subscribe({"alias": alias, "rid":rid});
          exo.write(auth, alias, data).then(function(res) {
            if(res.status !== "ok") {
              console.log("Result from write: ", res);
            }
          })
        })

      })
    })
  })
})
