/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/supertest/supertest.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />

import * as supertest from 'supertest';
import * as _ from 'lodash';
import {expect} from 'chai';

import {Device, DeviceFromAPI, Dataports, Location} from '../definitions/device';

describe('loading express', function() {
  var server;

  beforeEach(function() {
    server = require('../app');
  });

  afterEach(function() {
  });

  it('404 unknown route', function(done) {
    supertest.agent(server)
      .get('/not_here')
      .end(function(err, res) {
        expect(res.status).to.equal(404);
        done();
      });
  });
});
