import * as types from './constants';
import * as _ from 'lodash';

function requestDevice(pid, sn) {
    return {
        type: types.REQUEST_DEVICE,
        pid: pid,
        sn: sn
    }
}

function requestDeviceTrend(alias, starttime) {

    // console.log("requestDeviceTrend: ");
    return {
        type: types.REQUEST_DEVICES,
        alias: alias,
        starttime: starttime
    }
}

function receiveDevice(device) {
    // console.log("received device: ", device);
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

function subscribeDevices(rids, aliases) {
    return {
        type: types.SUBSCRIBE_DEVICES,
        rids: rids,
        aliases: aliases
    }
}

function unsubscribeDevices(rids, aliases) {
    return {
        type: types.UNSUBSCRIBE_DEVICES,
        rids: rids,
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

function receiveDeviceNotesNotifications(notifications) {
    return {
        type: types.RECEIVE_USER_NOTIFICATIONS,
        notifications: notifications,
        email: email
    }
}

export default function deviceService($http, $ngRedux, projectConfig, websocket) {
    "ngInject";

    function getDevices() {
        return dispatch => {
            dispatch(requestDevices())
            return $http({
                    url: `${projectConfig.api_base_url}/devices`,
                    method: "GET",
                    headers: { 'Authorization': `${projectConfig.auth_token}` }
                })
                .then(response =>
                    response.data)
                .then(devices => dispatch(receiveDevices(devices)))
        }
    }

    function shouldGetDevices(state, timeout) {
        const { devices, isLoading, lastUpdated } = state;
        if (isLoading.devices) {
            return false;
        }
        if (lastUpdated.devices === 0 || moment() > (lastUpdated.devices + timeout * 1000)) {
            // console.log("Last updated: ", lastUpdated.devices);
            // console.log("DELTA: ", moment() > (lastUpdated.devices + timeout*1000));
            return true
        }
        return false;
    }

    function getDevicesIfNeeded(timeout = 60) {
        return (dispatch, getState) => {
            if (shouldGetDevices(getState(timeout))) {
                return dispatch(getDevices());
            }
        };
    }

    function getDevice(pid, sn) {
        // console.log("in getDevice");
        return dispatch => {
            dispatch(requestDevice(pid, sn))
            return $http({
                    url: `${projectConfig.api_base_url}/devices`,
                    method: "GET",
                    params: { "pid": pid, "sn": sn },
                    headers: { 'Authorization': `${projectConfig.auth_token}` }
                })
                .then(response => {
                    console.log("receive response: ", response)
                    return response.data
                })
                .then(device => dispatch(receiveDevice(device)))
        }
    }

    function putDeviceNotes(pid, sn, alias, notes) {
        return dispatch => {
            dispatch(requestDevice(pid, sn))
            return $http({
                    url: `${projectConfig.api_base_url}/devices/${pid}/${sn}/${alias}`,
                    method: "PUT",
                    data: notes,
                    headers: { 'Authorization': `${projectConfig.auth_token}`, 'Content-Type': 'application/json', 'Accept': 'application/json' }
                })
                .then(response => {
                    return response.data
                })
                .then(device => dispatch(receiveDevice(device)))
        }
    }

    function getDevicesTrend(alias, starttime) {
        // console.log("in getDevicesTrend");
        return dispatch => {
            dispatch(requestDeviceTrend(alias, starttime))
            return $http({
                    url: `${projectConfig.api_base_url}/devicestrend/${alias}/${starttime}`,
                    method: "GET",
                    headers: { 'Authorization': `${projectConfig.auth_token}` }
                })
                .then(response => response.data)
                .then(devices => {
                    // alert(JSON.stringify(devices[0].data));
                    // console.log(devices[0].data.);
                    dispatch(receiveDevices(devices));
                })
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

    function readDevice(id, aliases, options = { limit: 10 }) {
        var readBody;

        if (aliases) {
            if (_.isArray(aliases)) {
                readBody = buildReadRequestBody(aliases, options);
            } else {
                //assume it's a single string
                readBody = buildReadRequestBody([aliases], options);
            }
        } else {
            //No aliases were given, so find the device by the given ID and grab it's list of aliases.
            var device = _.find($ngRedux.getState().devices, { rid: id });
            readBody = buildReadRequestBody(_.keys(device.data), options);
        }

        return dispatch => {
            dispatch(requestReadDevice(id))
            return $http({
                    url: `${projectConfig.api_base_url}/devices/read/${id}`,
                    method: "POST",
                    data: readBody,
                    headers: { 'Authorization': `${projectConfig.auth_token}` }
                })
                .then(response => {
                    // console.log("received response from /devices/read : ", response)
                    return response.data
                })
                .then(device => dispatch(receiveReadDevice(device)))
        }
    }

    function subscribeToDevices(rids, aliases) {
        if (!(rids instanceof Array) && rids) {
            rids = [rids];
        }
        if (!(aliases instanceof Array) && aliases) {
            aliases = [aliases];
        }
        return dispatch => {
            dispatch(subscribeDevices(rids, aliases))
            websocket.subscribe(rids, aliases);
        }
    }

    function unsubscribeFromDevices(rids, aliases) {
        if (!(rids instanceof Array) && rids) {
            rids = [rids];
        }
        if (!(aliases instanceof Array) && aliases) {
            aliases = [aliases];
        }
        return dispatch => {
            dispatch(unsubscribeDevices(rids, aliases));
            websocket.unsubscribe(rids, aliases);
        }
    }

    return {
        getDevices,
        getDevicesTrend,
        getDevicesIfNeeded,
        getDevice,
        putDeviceNotes,
        readDevice,
        subscribeToDevices,
        unsubscribeFromDevices
    }

}