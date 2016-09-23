import * as types from '../constants';

import initialState from './initialState';

const ACTIVITY_ALIAS = "activity_log"

function iconFromText(text) {
  text = text.toLowerCase()
  if(text.indexOf("service") > -1 || text.indexOf("control") > -1) {
    if(text.indexOf("entered") > -1) {
      return 'icon-enter-service-mode'
    }
    if(text.indexOf("exited") > -1) {
      return 'icon-exit-service-mode'
    }
  }
  if(text.indexOf("temperature") > -1) {
    if(text.indexOf("setpoint") > -1) {
      return 'icon-change-state-vertical'
    }
  }
}

function activityFromRawData(device, data) {
  let icon = iconFromText(data.text || data.description)
  return {
    did: device.did,
    title: data.text || data.description,
    subtitle: data.user,
    timestamp: data.timestamp,
    icon: icon,
    type: 'activity'
  }
}

function activityFromDevice(device) {
  if(device.data[ACTIVITY_ALIAS]) {
    return device.data[ACTIVITY_ALIAS].map(data => activityFromRawData(device, data))
  } else {
    console.warn("Device ", device.name, " has no alias for activities -", ACTIVITY_ALIAS);
    return [];
  }
}

function activityReducer(state=initialState.activities, action) {
  switch (action.type) {
  case types.RECEIVE_DEVICES:
    return [].concat(...action.devices.map(device => activityFromDevice(device)))
  case types.RECEIVE_DEVICE:
    // this will wipe away all the activities when you go to a device page
    return activityFromDevice(action.device);
  case types.WEBSOCKET_LIVE_DATA:
    if(action.alias === ACTIVITY_ALIAS) {
      let newActivity = activityFromRawData(action.device, action.data)
      // mutating state is not a good idea
      return state.concat(newActivity);
    } else {
      return state
    }
  default:
    return state;
  }
}

export { activityReducer }
