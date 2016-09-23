import * as types from './constants';
import * as _ from 'lodash';

function requestDevice(id) {
  return {
    type: types.REQUEST_DEVICE,
    id: id
  }
}

function receiveDevice(device) {
  console.log("received device: ", device);
  return {
    type: types.RECEIVE_DEVICE,
    device: device
  }
}

function requestDevices() {
  return {
    type: types.REQUEST_DEVICES
  }
}

function receiveDevices(devices) {
  return {
    type: types.RECEIVE_DEVICES,
    devices: devices
  }
}

function subscribeDevices(devices, aliases) {
  return {
    type: types.SUBSCRIBE_DEVICES,
    devices: devices,
    aliases: aliases
  }
}

function unsubscribeDevices(devices, aliases) {
  return {
    type: types.UNSUBSCRIBE_DEVICES,
    devices: devices,
    aliases: aliases
  }
}

function requestReadDevice(id) {
  return {
    type: types.REQUEST_READ_DEVICE,
    id: id
  }
}

function receiveReadDevice(device) {
  return {
    type: types.RECEIVE_READ_DEVICE,
    device: device
  }
}



export default function deviceService($http, $ngRedux, projectConfig, websocket) {
  "ngInject";
  function getDevices(options) {
    return dispatch => {
      dispatch(requestDevices())
      if(!options) {
        options = {limit:10}
      }
      return $http({
        url: `${projectConfig.api_base_url}/api/v1/devices`,
        method: "GET",
        params: options
      })
        .then(response => response.data)
        .then(devices => dispatch(receiveDevices(devices)))
    }
  }

  function shouldGetDevices(state, timeout) {
    const { devices, isLoading, lastUpdated } = state;
    if (isLoading.devices) {
      return false;
    }
    if(lastUpdated.devices === 0 || moment() > (lastUpdated.devices + timeout*1000)) {
      console.log("Last updated: ", lastUpdated.devices);
      console.log("DELTA: ", moment() > (lastUpdated.devices + timeout*1000));
        return true
    }
    return false;
  }

  function getDevicesIfNeeded(timeout=60) {
    return (dispatch, getState) => {
      if (shouldGetDevices(getState(timeout))) {
        return dispatch(getDevices());
      }
    };
  }

  function getDevice(id, options) {
    if(!options) {
      options = {limit: 10}
    }
    let device = _.find($ngRedux.getState().devices, {did: id});
    if(!device) {
      let did = id.split(".")
      device = {
        pid: did[0],
        sn: did[1]
      }
    }
    return dispatch => {
      dispatch(requestDevice(id))
      return $http({
        url: `${projectConfig.api_base_url}/api/v1/devices/${device.pid}/${device.sn}`,
        method: "GET",
        params: options
      })
        .then(response => {
          console.log("receive response: ", response)
          return response.data
        })
        .then(device => dispatch(receiveDevice(device)))
    }
  }

  /**
   *  Helper function for readDevice().
   *  Intended as a "private" method - it is not exposed externally.
   **/
  function buildReadRequestBody(aliasArray, options) {
    return _.map(aliasArray, function(alias) {
      return { alias: alias, options: options }
    });
  }

  function readDevice(id, alias, options = { limit: 10 }) {
    var readBody;
    let device = _.find($ngRedux.getState().devices, {did: id});

    return dispatch => {
      dispatch(requestReadDevice(id))
      return $http({
        url: `${projectConfig.api_base_url}/devices/${device.pid}/${device.sn}/${alias}`,
        method: "GET",
        params: options
      })
      .then(response => {
        console.log("received response from /devices/read : ", response)
        return response.data
      })
      .then(device => dispatch(receiveReadDevice(device)))
    }
  }

  function subscribeToDevices(devices, aliases) {
    if(!(devices instanceof Array) && devices) {
      devices = [devices];
    }
    if(!(aliases instanceof Array) && aliases) {
      aliases = [aliases];
    }
    return dispatch => {
      dispatch(subscribeDevices(devices, aliases))
      websocket.subscribe(devices, aliases);
    }
  }

  function unsubscribeFromDevices(devices, aliases) {
    if(!(devices instanceof Array) && devices) {
      devices = [devices];
    }
    if(!(aliases instanceof Array) && aliases) {
      aliases = [aliases];
    }
    return dispatch => {
      dispatch(unsubscribeDevices(devices, aliases));
      websocket.unsubscribe(devices, aliases);
    }
  }

  return {
    getDevices,
    getDevicesIfNeeded,
    getDevice,
    readDevice,
    subscribeToDevices,
    unsubscribeFromDevices
  }

}