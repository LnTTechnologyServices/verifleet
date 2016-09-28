import * as types from '../constants';
var _ = require('lodash');
import initialState from './initialState';

function reduceDevice(device) {

console.log("reducedevice", device);

//device.lastReported = device.updated
   device.lastReported = _.max(_.map(device.data, (data, alias) => {
     if(data.length) {
       return data[data.length-1].timestamp
     }
   })) || 0;
  device.icon = "icon-device"

  return device
}

function reduceDeviceGasFilled(device) {

console.log("reduceDeviceGasFilled", device);
 if(device.data['gas_filled'])
 {
   device.gasFilled = device.data['gas_filled'];
 }
 

//device.lastReported = device.updated
   device.lastReported = _.max(_.map(device.data, (data, alias) => {
     if(data.length) {
       return data[data.length-1].timestamp
     }
   })) || 0;
  device.icon = "icon-device"

  return device
}

function reduceDeviceGasConsumed(device) {

console.log("reduceDeviceGasConsumed", device);
 if(device.data['dge'])
 {
   device.gasConsumed = device.data['dge'];
 }
 
//device.lastReported = device.updated
   device.lastReported = _.max(_.map(device.data, (data, alias) => {
     if(data.length) {
       return data[data.length-1].timestamp
     }
   })) || 0;
  device.icon = "icon-device"

  return device
}

function getDGEHours(totalGasConsumed, enginehours) {
    if(enginehours == 0)
        return 0;
        
    return totalGasConsumed / enginehours
}

function getTotalGasUsed(dgeCollection, dgeFilledCollection) {
    var initialDGE = 0;
    var latestDGE = 0;
    if (dgeCollection)
        if (dgeCollection.length > 0)
            latestDGE = dgeCollection[0];

    if (dgeCollection)
        if (dgeCollection.length > 0)
            initialDGE = dgeCollection[dgeCollection.length - 1];

    console.log('dgeCollection', dgeCollection);
    console.log('dgeFilledCollection', dgeFilledCollection);
    var totalGasFilled = 0;
    if (dgeFilledCollection) {
        for (var gasfilled in dgeFilledCollection) {
            if(dgeFilledCollection[gasfilled].timestamp >= initialDGE.timestamp && dgeFilledCollection[gasfilled].timestamp <= latestDGE.timestamp  )
            {
              console.log('gasfilled', dgeFilledCollection[gasfilled].value);
              if (dgeFilledCollection[gasfilled].value) {
                  totalGasFilled = totalGasFilled + dgeFilledCollection[gasfilled].value;
              }
            }
        }
    }
    // var totalGasFilled = dgeFilledCollection.reduce(function (sum, gasfilled) {
    //       return sum + gasfilled.value;
    //   }, 0);

    return initialDGE.value + totalGasFilled - latestDGE.value;

}

function getEngineHours(dgeCollection, ecudataCollection) {

   var initialDGE = 0;
    var latestDGE = 0;
    if (dgeCollection)
        if (dgeCollection.length > 0)
            latestDGE = dgeCollection[0];

    if (dgeCollection)
        if (dgeCollection.length > 0)
            initialDGE = dgeCollection[dgeCollection.length - 1];

    var ecudataCollectionFiltered = ecudataCollection.filter(function(ecudata) { return (ecudata.timestamp >= initialDGE.timestamp && ecudata.timestamp <= latestDGE.timestamp) })


 console.log("ecudataCollectionFiltered initialDGE", initialDGE);
 console.log("ecudataCollectionFiltered ecudataCollection", ecudataCollection);
 console.log("ecudataCollectionFiltered latestDGE", latestDGE);
 console.log("ecudataCollectionFiltered --100", ecudataCollectionFiltered);
    var lastecudata = ecudataCollectionFiltered[0];
    var firstecudata = ecudataCollectionFiltered[ecudataCollectionFiltered.length - 1];
    if (firstecudata && lastecudata)
        return lastecudata.data.engine_hours - firstecudata.data.engine_hours;
    else
        return 0;
}

