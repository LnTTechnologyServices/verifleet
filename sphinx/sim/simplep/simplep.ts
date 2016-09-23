/// <reference path="../typings/q/Q.d.ts"/>
/// <reference path="../typings/request-promise/request-promise.d.ts"/>
/// <reference path="../typings/moment/moment.d.ts"/>
/// <reference path="../typings/ws/ws.d.ts"/>
/// <reference path="../typings/lodash/lodash.d.ts"/>

import * as Q from 'q';
import * as request from 'request-promise';
import * as moment from 'moment';
import * as WebSocket from 'ws';
import * as _ from 'lodash';

import {CreateDevice, DeleteDevice, Dataports, ReadOptions, Datapoint} from '../definitions/device_actions';

let DEBUG = false

let options = {
    uri: 'https://m2.exosite.com/onep:v1/rpc/process',
    method: 'POST',
    headers: {
        'User-Agent': 'SimpleP',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json; charset=utf-8',
        'Accept-Encoding': 'gzip, deflate'
    },
    json: true
};

interface RPCCall {
  id: number,
  procedure: string,
  arguments: any
}

interface RPCFullCall {
  auth: Object,
  calls: RPCCall[]
}

interface Auth {
  cik: string,
  client_id?: string
}

interface WSAuth {
  auth: Auth
}



type TypeEnum = "dataport" | "datarule" | "client"
type FormatEnum = "string" | "float" | "integer"

let exoDefer = function(auth: (Auth|string)) {
  if(!auth) {
    throw ("No auth supplied! give '$CIK' or {'cik': $CIK} or {'cik': $CIK, 'client_id': $RID}")
  }
  if(typeof auth === "string") {
    auth = {cik: auth} as Auth
  }
  this.auth = auth
  this.calls = [];
}

exoDefer.prototype.read = function(alias: string, options: ReadOptions) {
  if(!options) {
    options = {} as ReadOptions
  }
  let call = {id: this.calls.length, 'procedure': 'read', 'arguments': [{'alias': alias}, options]}
  this.calls.push(call as RPCCall)
  return this
}

exoDefer.prototype.then = function(callback, error_callback) {
  return this.call().then(callback, error_callback)
}

exoDefer.prototype.info = function(options?: Object) {
  if(!options) {
    options = {}
  }
  let call = {id: this.calls.length, 'procedure': 'info', 'arguments': [{'alias': ''}, options]}
  this.calls.push(call as RPCCall)
  return this
}

exoDefer.prototype.prepareCall = function() {
  let bo = options
  bo['body'] = {
    auth: this.auth,
    calls: this.calls
  } as RPCFullCall

  if(DEBUG) {
    console.log("(SIMPLEP)[RPC DEFER DEBUG CALL] ", JSON.stringify(bo['body']))
  }

  return bo
}

exoDefer.prototype.call = function(promise) {
  return request(this.prepareCall())
}

