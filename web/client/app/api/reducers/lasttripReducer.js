import * as types from '../constants';

import initialState from './initialState';
import { alarmReducer } from './';

const LASTTRIP_ALIAS = 'ecu';

function reducelasttripdata(device, data) {
    console.log("reducelasttrupdata", device, data);
    var ecu_data = data.value.replace(/\'/g, '\"');
    ecu_data = JSON.parse(ecu_data);
    return { data: ecu_data, timestamp: data.timestamp };
}

function getEngineHours(ecudataCollection) {
    var firstecudata = ecudataCollection[0];
    var lastecudata = ecudataCollection[ecudataCollection.length - 1];
    if (firstecudata && lastecudata)
        return lastecudata.data.engine_hours - firstecudata.data.engine_hours;
    else
        return 0;
}

function getMilesDriven(ecudataCollection) {
    var firstecudata = ecudataCollection[0];
    var lastecudata = ecudataCollection[ecudataCollection.length - 1];
    if (firstecudata && lastecudata)
        return lastecudata.data.total_vehicle_distance_high_resolution - firstecudata.data.total_vehicle_distance_high_resolution;
    else
        return 0;
}

function getTotalGasUsed(dgeCollection, dgeFilledCollection) {
    var initialDGE = 0;
    var latestDGE = 0;
    if (dgeCollection)
        if (dgeCollection.length > 0)
            initialDGE = dgeCollection[0].value;

    if (dgeCollection)
        if (dgeCollection.length > 0)
            latestDGE = dgeCollection[dgeCollection.length - 1].value;

    console.log('dgeCollection', dgeCollection);
    console.log('dgeFilledCollection', dgeFilledCollection);
    var totalGasFilled = 0;
    if (dgeFilledCollection) {
        for (var gasfilled in dgeFilledCollection) {
            console.log('gasfilled', dgeFilledCollection[gasfilled].value);
            if (dgeFilledCollection[gasfilled].value) {
                totalGasFilled = totalGasFilled + dgeFilledCollection[gasfilled].value;
            }
        }
    }
    // var totalGasFilled = dgeFilledCollection.reduce(function (sum, gasfilled) {
    //       return sum + gasfilled.value;
    //   }, 0);

    return initialDGE + totalGasFilled - latestDGE;

}

function getDGEHours(totalGasConsumed, enginehours) {
    return totalGasConsumed / enginehours
}

function reduceLastTripFromDevice(device) {
    console.log("reducelasttripdata 1", device);
    if (device.data[LASTTRIP_ALIAS]) {

        var ecudataCollection = device.data[LASTTRIP_ALIAS].map(data => reducelasttripdata(device, data));
        var dgeCollection = device.data['dge'];
        var dgeFilledCollection = device.data['gas_filled'];

        var engineHoursResult = getEngineHours(ecudataCollection);
        var totalGasConsumed = getTotalGasUsed(dgeCollection, dgeFilledCollection);

        return {
            enginehours: engineHoursResult.toFixed(2),
            milesdriven: getMilesDriven(ecudataCollection).toFixed(2),
            dge_hr: Number(getDGEHours(totalGasConsumed, engineHoursResult).toFixed(2)),
            totalgasused: totalGasConsumed.toFixed(2)
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

function lasttripReducer(state = initialState.lasttrip, action) {
    switch (action.type) {
        case types.RECEIVE_DEVICES_LASTTRIP:
            return [].concat(...action.devices.map(device => reduceLastTripFromDevice(device)))
        case types.RECEIVE_DEVICE_LASTTRIP:
            return reduceLastTripFromDevice(action.device);
        case types.WEBSOCKET_LIVE_DATA:
            if (action.alias === LASTTRIP_ALIAS) {
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