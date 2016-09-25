import * as types from '../constants';

import initialState from './initialState';

function reduceDevice(device) {

console.log("reducedevice", device);
//////////////////////////Extract Temperature
var temperatureArray= [];
if(device.data.raw_data)
{
  for(var i=0;i<device.data.raw_data.length;i++){
    temperatureArray.push(
      {value : device.data.raw_data[i].temperature,
        timestamp : device.data.raw_data[i].ts
      });
  }
  device.data.temperature = temperatureArray;
}
//////////////////////////////////////////////////
//////////////////////////Extract current
var currentArray= [];
if(device.data.raw_data)
{
  for(var i=0;i<device.data.raw_data.length;i++){
    currentArray.push(
      {value : device.data.raw_data[i].current,
        timestamp : device.data.raw_data[i].ts
      });
  }
  device.data.current = currentArray;
}
//////////////////////////////////////////////////
//////////////////////////Extract power
var powerArray= [];
if(device.data.raw_data)
{
  for(var i=0;i<device.data.raw_data.length;i++){
    powerArray.push(
      {
        value : device.data.raw_data[i].power,
        timestamp : device.data.raw_data[i].ts
      });
  }
  device.data.power = powerArray;
}
// console.log("reducedevice after", device);
//////////////////////////////////////////////////
  device.lastReported = _.max(_.map(device.data, (data, alias) => {
    if(data.length) {
      return data[data.length-1].ts
    }
  })) || 0;
  device.icon = "icon-device"

  return device
}

function deviceReducer(state=initialState.devices, action) {
  switch (action.type) {
  case types.RECEIVE_DEVICES:
  
  // console.log("types.RECEIVE_DEVICES");
    return action.devices.map(device => reduceDevice(device))
  case types.RECEIVE_DEVICE:
  
  // console.log("types.RECEIVE_DEVICE");
    // if our initial state has devices, then replace the device
    // otherwise return an array with just the device received
    if(state.length > 0) {
      return state.map(device => {
        if(device.rid === action.device.rid) {
          // turn the new device we have into a reduced device
          return reduceDevice(device)
        } else {
          return device
        }
      })
    } else {
      return [reduceDevice(action.device)];
    }
  case types.RECEIVE_READ_DEVICE:
  // console.log("types.RECEIVE_READ_DEVICE");
      return state.map(device => {
        if(device.rid === action.device.rid) {
          return Object.assign({}, device, action.device);
        }
        else {
          return device;
        }
      });
  case types.WEBSOCKET_LIVE_DATA:
    // console.log("types.WEBSOCKET_LIVE_DATA");
    // push data onto the right alias when we have new data
    // there are definite performance considerations with this as
    // the list length is currently unbounded
    // there are also concerns about what to do when historical data has been read
    // should the data be pushed, or should the dataport be 'locked' (for instance reading a trendchart)
    // until the view is unlocked?
    return state.map(device => {
      if(device.rid === action.rid) {
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
