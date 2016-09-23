/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/supertest/supertest.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
/// <reference path="../typings/q/Q.d.ts" />

import * as supertest from 'supertest';
import * as _ from 'lodash';
import * as Q from 'q';
import {expect} from 'chai';

import {User, UserFromAPI} from '../definitions/user';

function makeid(length: number)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function verifyUser(user) {
  // check that the users are returned with {'type':'user'} and they have an email / id
  let u = new User(user as UserFromAPI);
  return u.type === "user" && u.email.indexOf("@") > -1;
}

function createUser(server, user, done: any) {
  if(done) {
    supertest.agent(server)
    .post('/users/create')
    .send(user)
    .set('Content-Type', 'application/json')
    .expect(200, done);
  } else {
    var defer = Q.defer();
    supertest.agent(server)
    .post('/users/create')
    .send(user)
    .set('Content-Type', 'application/json')
    .expect(200).end(function(){
      defer.resolve(true);
    })
    return defer.promise;
  }
}

function deleteUser(server, user, done: any) {
  if(done) {
    supertest.agent(server)
    .post('/users/delete')
    .send(user)
    .set('Content-Type', 'application/json')
    .expect(200, done);
  } else {
    var defer = Q.defer();
    supertest.agent(server)
    .post('/users/delete')
    .send(user)
    .set('Content-Type', 'application/json')
    .expect(200).end(function(){
      defer.resolve(true);
    })
    return defer.promise;
  }
}

function makeUser() {
  return {
    email: makeid(40)+"@example.com",
    name: "Test User" + makeid(10)
  }
}



describe('User API', function() {
  var server;

  beforeEach(function(done) {
    server = require('../app');
    done();
  });

  describe("User management", function() {
    it('Can create and delete a new user', function(done) {
      let user = makeUser();

      supertest.agent(server)
        .post('/users/create')
        .send(user)
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          expect(verifyUser(res.body)).to.be.true;
          let receivedUser = new User(res.body as UserFromAPI);
          expect(receivedUser.email).to.equal(user.email);
          expect(receivedUser.name).to.equal(user.name);
          supertest.agent(server)
            .post('/users/delete')
            .send(user)
            .set('Content-Type', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
        });
    });
  })

  describe("Querying users", function() {
    let users = _.map(_.range(5), makeUser);

    beforeEach(function(done) {
      Q.all(_.map(users, function(user) {
        return createUser(server, user, false)
      })).then(function() {
        done();
      });
    })

    afterEach(function(done) {
      Q.all(_.map(users, function(user) {
        return deleteUser(server, user, false)
      })).then(function() {
        done();
      });
    })

    it('responds to /users w/ a 200', function(done) {
      supertest.agent(server)
        .get('/users')
        .expect(200, done);
    });

    it('responds to /users w/ a list of users', function(done) {
      supertest.agent(server)
        .get('/users')
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          // check that the users are returned with {'type':'user'} and they have an email / id
          expect(_.every(_.map(res.body.results, verifyUser))).to.be.true;
          //expect(_.difference(users, res.body.results)).to.be.empty;
          done();
        });
    });
  });


  describe("User Key-Value", function() {
    var user;

    function setKeyOnUser(keys, done) {
      supertest.agent(server)
        .post('/users/keys')
        .send({email: user.email, keys:keys})
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
    }

    beforeEach(function(done) {
      user = makeUser();
      createUser(server, user, done)
    })

    afterEach(function(done) {
      deleteUser(server, user, done)
    })

    it('Can set a key on a user', function(done) {
      let keys = {
        'position': 'engineer',
      }

      supertest.agent(server)
        .post('/users/keys')
        .send({email: user.email, keys:keys})
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
    });

    it('Can get a key from a user', function(done) {
      let keys = {
        'position': makeid(8)
      }

      supertest.agent(server)
        .post('/users/keys')
        .send({email: user.email, keys:keys})
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          supertest.agent(server)
            .get('/users/keys')
            .query({email: user.email, keys:_.keys(keys)})
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              //console.log("Result: ", res.body, " err: ", err);
              expect(res.body.result).to.deep.equal(keys)
              done();
            })
        })
    });

    it('Can set multiple keys on a user', function(done) {
      let keys = {
        'position': makeid(5),
        'chair': makeid(10)
      }

      supertest.agent(server)
        .post('/users/keys')
        .send({email: user.email, keys:keys})
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
    });

    it('Can get multiple keys from a user', function(done) {
      let keys = {
        'position': makeid(8),
        'chair': makeid(100),
        'other': makeid(1000)
      }

      supertest.agent(server)
        .post('/users/keys')
        .send({email: user.email, keys:keys})
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          supertest.agent(server)
            .get('/users/keys')
            .query({email: user.email, keys:_.keys(keys).join(',')})
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              expect(res.body.result).to.deep.equal(keys)
              done();
            })
        })
    });
  })

});
