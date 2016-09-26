import * as types from '../constants';

import initialState from './initialState';

const LASTTRIP_ALIAS = 'ecu';

function iconFromText(text) {
  if(angular.isUndefined(text))
    return 'icon-warning-general'

  text = text.toLowerCase()
  if(text.indexOf("temperature") > -1) {
    if(text.indexOf("over") > -1) {
      return 'icon-temperature-high'
    }
    if(text.indexOf("under") > -1) {
      return 'icon-temperature-low'
    }
  }
  if(text.indexOf("offline") > -1) {
    return 'icon-disconnected';
  }
  return 'icon-warning-general'
}

function descriptionFromECUData(ecudata) {
  if(angular.isUndefined(ecudata))
    return 'Unknown error';

  if(ecudata.red_stop_lamp_status == 1)
  {
    return "red_stop_lamp_status"
  }
  if(ecudata.amber_lamp_status == 1)
  {
    return "amber_lamp_status"
  }
  if(ecudata.malfunction_indicator_lamp_status == 1)
  {
    return "malfunction_indicator_lamp_status"
  }
  if(ecudata.protect_lamp_status == 1)
  {
    return "protect_lamp_status"
  }
}

function titleFromECUData(ecudata) {
  if(angular.isUndefined(ecudata))
    return 'Unknown error';

  if(ecudata.red_stop_lamp_status == 1)
  {
    return "Red Stop Lamp Status"
  }
  if(ecudata.amber_lamp_status == 1)
  {
    return "Amber Lamp Status"
  }
  if(ecudata.malfunction_indicator_lamp_status == 1)
  {
    return "Malfunctioin Lamp Status"
  }
  if(ecudata.protect_lamp_status == 1)
  {
    return "Protect Lamp Status"
  }
}

function subtitleFromECUData(ecudata) {
  if(angular.isUndefined(ecudata))
    return 'Unknown error';

  if(ecudata.red_stop_lamp_status == 1)
  {
    return "Critical"
  }
  if(ecudata.amber_lamp_status == 1)
  {
    return "Warning"
  }
  if(ecudata.malfunction_indicator_lamp_status == 1)
  {
    return "Warning"
  }
  if(ecudata.protect_lamp_status == 1)
  {
    return "Warning"
  }
}

function updatealertsummary(device,ecudata) {
  if(angular.isUndefined(device.red_stop_lamp_status))
  {
    device.red_stop_lamp_status = 0;
  }
  if(angular.isUndefined(device.amber_lamp_status))
  {
    device.amber_lamp_status = 0;
  }
  if(angular.isUndefined(device.protect_lamp_status))
  {
    device.protect_lamp_status = 0;
  }
  if(angular.isUndefined(device.malfunction_indicator_lamp_status))
  {
    device.malfunction_indicator_lamp_status = 0;
  }

  if(ecudata.red_stop_lamp_status == 1)
  {
     device.red_stop_lamp_status = device.red_stop_lamp_status + 1;
  }
  if(ecudata.amber_lamp_status == 1)
  {
    device.amber_lamp_status = device.amber_lamp_status + 1;
  }
  if(ecudata.malfunction_indicator_lamp_status == 1)
  {
    device.malfunction_indicator_lamp_status = device.malfunction_indicator_lamp_status + 1;
  }
  if(ecudata.protect_lamp_status == 1)
  {
    device.protect_lamp_status = device.protect_lamp_status + 1;
  }
}

function reducelasttripdata(device, data) {
  console.log("reducelasttrupdata",device,data);
  var ecu_data = data.value.replace(/\'/g, '\"');
  ecu_data = JSON.parse(ecu_data);
  return {data: ecu_data, timestamp: data.timestamp};
}


function getEngineHours(ecudataCollection)
{
   var firstecudata = ecudataCollection[0];
   var lastecudata = ecudataCollection[ecudataCollection.length - 1];

   return lastecudata.data.engine_hours - firstecudata.data.engine_hours;
}

function getMilesDriven(ecudataCollection)
{

}

function getTotalGasUsed(ecudataCollection)
{

}

function getDGEHours(ecudataCollection)
{

}

function reduceLastTripFromDevice(device) {
  console.log("reducelasttripdata 1");
  if(device.data[LASTTRIP_ALIAS]) {

    var ecudataCollection = device.data[LASTTRIP_ALIAS].map(data => reducelasttripdata(device, data))
  
    return{
      enginehours: getEngineHours(ecudataCollection),
      milesdriven: 0,
      faultcode: 0,
      dge_hr: 0,
      totalgasused: 0
    }
      /*return device.data[LASTTRIP_ALIAS].filter(function(data){
          var ecu_data = data.value.replace(/\'/g, '\"');
          ecu_data = JSON.parse(ecu_data);
          console.log("reducelasttripdata 2",ecu_data);
          if(ecu_data.red_stop_lamp_status == 1 || ecu_data.amber_lamp_status == 1 || ecu_data.protect_lamp_status == 1 ||ecu_data.malfunction_indicator_lamp_status == 1)
          {  
            return ecu_data
          }
        }).map(data => reducelasttripdata(device, data))*/
  } else {
    console.warn("Device ", device.name, " has no alias for last trip -", LASTTRIP_ALIAS);
    return [];
  }
}

function lasttripReducer(state=initialState.lasttrip, action) {
  switch (action.type) {
    case types.RECEIVE_DEVICES_LASTTRIP:
      return [].concat(...action.devices.map(device => reduceLastTripFromDevice(device)))
    case types.RECEIVE_DEVICE_LASTTRIP:
      return reduceLastTripFromDevice(action.device);
    case types.WEBSOCKET_LIVE_DATA:
      if(action.alias === LASTTRIP_ALIAS) {
        let newAlarm = reducelasttripdata(action.device, action.data)
        return state.concat(newAlarm);
      } else {
        return state
      }
    default:
      return state;
  }
}

export { lasttripReducer }