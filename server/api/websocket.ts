/// <reference path='../typings/jsonwebtoken/jsonwebtoken.d.ts' />
/// <reference path='../typings/q/Q.d.ts' />
/// <reference path='../typings/lodash/lodash.d.ts' />

import url = require('url')
import * as jwt from 'jsonwebtoken';
import * as Q from 'q';
import * as _ from 'lodash';

import { config } from '../config';
import { exoWs } from '../simplep'
import { getDevice } from '../common/deviceAPI';

var WebsocketServer = require('ws').Server;

let exoLive = new exoWs(config.CIK);

function getID() {
  // from http://stackoverflow.com/a/2117523/6461929
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
}

let websocketClient = function(ws) {
  let t = this;
  t.ws = ws;
  t.authorized = false;
  t.subscriptions = [];
}

websocketClient.prototype.on = function(event, cb) {
  this.ws.on(event, cb);
}

websocketClient.prototype.close = function() {
  this.ws.close();
}

websocketClient.prototype.authenticate = function(token) {
  let t = this;
  var deferred = Q.defer();
  jwt.verify(token, new Buffer(config.auth0.client_secret, 'base64'), {audience: config.auth0.client_id}, function(err, decoded) {
    if(err) {
      console.log("err decoding token! ", err);
      return
    }
    if(decoded.email) {
      console.log("user ", decoded.email, " authenticated properly.");
      t.authorized = true;
      t.send({"type": "auth_response", "status": "ok"})
    }
  });
  return deferred.promise;
}

websocketClient.prototype.send = function(payload) {
  try {
    this.ws.send(JSON.stringify(payload));
  } catch(e) {
    console.log("error sending to ws: ", e);
  }
}

websocketClient.prototype.handleMessage = function(message) {
  let t = this;
  if(!this.authorized) {
    if(message.type !== "auth") {
      console.log("sending messages without authorizing first - closing connection");
      this.close();
      return;
    } else {
      this.authenticate(message.auth);
    }
  } else {

    switch(message.type) {
      case "subscribe":
        var rid = message.rid;
        var rids = message.rids;
        var alias = message.alias;
        var aliases = message.aliases;
        // initialize client to an array of rid: [alias] pairs
        if(!wss.clientToRidAlias[t.id]) {
          wss.clientToRidAlias[t.id] = {};
        }
        // turn rids and aliases into lists for iteration if not present
        if(!rids) { rids = [rid] };
        if(!aliases) { aliases = [alias] };

        // for each RID, add the aliases for the dataports to the existing rid alias array
        _.each(rids, function(rid) {
          if(!wss.clientToRidAlias[t.id][rid]) {
            wss.clientToRidAlias[t.id][rid] = [];
          }
          wss.clientToRidAlias[t.id][rid] = _.uniq(wss.clientToRidAlias[t.id][rid].concat(aliases));
        })

        break;

      case "unsubscribe":
        // handle unsubscribing from a single device or all devices
        var rids = message.rids;
        var aliases = message.aliases;

        // if no rid is present, remove all client listening subscriptions
        if(!rids) {
          delete wss.clientToRidAlias[t.id];
        } else {
          if(rids && (!aliases || aliases.length === 0)) {
            // remove single listening device if only rid is given
            _.each(rids, function(rid) {
              delete wss.clientToRidAlias[t.id][rid];
            })
          } else {
            _.each(rids, function(rid) {
              // otherwise handle removing specific aliases from the rid array
              console.log(wss.clientToRidAlias[t.id], rid, aliases);
              let indicesToDelete = _.filter(_.map(aliases, function(alias) {
                return wss.clientToRidAlias[t.id][rid].indexOf(alias);
              }), function(idx) { return idx > -1});
              _.each(indicesToDelete, function(index) {
                wss.clientToRidAlias[t.id][rid].splice(index, 1)
              })
            })
          }
          console.log(wss.clientToRidAlias);
        }
        break;
    }
  }
}

var wss;
var clients = {};

let initWs = function(server) {
  wss = new WebsocketServer({server: server, path:'/ws'});

  wss.listeningTo = {};
  wss.clientToRidAlias = {};

  exoLive.on(function(payload) {
    let rid = payload.rid;
    let alias = payload.alias;
    _.each(wss.clientToRidAlias, function(mapping, clientId) {
      if(mapping[rid]) {
        if(mapping[rid].indexOf(alias) > -1) {
          _.each(clients, function(client, id) {
            if(id === clientId) {
              console.log("sending data to client ", payload)
              client['send']({"type":"live_data", "payload": payload});
            }
          })
        }
      }
    })
  })

  wss.listenToAllDataports = function() {
    getDevice().then(function(devices) {
      return _.map(devices, function(device) {
        device['getDataports']().then(function(dataports) {
          let rid = device['rid']
          if(!wss.listeningTo[rid]) {
            wss.listeningTo[rid] = [];
          }
          dataports = _.difference(dataports, wss.listeningTo[rid]);
          _.map(dataports, function(dataport) {
            //console.log("subscribing to: ", rid, ", ", dataport);
            exoLive.subscribe({"alias": dataport, "rid": rid})
            wss.listeningTo[rid].push(dataport);
          })
          wss.listeningTo[rid] = _.uniq(wss.listeningTo[rid]);
        })
      });
    })
  }

  wss.unlistenToAllDataports = function() {
    _.each(wss.listeningTo, function(dataports, rid) {
      _.each(dataports, function(dataport) {
        //console.log("unsubscribing from: ", dataport, rid);
        exoLive.unsubscribe({"alias": dataport, "rid": rid})
      })
    })
    wss.listeningTo = {};
  }

  wss.on('connection', function connection(ws) {
    var location = url.parse(ws.upgradeReq.url, true);
    // you might use location.query.access_token to authenticate or share sessions
    // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
    console.log("new websocket connection");
    let wsc = new websocketClient(ws);
    let id = getID();
    wsc.id = id;
    clients[id] = wsc;

    wsc.on('message', function incoming(message) {
      try {
        message = JSON.parse(message);
      } catch(e) {
        return
      }
      if(message.type !== "auth") {
        console.log('received: %s', JSON.stringify(message));
      }
      wsc.handleMessage(message)
    });

    wsc.on('close', function() {
      delete wss.clientToRidAlias[id];
      delete clients[id];
    })
  });

  // every 5 minutes, unlisten to all dataports
  // and then listen again - sometimes network events happen
  // and the subscription is lost
  setInterval(function() {
    wss.unlistenToAllDataports();
    wss.listenToAllDataports();
  }, 305000)

  // every 30 seconds check if any new dataports are available
  setInterval(function() {
    wss.listenToAllDataports();
  }, 30000)
  // and kick off the listeners right away
  wss.listenToAllDataports();
}

export {initWs}