let exo = {
  call: function(auth: (Auth|string), call: RPCCall) {
    if(typeof auth === "string") {
      auth = {"cik": auth} as Auth
    }

    let bo = options
    call['id'] = 0
    bo['body'] = {
      auth: auth,
      calls: [call]
    } as RPCFullCall

    if(DEBUG) {
      console.log("(SIMPLEP)[RPC DEBUG CALL] ", JSON.stringify(bo['body']))
    }

    return request(bo).then(function(result) {
      if(DEBUG) {
        console.log("(SIMPLEP)[RPC DEBUG RESULT]: ", result)
      }
      return result[0]
    }).catch(function(error) {
      console.log("(SIMPLEP ERROR) ", error)
      throw error
    });
  },

  read: function(auth: (string|Object), alias: string, options?: ReadOptions) {
    if(!options) options = {}

    let call = {id: 0, 'procedure': 'read', 'arguments': [{'alias': alias}, options]}
    return this.call(auth, call)
  },

  info: function(auth: (string|Object), item?: (string|Object), options?: Object) {
    if(!item) item = {"alias":""}
    if(!options) options = {}

    let call = {'procedure': 'info', 'arguments': [item, options]}
    return this.call(auth, call)
  },

  write: function(auth: (string|Object), alias: string, payload: any) {
    if(typeof payload === "object") {
      payload = JSON.stringify(payload);
    }
    let call = {'procedure': 'write', 'arguments': [{'alias': alias}, payload, {}]}
    return this.call(auth, call).then(function(result) {
      //console.log("Write result: ", result)
      return result
    }, function(error) {
      console.log("Error writing: ", error)
      return error
    })
  },

  createDevice: function(auth: (string|Object), device: CreateDevice) {
    let t = this;

    // {"procedure": "create", "arguments": ["client", {"name": "test", "limits": {"http": "inherit", "dataport": "inherit", "share": "inherit", "dispatch": "inherit", "datarule": "inherit", "disk": "inherit", "sms": "inherit", "email_bucket": "inherit", "client": "inherit", "xmpp": "inherit", "xmpp_bucket": "inherit", "sms_bucket": "inherit", "email": "inherit", "http_bucket": "inherit"}}]}]
    let meta = JSON.stringify({"device":{"model":device.model, "sn": device.sn, "vendor": device.vendor, "type": "vendor"}})
    let call = {'procedure': 'create', 'arguments': ['client', {'name': device.name, 'meta': meta, 'limits': {'http': 'inherit', 'dataport': 'inherit', 'share': 'inherit', 'dispatch': 'inherit', 'datarule': 'inherit', 'disk': 'inherit', 'sms': 'inherit', 'email_bucket': 'inherit', 'client': 'inherit', 'xmpp': 'inherit', 'xmpp_bucket': 'inherit', 'sms_bucket': 'inherit', 'email': 'inherit', 'http_bucket': 'inherit'}}]}
    console.log("Using meta: ", meta)
    return this.call(auth, call).then(function(res) {
      //console.log("Create device result: ", res);
      let rid = res.result;
      return t.info(auth, rid, {"key": true}).then(function(infoRes) {
        //console.log("Info result: ", infoRes)
        device['cik'] = infoRes.result.key;
        device['rid'] = res.result;
        return device
      })
    })
  },

  create: function(auth: (string|Object), name: string, type: TypeEnum, format: FormatEnum) {
    let t = this;
    let call = {'procedure': 'create', 'arguments': [type, {"retention": {"count": "infinity", "duration": "infinity"}, "name": name, "format": format}]}
    return this.call(auth, call).then(function(res) {
      if(res.status === "ok") {
        return t.map(auth, res.result, name)
      }
    }).catch(function(err) {
      console.log("error creating ", type, " error: ", err)
      throw err
    })
  },

  drop: function(auth: (string|Object), rid: string) {
    let t = this;
    let call = {'procedure': 'drop', 'arguments': [rid]}
    return this.call(auth, call)
  },

  map: function(auth: (string|Object), rid: string, alias: string) {
    let call = {'procedure': 'map', 'arguments': ["alias", rid, alias]}
    return this.call(auth, call)
  },

  update: function(auth: (string|Object), rid: string, meta: Object) {
    let call = {'procedure': 'update', 'arguments': [rid, {"description":{"meta":JSON.stringify(meta)}}]}
    return this.call(auth, call)
  },

  wait: function(auth: (string|Object), alias: (string|string[]), timestamp?: number) {
    if(!timestamp) {
      timestamp = moment().unix()
    }
    let call = {'procedure': 'wait', 'arguments':[{alias:alias}, {timeout:90000, since:timestamp}]}
    return this.call(auth, call)
  },

  listing: function(auth: (string|Object), type?: (string|string[])) {
    if(!type) {
      type = ["client"]
    }

    let call = {'procedure': 'listing', 'arguments':[{'alias':''}, type, {'owned':true}]}
    return this.call(auth, call);
  },

  children: function(auth: (string|Object), recurse?: boolean) {
    if(!recurse) {
      recurse = false
    }
    let t = this;
  }
}

interface AliasObject {
  alias: string,
  rid?: string,
  id?: number
}

interface SubscribeOptions {
  since: number // unix timestamp to start listening
  timeout: (number|string) // milliseconds
  subs_id?: (number|string) // id for subscription
}

