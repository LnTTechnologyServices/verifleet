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
    did: device.did,
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
        console.log("starting websocket, connecting to ", url);
        $ngRedux.dispatch(websocketConnecting());

        var socket;
        s.socket = new WebSocket(url);

        s.socket.onopen = function() {
          console.log("Opened websocket... sending auth");
          if (store.get("token")) {
            console.log("sending auth to authenticate w/ ws server");
            s.socketSend({type: "authenticate", auth: "Bearer testAuthToken"})
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
          //console.log("new message on socket: ", message.data)
          var response;
          try {
            response = JSON.parse(message.data)
          } catch ( e ) {
            console.log("Cannot parse JSON message: ", message.data, " err: ", e)
            return
          }

          switch(response.type) {
            case "auth_response":
              if (response.authenticated) {
                console.log("[WS] Authenticated properly")
                $ngRedux.dispatch(websocketConnected())
                if(state.websocket.hasConnected) {
                  console.log("[WS] Reconnected... subscribing to aliases again");
                  _.each(state.subscriptions, function(aliases, rid) {
                    s.subscribe([rid], aliases)
                  })
                }
              } else {
                console.log("invalid authentication for WS! Waiting for reauth by user.");
                s.socket.close();
                $ngRedux.dispatch(websocketDisconnected());
                //$ngRedux.dispatch(websocketInvalidAuth());
                $ngRedux.dispatch(websocketShouldConnect(false));
              }
              break;
            case "live_data":
              console.log("Live data: ", response)
              let device = _.find($ngRedux.getState().devices, {"did":response.payload.did})
              let datapoint = response.payload.data
              if(typeof datapoint == "string") {
                try {
                  datapoint = {
                    value: parseFloat(datapoint),
                    ts: response.payload.timestamp
                  }
                } catch(e) {
                  datapoint = {
                    value: datapoint,
                    ts: response.payload.timestamp
                  }
                }
              } else {
                if(datapoint && datapoint.ts === "undefined") {
                  datapoint.ts = response.payload.timestamp
                }
              }
              $ngRedux.dispatch(websocketLiveData(device, response.payload.alias, datapoint));
              break;
          }
        }
      }
    }

    var s = {
      start: start,
      socket: false,
      socketSend: function(payload) {
        let state = $ngRedux.getState();
        if(state.websocket.connected || payload.type === "authenticate") {
          s.socket.send(JSON.stringify(payload))
        } else {
          console.warn("attempting to send message without websocket connection / authentication! ", payload)
        }
      },
      subscribe: function(devices) {
        let s = this;
        let payload = {
          type: "subscribe",
          devices: {}
        }
        if(_.isArray(devices)) {
          _.each(devices, (device) => {
            payload.devices[device.did] = _.keys(device.data)
          })
        } else if(devices.did !== undefined) {
          payload.devices[devices.did] = _.keys(devices.data)
        }
        console.log("Subscribing w/ payload: ", payload)
        this.socketSend(payload)
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
