import * as types from '../constants';

import initialState from './initialState';

const ALARM_ALIAS = 'alarm_log';

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


function reduceAlarmFromData(device, data) {
  // console.log(JSON.stringify(data));
  return {
    status: data.status,
    title: data.name,
    description: data.description,
    subtitle: device.name,
    timestamp: data.ts,
    icon: iconFromText(data.text),
    pid: device.pid,
    did: device.sn,
    type: 'alarm'
  }
}

function reduceAlarmFromDevice(device) {
  // console.log(JSON.stringify(device));
  if(device.data[ALARM_ALIAS]) {
    return device.data[ALARM_ALIAS].map(data => reduceAlarmFromData(device, data))
  } else {
    console.warn("Device ", device.name, " has no alias for alarms -", ALARM_ALIAS);
    return [];
  }
}

function alarmReducer(state=initialState.alarms, action) {
  switch (action.type) {
    case types.RECEIVE_DEVICES:
      return [].concat(...action.devices.map(device => reduceAlarmFromDevice(device)))
    case types.RECEIVE_DEVICE:
      return reduceAlarmFromDevice(action.device);
    case types.WEBSOCKET_LIVE_DATA:
      if(action.alias === ALARM_ALIAS) {
        let newAlarm = reduceAlarmFromData(action.device, action.data)
        return state.concat(newAlarm);
      } else {
        return state
      }
    default:
      return state;
  }
}

export { alarmReducer }
