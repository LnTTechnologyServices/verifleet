import * as types from '../constants';

import initialState from './initialState';

function reduceDevice(device) {
  device.lastReported = _.max(_.map(device.data, (data, alias) => {
    if(data.length) {
      //console.log("Timestamp: ", data.last().ts, " alias: ", alias)
      return moment(data.last().ts)
    }
  })) || 0;
  device.icon = "icon-device"
  return device
}

function deviceReducer(state=initialState.devices, action) {
  switch (action.type) {
  case types.RECEIVE_DEVICES:
    return action.devices.map(device => reduceDevice(device))
  case types.RECEIVE_DEVICE:
    // if our initial state has devices, then replace the device
    // otherwise return an array with just the device received
    if(state.length > 0) {
      console.log("Received device")
      return state.map(device => {
        if(device.did === action.device.did) {
          // turn the new device we have into a reduced device
          return reduceDevice(action.device)
        } else {
          return device
        }
      })
    } else {
      return [reduceDevice(action.device)];
    }
  case types.RECEIVE_READ_DEVICE:
      return state.map(device => {
        if(device.did === action.device.did) {
          return Object.assign({}, device, action.device);
        }
        else {
          return device;
        }
      });
  case types.WEBSOCKET_LIVE_DATA:
    // push data onto the right alias when we have new data
    // there are definite performance considerations with this as
    // the list length is currently unbounded
    // there are also concerns about what to do when historical data has been read
    // should the data be pushed, or should the dataport be 'locked' (for instance reading a trendchart)
    // until the view is unlocked?
    //console.log("New websocket data: ", action)
    return state.map(device => {
      if(device.did === action.did) {
        device.data[action.alias].push(action.data);
        return reduceDevice(device)
      } else {
        return device
      }
    })
  default:
    return state;
  }
}

export { deviceReducer }
