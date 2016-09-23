/// <reference path="../typings/sequelize/sequelize.d.ts" />
// Definition of device and available methods

import {ReadOptions, Dataports, Datapoint, CreateDevice, DeleteDevice} from './device_actions';

interface Location {
    lat: number;
    lng: number;
}

interface DeviceFromAPI {
    created: number;
    children?: DeviceFromAPI[]; // array of child devices
    data: Dataports;
    location: string; // user settable location
    location_gps: Location; // GPS location
    model: string; // 1P Model (static)
    name: string; // user customizeable name of device
    read(alias:string, options:ReadOptions);

    rid: string; // 1P RID (static)
    sn: string; // 1P SN (static)
    status?: string; // inactive, healthy, alarm
    tags?: string[];
    type: string; // device
    vendor: string;
    updated?: number; // latest dataport written to timestamp (converted to ms)
}

interface Device extends DeviceFromAPI {} // inherit all device properties
class Device { // extend with function calls // initialialize data
  isLoading: boolean;
  updated: number;

  constructor(device: DeviceFromAPI) {
    this.created = device.created;
    this.children = device.children;
    this.data = device.data;
    this.location = device.location;
    this.location_gps = device.location_gps;
    this.model = device.model;
    this.name = device.name;
    this.rid = device.rid;
    this.sn = device.sn;
    this.status = device.status;
    this.tags = device.tags;
    this.type = device.type;
    this.updated = device.updated;
}

  read(alias:string, timeframe:ReadOptions):void{
    console.log("Reading alias: ", alias, " with parameters: ", timeframe);
  }

  write(alias:string, payload:Datapoint):void {
    console.log("Writing alias: ", alias, " with payload: ", payload);
  }

  set(key:string, value:any){}
  get(key:string): any {}
}

export {Device, DeviceFromAPI, Location, CreateDevice, DeleteDevice, Dataports, Datapoint, ReadOptions};
