/// <reference path='../typings/ws/ws.d.ts' />

import * as _ from 'lodash';
import * as WebSocket from 'ws';
var simplep = require('../../server/simplep');

const WS_URL = 'wss://poof4.apps.exosite.io/api/v1/ws'

let ws = new WebSocket(WS_URL)

console.log(`Connecting to ${WS_URL}`)

ws.on('open', function open() {
  console.log("Connected")
  ws.send(JSON.stringify({
    type: "authenticate",
    auth: "Bearer testAuthToken"
  }))
});

ws.on('error', function(err) {
  console.log("Error: ", err)
})

ws.on('close', function(reason) {
  console.log("Closed: ", reason)
})

ws.on('message', function(message, flags) {
  let data = JSON.parse(message)
  console.log("Message: ", message)
  if(data.authenticated) {
    let subscribeCommand = {
      type: "subscribe",
      devices: {
        '3ztd2uma3muqh0k9.2': ["moisture", "temperature", "light"]
      }
    }
    console.log("Sending subscribe command...")
    ws.send(JSON.stringify(subscribeCommand))
    return
  }
})
