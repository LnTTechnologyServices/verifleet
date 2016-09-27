import * as types from './constants';

function websocketShouldConnect(shouldConnect) {
    return {
        type: types.WEBSOCKET_SHOULD_CONNECT,
        shouldConnect: shouldConnect
    }
}

function websocketConnecting() {
    return {
        type: types.WEBSOCKET_CONNECTING
    }
}

function websocketConnected() {
    return {
        type: types.WEBSOCKET_CONNECTED
    }
}

function websocketLiveData(device, alias, data) {
    return {
        type: types.WEBSOCKET_LIVE_DATA,
        did: device, //.did,
        alias: alias,
        data: data,
        device: device
    }
}

function websocketDisconnected() {
    return {
        type: types.WEBSOCKET_DISCONNECTED
    }
}

// this needs to be a factory to keep the single websocket connection
// a service would create a new websocket on every instantiation
let websocket = angular.module("websocket", [])
    .factory("websocket", function(store, $timeout, $ngRedux, $state) {
        "ngInject";

        function generateInterval(k) {
            return Math.min(30, (Math.pow(2, k) - 1)) * 1000;
        }

        let start = function(url) {
            let state = $ngRedux.getState();
            if (state.websocket.shouldConnect) {
                url = "wss://m2.exosite.com/ws";
                console.log("starting websocket, connecting to ", url);
                $ngRedux.dispatch(websocketConnecting());
                var socket;
                s.socket = new WebSocket(url);

                s.socket.onopen = function() {
                    console.log("Opened websocket... sending auth");
                    let token = store.get("token")
                    if (token) {
                        console.log("sending auth to authenticate w/ ws server");
                        // let auth = `Bearer ${token}`
                        s.socketSend({
                            type: "authenticate",
                            auth: {}
                        }, "auth");
                    } else {
                        //$ngRedux.dispatch(websocketInvalidAuth());
                        $state.go("login");
                    }
                }

                s.socket.onclose = function(close) {
                    console.log("Websocket has been closed! ", close)
                    $ngRedux.dispatch(websocketDisconnected());
                    state = $ngRedux.getState();
                    let timeout = generateInterval(state.websocket.attempts);
                    console.log("Waiting for ", timeout, "s before trying again")
                    $timeout(function() {
                        s.start(url);
                    }, timeout)
                }

                s.socket.onerror = function(err) {
                    console.log("An error has occurred ", err)
                }

                s.socket.onmessage = function(message) {
                    console.log("new message on socket: ", message.data)
                    var response;
                    try {
                        response = JSON.parse(message.data);
                        console.log("new message on socket: ", response.status);
                        if (!Array.isArray(response)) {
                            if (response.status == "ok") {
                                console.log("[WS] Authenticated properly")
                                $ngRedux.dispatch(websocketConnected())
                                console.log("new message on socket: Send SUB" + JSON.stringify(state.subscriptions));
                                // _.each(state.subscriptions, function(aliases, rid) {

                                s.socketSend(JSON.stringify({
                                    "calls": [{
                                        "id": 121,
                                        "procedure": "subscribe",
                                        "arguments": [
                                            "82f1be9e4acc43070b1487e26a6fd4c9ab317e99",
                                            {
                                                "since": 1474948403,
                                                "subs_id": 10
                                            }

                                        ]
                                    }]
                                }), "SUB");
                                // s.subscribe([rid], aliases)
                            }
                        } else {
                            console.log("new message on socket: ", response[0].id);
                            console.log("Live data: ", response)
                                //switch (response[0].id) {
                                // case "auth_response":
                                //     if (response.authenticated) {
                                //         console.log("[WS] Authenticated properly")
                                //         $ngRedux.dispatch(websocketConnected())
                                //         if (state.websocket.hasConnected) {
                                //             console.log("[WS] Reconnected... subscribing to aliases again");
                                //             _.each(state.subscriptions, function(aliases, rid) {
                                //                 s.subscribe([rid], aliases)
                                //             })
                                //         }
                                //     } else {
                                //         console.log("invalid authentication for WS! Waiting for reauth by user.");
                                //         s.socket.close();
                                //         $ngRedux.dispatch(websocketDisconnected());
                                //         //$ngRedux.dispatch(websocketInvalidAuth());
                                //         $ngRedux.dispatch(websocketShouldConnect(false));
                                //     }
                                //     break;
                                // case 10:
                            console.log("Live data: ", response)
                                // console.log("Live data: ", JSON.stringify(state.devices));
                            let device = {}; //_.find($ngRedux.getState().devices, { "did": response.payload.did })
                            if (response[0].result) {
                                let datapoint = response[0].result[1]; //response.payload.data
                                let timestamp = response[0].result[0]; //response.payload.data
                                if (typeof datapoint == "string") {
                                    try {
                                        datapoint = {
                                            value: parseFloat(datapoint),
                                            ts: timestamp
                                        }
                                    } catch (e) {
                                        datapoint = {
                                            value: datapoint,
                                            ts: timestamp
                                        }
                                    }
                                } else {
                                    if (datapoint && datapoint.ts === "undefined") {
                                        datapoint.ts = response.payload.timestamp
                                    }
                                }
                                console.log("Live data: result" + datapoint);
                                $ngRedux.dispatch(websocketLiveData(device, response[0].id, datapoint));
                            }
                            //      break;
                            // }
                        }
                    } catch (e) {
                        console.log("Cannot parse JSON message: ", message.data, " err: ", e)
                        return;
                    }
                }
            }
        }

        var s = {
            start: start,
            socket: false,
            socketSend: function(payload, type) {
                let state = $ngRedux.getState();
                // if (state.websocket.connected) {
                if (type == "auth") {
                    s.socket.send(JSON.stringify({
                        "auth": {
                            "cik": "3969f69aacd17ec2819980c42774ceb216902a4a"
                        }
                    }));
                } else
                    s.socket.send(payload);
                // } else {
                //     console.warn("attempting to send message without websocket connection / authentication! ", payload)
                // }
            },
            subscribe: function(devices) {
                let s = this;
                let payload = {
                    // type: "subscribe",
                    "calls": []
                }
                console.log("socket");
                console.log(devices); //TODO
                if (_.isArray(devices)) {
                    _.each(devices, (device) => {
                        payload.calls.push({
                            "id": 121, // +1
                            "procedure": "subscribe",
                            "arguments": [
                                "82f1be9e4acc43070b1487e26a6fd4c9ab317e99", //TODO
                                {
                                    "since": 1474948403,
                                    "subs_id": 10 // +1
                                }

                            ]
                        });;
                        // payload.devices[device.did] = _.keys(device.data)
                    })
                }
                // } else if (devices.did !== undefined) {
                //     payload.devices[devices.did] = _.keys(devices.data)
                // }
                // console.log("Subscribing w/ payload: ", payload)
                // this.socketSend(payload) //TODO  - enable
            },
            unsubscribe: function(rids, aliases) {
                let s = this;
                //s.socketSend({type: "unsubscribe", rids: rids, aliases: aliases})
            },
            shouldConnect: websocketShouldConnect
        }
        return s
    })

export default websocket;