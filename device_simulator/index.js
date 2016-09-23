"use strict";

var INTERVAL = 1000;

var simplep = require('../server/simplep');

var cik = "320d38612b1fec68c32facc07f832695f259f6f9";
var rid = "e096e7fe8acdc4c0b3a0d0267c455c20fa096165";

var activities = [
  "Entered control mode",
  "Exited control mode",
  "Temperature setpoint set to 10",
  "Temperature setpoint set to -10"
];

var users = [
  "user@example.com",
  "test@example.com",
  "admin@example.com",
  "guest@example.com"
];

var alarms = [
  {
    text: "Under Temperature",
    status: "critical"
  },
  {
    text: "Over Temperature",
    status: "critical"
  },
  {
    text: "Device went inactive",
    status: "inactive"
  },
  {
    text: "Device went offline",
    status: "offline"
  }
];

function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function createRawData() {
  return {
    pressure: Math.random(),
    pressure_left: Math.random(),
    pressure_right: Math.random(),
  };
}

function createAlarm() {
  var alarm = choice(alarms);
  return {
    'text': alarm.text,
    'status': alarm.status,
    'timestamp': Date.now(),
    'did': rid
  };
}

function createActivity() {
  return {
    'user': choice(users),
    'text': choice(activities),
    'timestamp': Date.now(),
    'did': rid
  };
}

function createLocation() {
  return {
    lat: 44 + Math.random(),
    lng: -93 + Math.random()
  }
}

function writeRawData() {
  simplep.exo.write(cik, "raw_data", createRawData());
}

function writeTemperature() {
  simplep.exo.write(cik, "temperature", Math.random() * 100);
}

function writeAlarm() {
  simplep.exo.write(cik, "alarm_log", createAlarm());
}

function writeActivity() {
  simplep.exo.write(cik, "activity_log", createActivity());
}

function writeLocation() {
  simplep.exo.write(cik, "gps", createLocation());
}

console.log("Starting to write data to 1P every", INTERVAL / 1000, "seconds");

setInterval(function() {
  writeRawData();
  writeTemperature();
  if (Math.random() > 0.75) {
    console.log("Wrote alarm");
    writeAlarm();
  }
  if (Math.random() > 0.75) {
    console.log("Wrote activity");
    writeActivity();
  }
  if (Math.random() > 0.25) {
    writeLocation();
  }
}, INTERVAL);