function reduceecutojsoncollection(device, data) {
    console.log("reduceecutojsoncollection", device, data);
    var ecu_data = data.value.replace(/\'/g, '\"');
    ecu_data = JSON.parse(ecu_data);
    return { data: ecu_data, timestamp: data.timestamp };
}

function reduceDeviceLiveData(device) {

  console.log("reduceDeviceLiveData", device);

  var ecudataCollection = device.data['ecu'].map(data => reduceecutojsoncollection(device, data));
  var dgeCollection = device.data['dge'];
  var dgeFilledCollection = device.data['gas_filled'];

  var engineHoursResult = getEngineHours(dgeCollection, ecudataCollection);
  var totalGasConsumed = getTotalGasUsed(dgeCollection, dgeFilledCollection);
  var latestdge = dgeCollection[0];
  var latestecudata = ecudataCollection[0];

  console.log('engineHoursResult', engineHoursResult)
  console.log('totalGasConsumed', totalGasConsumed)
  console.log('latestdge', latestdge)
  console.log('latestecudata', latestecudata)

  if(!latestdge)
  {
    latestdge = {value:0, timestatmp: 0}
  }

  if(!latestecudata)
  {
    latestecudata = {data: {average_fuel_economy: 0}}
  }

  var liveDataResult = {
      dge: latestdge,
      dge_hour: Number(getDGEHours(totalGasConsumed, engineHoursResult).toFixed(2)),
      distance_empty: latestdge.value * latestecudata.data.average_fuel_economy
  };

  device.liveData = liveDataResult;
  //device.lastReported = device.
  
  device.lastReported = _.max(_.map(device.data, (data, alias) => {
     if(data.length) {
       return data[data.length-1].timestamp
     }
   })) || 0;

  device.icon = "icon-device"

  return device
}


function deviceReducer(state=initialState.devices, action) {
  switch (action.type) {
  case types.RECEIVE_DEVICES:
  case types.RECEIVE_DEVICES_LASTTRIP:
  // console.log("types.RECEIVE_DEVICES");
    return action.devices.map(device => reduceDevice(device))
  case types.RECEIVE_DEVICES_GASFILLED:
    return action.devices.map(device => reduceDeviceGasFilled(device))
 case types.RECEIVE_DEVICES_GASCONSUMED:
    return action.devices.map(device => reduceDeviceGasConsumed(device))
  case types.RECEIVE_DEVICES_LIVEDATA:
  // console.log("types.RECEIVE_DEVICES");
    return action.devices.map(device => reduceDeviceLiveData(device))
    
  case types.RECEIVE_DEVICE_GASFILLED:
  
     console.log("types.RECEIVE_DEVICE_GASFILLED", action);
    // if our initial state has devices, then replace the device
    // otherwise return an array with just the device received
    if(state.length > 0) {
      return state.map(device => {
        if(device.rid === action.device.rid) {
          // turn the new device we have into a reduced device
          return reduceDeviceGasFilled(action.device)
        } else {
          return device
        }
      })
    } else {
      return [reduceDeviceGasFilled(action.device)];
    }
  case types.RECEIVE_DEVICE_GASCONSUMED:
  
     console.log("types.RECEIVE_DEVICE_GASCONSUMED", action);
    // if our initial state has devices, then replace the device
    // otherwise return an array with just the device received
    if(state.length > 0) {
      return state.map(device => {
        if(device.rid === action.device.rid) {
          // turn the new device we have into a reduced device
          return reduceDeviceGasConsumed(action.device)
        } else {
          return device
        }
      })
    } else {
      return [reduceDeviceGasConsumed(action.device)];
    }
  case types.RECEIVE_DEVICE:
  
     console.log("types.RECEIVE_DEVICE", action.device);
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
   case types.RECEIVE_READ_DEVICE_LIVEDATA:
  // console.log("types.RECEIVE_READ_DEVICE");
      return state.map(device => {

        if(device.rid === action.device.rid) {
          var reducedDevice =  reduceDeviceLiveData(action.device);
          console.log("types.reducedDevice",reducedDevice);
          return Object.assign({}, device, reducedDevice);
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