let aliasId = 0;
function getAliasId() {
  aliasId += 1;
  return aliasId;
}

let exoWs = function(authorization: (Auth|string)) {

  if(!authorization) {
    throw ("No auth supplied! give '$CIK' or {'cik': $CIK} or {'cik': $CIK, 'client_id': $RID}")
  }

  let t = this;
  t._opened = false;
  t.calls = [];

  if(typeof authorization === "string") {
    authorization = {cik: authorization} as Auth
  }

  this.orig_auth = authorization
  this.auth = {auth: authorization} as WSAuth;

  this.ws = new WebSocket('wss://m2.exosite.com/ws');

  this.ws.on("open", function() {
    t.ws.send(JSON.stringify(t.auth));
  })

  this.messageCallback = function(){}
  this.errorCallback = function(){}

  this.ws.on("message", function(json_data, flags) {
    if(!t._opened) {
      t._opened = true;
    }

    let orig_data = JSON.parse(json_data);
    let data = orig_data[0];

    if(data) {
      if(data.status === "ok") {
        if(data.result) {
          let valueRaw = data.result[1];
          let timestamp = data.result[0]*1000;
          let mapping = _.find(t.calls, {"id":data.id}) as AliasObject;
          let value = {};
          if(typeof valueRaw === "string") {
            try {
              let val = JSON.parse(valueRaw);
              try {
                let parsed = parseFloat(val);
                if(isNaN(parsed)) {
                  value = val;
                } else {
                  value = {timestamp: timestamp, value: parsed}
                }
              } catch(e) {
                value = val;
              }
            } catch(e) {
              console.log("not json: ", e);
              value = {'value': parseFloat(valueRaw), 'timestamp': timestamp};
            }
          } else {
            value = {'value': parseFloat(valueRaw), 'timestamp': timestamp};
          }
          if(!value['timestamp']) {
            value['timestamp'] = timestamp;
          }
          //console.log("Value: ", JSON.stringify(value));
          if(mapping && mapping.alias && mapping.rid) {
            let payload = {'data': value as Datapoint, 'alias': mapping.alias, 'rid': mapping.rid || this.orig_auth}
            t.messageCallback(payload)
          } else {
            console.log("No mapping for data - this shouldn't happen! ", mapping, valueRaw)
          }
        } else {
        }
      } else {
        console.log("ERROR w/ WS: ", data);
        t.errorCallback(data);
      }
    } else {
      // connection successful message
      //console.log("Connected: ", orig_data);
    }
  })
}

exoWs.prototype.connected = function() {
  let t = this;
  let connectedPromise = Q.defer();
  let checkConnection = function() {
    if(t._opened) {
      connectedPromise.resolve(true);
    } else {
      setTimeout(checkConnection, 10);
      return
    }
  }
  setTimeout(checkConnection)
  return connectedPromise.promise
}

exoWs.prototype.on = function(callback: Function) {
  this.messageCallback = callback
}

exoWs.prototype.error = function(callback: Function) {
  this.errorCallback = callback
}

exoWs.prototype.send = function(call: Object) {
  let t = this;
  t.connected().then(function() {
    t.ws.send(JSON.stringify(call))
  })
}

exoWs.prototype.subscribe = function(alias: AliasObject, options: ReadOptions) {
  if(!options) {
    options = {
      since: Math.floor(Date.now() / 1000),
    } as SubscribeOptions
  }
  alias['id'] = getAliasId()
  let call = {calls:[{id: alias['id'], 'procedure': 'subscribe', 'arguments': [alias, options]}]}

  this.calls.push(alias);
  this.send(call)
}

exoWs.prototype.unsubscribe = function(alias: AliasObject) {
  let t = this;
  _.remove(this.calls, function(call) {
    if(call['rid'] === alias.rid && call['alias'] === alias.alias) {
      // found the subscription, use the id
      let unSubCall = {calls:[{id: 0, 'procedure': 'unsubscribe', 'arguments': [alias, {"subs_id":call['id']}]}]}
      t.send(unSubCall);
      return true;
    }
    return false;
  })
}

export {exo, exoDefer, exoWs};
