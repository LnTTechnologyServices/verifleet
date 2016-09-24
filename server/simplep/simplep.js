/// <reference path="../typings/q/Q.d.ts"/>
/// <reference path="../typings/request-promise/request-promise.d.ts"/>
/// <reference path="../typings/moment/moment.d.ts"/>
/// <reference path="../typings/ws/ws.d.ts"/>
/// <reference path="../typings/lodash/lodash.d.ts"/>
"use strict";
var Q = require('q');
var request = require('request-promise');
var moment = require('moment');
var WebSocket = require('ws');
var _ = require('lodash');
var DEBUG = false;
var options = {
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
var exoDefer = function (auth) {
    if (!auth) {
        throw ("No auth supplied! give '$CIK' or {'cik': $CIK} or {'cik': $CIK, 'client_id': $RID}");
    }
    if (typeof auth === "string") {
        auth = { cik: auth };
    }
    this.auth = auth;
    this.calls = [];
};
exports.exoDefer = exoDefer;
exoDefer.prototype.read = function (alias, options) {
    if (!options) {
        options = {};
    }
    var call = { id: this.calls.length, 'procedure': 'read', 'arguments': [{ 'alias': alias }, options] };
    this.calls.push(call);
    return this;
};
exoDefer.prototype.then = function (callback, error_callback) {
    return this.call().then(callback, error_callback);
};
exoDefer.prototype.info = function (options) {
    if (!options) {
        options = {};
    }
    var call = { id: this.calls.length, 'procedure': 'info', 'arguments': [{ 'alias': '' }, options] };
    this.calls.push(call);
    return this;
};
exoDefer.prototype.prepareCall = function () {
    var bo = options;
    bo['body'] = {
        auth: this.auth,
        calls: this.calls
    };
    if (DEBUG) {
        console.log("(SIMPLEP)[RPC DEFER DEBUG CALL] ", JSON.stringify(bo['body']));
    }
    return bo;
};
exoDefer.prototype.call = function (promise) {
    return request(this.prepareCall());
};
var exo = {
    call: function (auth, call) {
        if (typeof auth === "string") {
            auth = { "cik": auth };
        }
        var bo = options;
        call['id'] = 0;
        bo['body'] = {
            auth: auth,
            calls: [call]
        };
        if (DEBUG) {
            console.log("(SIMPLEP)[RPC DEBUG CALL] ", JSON.stringify(bo['body']));
        }
        return request(bo).then(function (result) {
            if (DEBUG) {
                console.log("(SIMPLEP)[RPC DEBUG RESULT]: ", result);
            }
            return result[0];
        }).catch(function (error) {
            console.log("(SIMPLEP ERROR) ", error);
            throw error;
        });
    },
    read: function (auth, alias, options) {
        if (!options)
            options = {};
        var call = { id: 0, 'procedure': 'read', 'arguments': [{ 'alias': alias }, options] };
        return this.call(auth, call);
    },
    info: function (auth, item, options) {
        if (!item)
            item = { "alias": "" };
        if (!options)
            options = {};
        var call = { 'procedure': 'info', 'arguments': [item, options] };
        return this.call(auth, call);
    },
    write: function (auth, alias, payload) {
        if (typeof payload === "object") {
            payload = JSON.stringify(payload);
        }
        var call = { 'procedure': 'write', 'arguments': [{ 'alias': alias }, payload, {}] };
        return this.call(auth, call).then(function (result) {
            //console.log("Write result: ", result)
            return result;
        }, function (error) {
            console.log("Error writing: ", error);
            return error;
        });
    },
    createDevice: function (auth, device) {
        var t = this;
        // {"procedure": "create", "arguments": ["client", {"name": "test", "limits": {"http": "inherit", "dataport": "inherit", "share": "inherit", "dispatch": "inherit", "datarule": "inherit", "disk": "inherit", "sms": "inherit", "email_bucket": "inherit", "client": "inherit", "xmpp": "inherit", "xmpp_bucket": "inherit", "sms_bucket": "inherit", "email": "inherit", "http_bucket": "inherit"}}]}]
        var meta = JSON.stringify({ "device": { "model": device.model, "sn": device.sn, "vendor": device.vendor, "type": "vendor" } });
        var call = { 'procedure': 'create', 'arguments': ['client', { 'name': device.name, 'meta': meta, 'limits': { 'http': 'inherit', 'dataport': 'inherit', 'share': 'inherit', 'dispatch': 'inherit', 'datarule': 'inherit', 'disk': 'inherit', 'sms': 'inherit', 'email_bucket': 'inherit', 'client': 'inherit', 'xmpp': 'inherit', 'xmpp_bucket': 'inherit', 'sms_bucket': 'inherit', 'email': 'inherit', 'http_bucket': 'inherit' } }] };
        console.log("Using meta: ", meta);
        return this.call(auth, call).then(function (res) {
            //console.log("Create device result: ", res);
            var rid = res.result;
            return t.info(auth, rid, { "key": true }).then(function (infoRes) {
                //console.log("Info result: ", infoRes)
                device['cik'] = infoRes.result.key;
                device['rid'] = res.result;
                return device;
            });
        });
    },
    create: function (auth, name, type, format) {
        var t = this;
        var call = { 'procedure': 'create', 'arguments': [type, { "retention": { "count": "infinity", "duration": "infinity" }, "name": name, "format": format }] };
        return this.call(auth, call).then(function (res) {
            if (res.status === "ok") {
                return t.map(auth, res.result, name);
            }
        }).catch(function (err) {
            console.log("error creating ", type, " error: ", err);
            throw err;
        });
    },
    drop: function (auth, rid) {
        var t = this;
        var call = { 'procedure': 'drop', 'arguments': [rid] };
        return this.call(auth, call);
    },
    map: function (auth, rid, alias) {
        var call = { 'procedure': 'map', 'arguments': ["alias", rid, alias] };
        return this.call(auth, call);
    },
    update: function (auth, rid, meta) {
        var call = { 'procedure': 'update', 'arguments': [rid, { "description": { "meta": JSON.stringify(meta) } }] };
        return this.call(auth, call);
    },
    wait: function (auth, alias, timestamp) {
        if (!timestamp) {
            timestamp = moment().unix();
        }
        var call = { 'procedure': 'wait', 'arguments': [{ alias: alias }, { timeout: 90000, since: timestamp }] };
        return this.call(auth, call);
    },
    listing: function (auth, type) {
        if (!type) {
            type = ["client"];
        }
        var call = { 'procedure': 'listing', 'arguments': [{ 'alias': '' }, type, { 'owned': true }] };
        return this.call(auth, call);
    },
    children: function (auth, recurse) {
        if (!recurse) {
            recurse = false;
        }
        var t = this;
    }
};
exports.exo = exo;
var aliasId = 0;
function getAliasId() {
    aliasId += 1;
    return aliasId;
}
var exoWs = function (authorization) {
    if (!authorization) {
        throw ("No auth supplied! give '$CIK' or {'cik': $CIK} or {'cik': $CIK, 'client_id': $RID}");
    }
    var t = this;
    t._opened = false;
    t.calls = [];
    if (typeof authorization === "string") {
        authorization = { cik: authorization };
    }
    this.orig_auth = authorization;
    this.auth = { auth: authorization };
    this.ws = new WebSocket('wss://m2.exosite.com/ws');
    this.ws.on("open", function () {
        t.ws.send(JSON.stringify(t.auth));
    });
    this.messageCallback = function () { };
    this.errorCallback = function () { };
    this.ws.on("message", function (json_data, flags) {
        if (!t._opened) {
            t._opened = true;
        }
        var orig_data = JSON.parse(json_data);
        var data = orig_data[0];
        if (data) {
            if (data.status === "ok") {
                if (data.result) {
                    var valueRaw = data.result[1];
                    var timestamp = data.result[0] * 1000;
                    var mapping = _.find(t.calls, { "id": data.id });
                    var value = {};
                    if (typeof valueRaw === "string") {
                        try {
                            var val = JSON.parse(valueRaw);
                            try {
                                var parsed = parseFloat(val);
                                if (isNaN(parsed)) {
                                    value = val;
                                }
                                else {
                                    value = { timestamp: timestamp, value: parsed };
                                }
                            }
                            catch (e) {
                                value = val;
                            }
                        }
                        catch (e) {
                            console.log("not json: ", e);
                            value = { 'value': parseFloat(valueRaw), 'timestamp': timestamp };
                        }
                    }
                    else {
                        value = { 'value': parseFloat(valueRaw), 'timestamp': timestamp };
                    }
                    if (!value['timestamp']) {
                        value['timestamp'] = timestamp;
                    }
                    //console.log("Value: ", JSON.stringify(value));
                    if (mapping && mapping.alias && mapping.rid) {
                        var payload = { 'data': value, 'alias': mapping.alias, 'rid': mapping.rid || this.orig_auth };
                        t.messageCallback(payload);
                    }
                    else {
                        console.log("No mapping for data - this shouldn't happen! ", mapping, valueRaw);
                    }
                }
                else {
                }
            }
            else {
                console.log("ERROR w/ WS: ", data);
                t.errorCallback(data);
            }
        }
        else {
        }
    });
};
exports.exoWs = exoWs;
exoWs.prototype.connected = function () {
    var t = this;
    var connectedPromise = Q.defer();
    var checkConnection = function () {
        if (t._opened) {
            connectedPromise.resolve(true);
        }
        else {
            setTimeout(checkConnection, 10);
            return;
        }
    };
    setTimeout(checkConnection);
    return connectedPromise.promise;
};
exoWs.prototype.on = function (callback) {
    this.messageCallback = callback;
};
exoWs.prototype.error = function (callback) {
    this.errorCallback = callback;
};
exoWs.prototype.send = function (call) {
    var t = this;
    t.connected().then(function () {
        t.ws.send(JSON.stringify(call));
    });
};
exoWs.prototype.subscribe = function (alias, options) {
    if (!options) {
        options = {
            since: Math.floor(Date.now() / 1000)
        };
    }
    alias['id'] = getAliasId();
    var call = { calls: [{ id: alias['id'], 'procedure': 'subscribe', 'arguments': [alias, options] }] };
    this.calls.push(alias);
    this.send(call);
};
exoWs.prototype.unsubscribe = function (alias) {
    var t = this;
    _.remove(this.calls, function (call) {
        if (call['rid'] === alias.rid && call['alias'] === alias.alias) {
            // found the subscription, use the id
            var unSubCall = { calls: [{ id: 0, 'procedure': 'unsubscribe', 'arguments': [alias, { "subs_id": call['id'] }] }] };
            t.send(unSubCall);
            return true;
        }
        return false;
    });
};
//# sourceMappingURL=simplep.js.map