/// <reference path="../typings/mocha/mocha.d.ts" />
/// <reference path="../typings/supertest/supertest.d.ts" />
/// <reference path="../typings/chai/chai.d.ts" />
/// <reference path="../typings/lodash/lodash.d.ts" />

import * as supertest from 'supertest';
import * as _ from 'lodash';
import { expect } from 'chai';

let Chance = require('chance');
let chance = new Chance();

const URL = process.env["API_URL"] || "https://poof4.apps.exosite.io";
const API_TOKEN = process.env['API_TOKEN'] || 'Bearer testAuthToken';
const API_AUTHENTICATION_HEADER = 'authorization';

function finishTest(err, res, done) {
    if(err) {
        console.log("ERROR: ", err);
        console.log("RES BODY: ", res.body);
        console.log("RES ERROR: ", res.error);
        throw err;
    }
    done();
}

function verifyUser(user) {
  return _.isString(user.email) &&
         user.email.indexOf("@") > -1 &&
         _.isNumber(user.creation_date) &&
         _.isString(user.name) &&
         _.isNumber(user.status) &&
         _.isNumber(user.id);
}

describe('User API', function()  {
  beforeEach(() => {});
  afterEach(() => {});

  describe('Device Management', function() {
    describe('Device creation and deletion', function() {
      it(`an admin can create a new device`);
      it(`an admin can delete an existing device`);
    });

    describe('Device modification', function() {
      it(`an admin can grant device ownership to other users`);
      it(`an admin can modify any device's name`);
      it(`an admin can modify any device's location`);

      it(`an owner can modify any owned device's name`);
      it(`an owner can modify any owned device's location`);

      it(`non-admin owners cannot modify a device's name`);
      it(`non-admin owners cannot modify a device's location`);
    });

    describe('Device Viewing', function() {
      it(`a user can view a list of devices they have access to`);
      it(`an admin can view a list of all devices`);
    });
  });

  describe('User creation and deletion', function() {
    it(`an admin can create a new user and delete a user`, function(done) {
        this.timeout(8000);

        let createUser = function() {
            const email = chance.email();

            supertest(URL)
                .put('/api/v1/users')
                .set(API_AUTHENTICATION_HEADER, API_TOKEN)
                .set('Content-Type', 'application/json')
                .send({'name': chance.name(), 'email': email, 'password': 'siren123'})
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    if(err) {
                        console.log("createUser:: ERROR creating user with email ", email);
                        finishTest(err, res, done);
                    }
                    else {
                        console.log("createUser:: Successfully created user with email ", email);
                        getNewUserByEmail(email);
                    }
                });
        };

        /**
         * clean up - grab the list of users, find the one we just created so we can get it's ID, and then delete it by ID.
         * @param email
         */
        let getNewUserByEmail = function(email:string) {
            console.log("getNewUser:: Getting the newly created user. Have to find the User by email since we don't have the ID. email: ", email);

            let userId = -1;
            supertest(URL)
                .get('/api/v1/users')
                .set('Content-Type', 'application/json')
                .set(API_AUTHENTICATION_HEADER, API_TOKEN)
                .expect(200)
                .expect('Content-Type', /json/)
                .expect(res => {
                    userId = res.body.find(user => user.email === email).id;
                })
                .end((err, res) => {
                    if(err) {
                        console.log("getNewUser:: ERROR - Failed to find the user the user");
                        finishTest(err, res, done);
                    }
                    else {
                        deleteNewUser(userId);
                    }
                });
        };

        let deleteNewUser = function(userId: number) {
            console.log("deleteNewUser:: Deleting the user with ID: ", userId);
            supertest(URL)
                .delete(`/api/v1/users/${userId}`)
                .set('Content-Type', 'application/json')
                .set(API_AUTHENTICATION_HEADER, API_TOKEN)
                .expect(200)
                .end((err, res) => {
                    if(err) {
                        console.log("deleteNewUser:: ERROR - Failed to find the user the user");
                        finishTest(err, res, done);
                    }
                    else {
                        verifyUserWasDeleted(userId);
                    }
                });
        };

        let verifyUserWasDeleted = function(userId:number) {
            console.log("verifyUserWasDeleted:: verifying that we cannot find the user with ID: ", userId);
            supertest(URL)
                .get(`/api/v1/users/${userId}`)
                .set('Content-Type', 'application/json')
                .set(API_AUTHENTICATION_HEADER, API_TOKEN)
                .expect(404)
                .end((err, res) => {
                    console.log("verifyUserWasDeleted:: Finished!");
                    finishTest(err, res, done);
                });
        };

        //now run the test...
        createUser();
    });

    it(`when a user is deleted they are unsubscribed from reports and notifications`);
  });

  describe('User List', function() {
     it(`admins can view a list of users`, function(done){
         supertest(URL)
             .get('/api/v1/users')
             .set(API_AUTHENTICATION_HEADER, API_TOKEN)
             .expect(200)
             .expect('Content-Type', /json/)
             .expect(res => {
                 res.body.map(user => {
                     expect(verifyUser(user)).to.be.true;
                 })
             })
             .end((err, res) => {
                 finishTest(err, res, done)
             });
    });

    it(`non-admins cannot view a list of users`, function(done) {
        //issue a request without authorization header
        supertest(URL)
            .get('/api/v1/users')
            .expect(401)
            .end((err, res) => {
                finishTest(err, res, done)
            });
    });
  });

  describe('User Notifications', function() {
    it(`a user can view their device notifications`);
    it(`a user can subscribe to device notifications`);
    it(`a user can unsubscribe from device notifications`);
    it(`a user can subscribe to device notifications`);
    it(`a user can unsubscribe from device notifications`);
    it(`an admin can view all user device notifications`);
    it(`an admin can subscribe a user to device notifications`);
    it(`an admin can unsubscribe a user from device notifications`);
  });

  describe('User Device Reports', function() {
    it(`a user can view a list of device reports`);
    it(`a user can subscribe to reports for a device`);
    it(`a user can unsubscribe from reports for a device`);

    it(`an admin can view all user device reports`);
    it(`an admin can subscribe a user to device reports`);
    it(`an admin can unsubscribe a user from device reports`);
  });

  describe('User Permissions', function() {
    it(`a user can get a list of devices they have access to`);
    it(`an admin grant a user's permission to view a device`);
    it(`an admin revoke a user's permission to view a device`);
    it(`when a user has device notifications, revoking viewing permissions will remove those notifications`);
    it(`when a user has device reports, revoking viewing permissions will remove those reports`);
  });

   describe('User Roles', function() {
    it(`admins can modify user roles`);
    it(`non-admins cannot modify user roles`);
    it(`admins can view a list of all user roles (ROLES TO BE DEFINED)`);
  });
});
