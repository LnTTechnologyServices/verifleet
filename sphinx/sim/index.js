"use strict";

var INTERVAL = 5000;

var simplep = require('./simplep/simplep');

var cik = process.env["CIK"] || "8d9f9e3569e9f9bfcf97875631343d6444b7fae3";
var rid = "e096e7fe8acdc4c0b3a0d0267c455c20fa096165";

const MAX_VOLTAGE = 1000
const VOLTAGE_THRESHOLD = MAX_VOLTAGE * 0.95
const MAX_CURRENT = 100
const CURRENT_THRESHOLD = MAX_CURRENT * 0.95
const POWER_THRESHOLD = MAX_CURRENT * MAX_VOLTAGE * 0.9

const MAX_TEMPERATURE = 200
const TEMPERATURE_THRESHOLD = MAX_TEMPERATURE * 0.9

var OVER_TEMPERATURE_ALARM = {
  name: "Over Temperature",
  status: "critical",
  priority: "critical",
  description: "The temperature has exceeded " + TEMPERATURE_THRESHOLD
}

var OVER_VOLTAGE_ALARM = {
  name: "Over Voltage",
  status: "critical",
  priority: "critical",
  description: "The voltage has exceeded " + VOLTAGE_THRESHOLD
}

var OVER_CURRENT_ALARM = {
  name: "Over Current",
  status: "critical",
  priority: "warning",
  description: "Current has exceeded " + CURRENT_THRESHOLD
}

var OVER_POWER_ALARM = {
  name: "Over Power",
  status: "critical",
  priority: "critical",
  description: "The power has exceeded " + POWER_THRESHOLD
}

var INACTIVE_ALARM = {
  name: "Device went inactive",
  status: "inactive",
  priority: "informational",
  description: "The device is currently inactive"
}

var OFFLINE_ALARM = {
  name: "Device went offline",
  status: "offline",
  priority: "critical",
  description: "The device has gone offline"
}

function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createRawData() {
  var current = Math.random() * MAX_CURRENT;
  var voltage = Math.random() * MAX_VOLTAGE;
  var power = current * voltage;
  var temperature = Math.random() * MAX_TEMPERATURE;

  return {
    temperature: temperature,
    //voltage: voltage,
    current: current,
    power: power
  };
}

function createAlarm(data) {
  var alarm = false;
  if (data.power > POWER_THRESHOLD) {
    alarm = OVER_POWER_ALARM
  } /*else if(data.voltage > VOLTAGE_THRESHOLD) {
    alarm = OVER_VOLTAGE_ALARM
  }*/ else if (data.current > CURRENT_THRESHOLD) {
    alarm = OVER_CURRENT_ALARM
  } else if (data.temperature > TEMPERATURE_THRESHOLD) {
    alarm = OVER_TEMPERATURE_ALARM
  }

  if (alarm) {
    return {
      timestamp: Date.now(),
      name: alarm.name,
      status: alarm.status,
      priority: alarm.priority,
      description: alarm.description,
      group: "group1"
    }
  } else {
    return false
  }
}

function createLocation() {
  return {
    lat: 44 + Math.random() * 2,
    lng: -93 + Math.random() * 2
  }
}

function writeRawData() {
  var data = createRawData()
  simplep.exo.write(cik, "raw_data", data);
  return data
}

function writeLocation() {
  simplep.exo.write(cik, "gps", createLocation())
}

console.log("Starting to write data to 1P every", INTERVAL / 1000, "seconds");

setInterval(function() {
  var data = writeRawData();
  var alarm = createAlarm(data);
  if (alarm) {
    console.log("Writing data: ", JSON.stringify(data))
    console.log("Writing alarm: ", JSON.stringify(alarm))
    simplep.exo.write(cik, "alarm_log", alarm);
  } else {
    console.log("no alarm")
  }
  if (Math.random() > 0.8) {
    writeLocation();
  }
}, INTERVAL);
