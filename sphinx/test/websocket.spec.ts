/// <reference path='../typings/mocha/mocha.d.ts' />
/// <reference path='../typings/supertest/supertest.d.ts' />
/// <reference path='../typings/chai/chai.d.ts' />
/// <reference path='../typings/lodash/lodash.d.ts' />
/// <reference path='../typings/ws/ws.d.ts' />

import * as supertest from 'supertest';
import * as _ from 'lodash';
import * as WebSocket from 'ws';
import {expect} from 'chai';

const WS_URL = process.env['WS_API_URL'] || 'wss://poof4.apps.exosite.io/api/v1/ws'
const API_TOKEN = process.env['API_TOKEN'] || 'Bearer testAuthToken'
const API_AUTHENTICATION_HEADER = 'authorization'

interface Headers {
  [key: string]: string;
}

describe('Websocket functionality', function() {
  describe('General', function() {
    this.timeout(5000)
    it(`doesnt allow connecting without an auth token`, function(done) {
      let ws = new WebSocket(WS_URL)
      ws.on('open', function open() {});
      ws.on('message', function(message, flags) {
        let data = JSON.parse(message)
        expect(data.status).to.equal("error");
        expect(data.message).to.equal("invalid auth");
        ws.close();
        done();
      })
    })
    it(`allows authenticated connections to the websocket`, function(done) {
      let headers = {
        [API_AUTHENTICATION_HEADER]: API_TOKEN
      } as Headers

      let ws = new WebSocket(WS_URL, {headers: headers})
      ws.on('open', function open() {});
      ws.on('message', function(message, flags) {
        let data = JSON.parse(message)
        expect(data.status).to.equal("ok");
        expect(data.authenticated).to.equal(true)
        done();
      });
      ws.on('error', function(err) {
        expect(err).to.be.undefined
      });
    })
    it(`returns a message indicating unknown command if an unimplemented command is sent`, function(done) {
      let headers = {
        [API_AUTHENTICATION_HEADER]: API_TOKEN
      } as Headers

      let ws = new WebSocket(WS_URL, {headers: headers})

      ws.on('open', function open() {
        ws.send(JSON.stringify({command:"notimplemented"}))
      });
      ws.on('error', function(err) {
        console.log("Error: ", err)
      })
      ws.on('message', function(message, flags) {
        //console.log("Message: ", message)
        let data = JSON.parse(message)
        if(data.authenticated) {
          return
        }
        expect(data.status).to.equal("error");
        expect(data.message).to.equal("unknown command");
        ws.close();
        done();
      })
    })
    it(`returns a message indicating no command if command not present`, function(done) {
      let headers = {
        [API_AUTHENTICATION_HEADER]: API_TOKEN
      } as Headers

      let ws = new WebSocket(WS_URL, {headers: headers})

      ws.on('open', function open() {
        ws.send(JSON.stringify({not_a_command:""}))
      });
      ws.on('error', function(err) {
        console.log("Error: ", err)
      });
      ws.on('message', function(message, flags) {
        let data = JSON.parse(message)
        if(data.authenticated) {
          return
        }
        expect(data.status).to.equal("error");
        expect(data.message).to.equal("no command given");
        ws.close();
        done();
      })
    })
  })

  describe('Device websocket API', function() {
    describe('The subscribe command', function() {
      this.timeout(5000)
      it(`responds to the subscribe command`, function(done) {
        let subscribeCommand = {
          command: "subscribe",
          devices: {
            '3ztd2uma3muqh0k9.1': ["raw_data", "alarm_log", "gps"],
            '3ztd2uma3muqh0k9.2': ["raw_data", "alarm_log", "gps"],
            '3ztd2uma3muqh0k9.3': ["raw_data", "alarm_log", "gps"]
          }
        }

        let headers = {
          [API_AUTHENTICATION_HEADER]: API_TOKEN
        } as Headers

        let ws = new WebSocket(WS_URL, {headers: headers});

        ws.on('open', function open() {});
        ws.on('error', function(err) {
          console.log("Error: ", err)
        })
        ws.on('message', function(message, flags) {
          let data = JSON.parse(message)
          if(data.authenticated) {
            ws.send(JSON.stringify(subscribeCommand))
            return
          } else {
            expect(data.subscriptions).to.deep.equal(subscribeCommand.devices)
          }
          ws.close();
          done();
        })
      })
      it(`defaults to subscribing to all data streams`)
      it(`allows subscribing to specific data streams`)
      it(`disallows allow subscribing to devices a user cannot access`)
      it(`only sends information about devices the user can access`)
      it(`sends a message when new device data is received for a subscribed device`)
    })

    describe('The unsubscribe command', function() {
      it(`responds to the unsubscribe command`)
      it(`allows datastreams to be partially unsubscribed from`)
      it(`allows datastreams to be entirely unsubscribed from`)
      it(`stops sending new device messages when the unsubscribe command is received`)
    })

    describe('Live messages', function() {
      it(`only sends information about devices the user can access`)
      it(`live messages include the rid, pid, sn, alias, timestamp, and value`)

    })
  })
})
