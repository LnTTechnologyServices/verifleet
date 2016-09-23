import * as types from '../constants';

import initialState from './initialState';

const ALARM_ALIAS = 'alarm_log';

function iconFromText(text) {
  if(text) {
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
  }
  return 'icon-warning-general'
}

function reduceAlarmFromData(device, data) {
  return {
    title: data.name || data.text,
    status: data.status,
    subtitle: data.description || "sn: " + device.sn,
    description: data.description ? device.did : device.pid,
    timestamp: moment(data.ts).valueOf(),
    icon: iconFromText(data.text),
    did: device.did,
    type: 'alarm'
  }
}

function reduceAlarmFromDevice(device) {
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
