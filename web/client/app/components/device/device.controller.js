// This is an example device page

const PLOT_DATAPORTS = ["temperature", "light", "moisture"]

class DeviceController {
  constructor($ngRedux, $scope, deviceService, $stateParams) {
    "ngInject";
    // get the device ID based on what the current $stateParam.device_id is
    // this will let us grab a specific device if we are loaded from a device page directly
    this.device_id = $stateParams.device_id;
    this.deviceService = deviceService;
    // connect to the global redux state, and add the deviceService (so we can send dispatches from the current controller
    this.unsubscribe = $ngRedux.connect(this.mapStateToThis, this.deviceService)((selectedState, actions) => {
      this.componentWillReceiveStateAndActions(selectedState, actions);
      Object.assign(this, selectedState, actions);
    });
    this.initialized = false;
    this.plotData = [];
    // send the device request - this is a function on the deviceService module
    // we can set the limit here if we want to receive more data
    this.getDevice(this.device_id, {limit:100});
  }

  // cleanup when we navigate away
  $onDestroy() {
    this.unsubscribe();
    this.initialized = false
    this.plotData = [];
    this.alarmListItems = [];
  }

  // Which part of the Redux global state does our component want to receive?
  mapStateToThis(state) {
    const devices = state.devices;
    const alarms = state.alarms;
    const activities = state.activities;
    const isLoading = state.isLoading;
    return {
      activities,
      alarms,
      devices,
      isLoading
    };
  }

  // helper for transforming data from what we receive from the API to something that works with highcharts
  plotFromData(data) {
    return _.sortBy(_.map(data, (point) => {
      return [moment(point.ts).valueOf(), parseFloat(point.value)]
    }), (point) => {
      return point[0]
    })
  }

  // this is the loop that runs whenever the global redux state changes (user logs out, device data is added)
  // this is where dynamic data processing should be done as this is code that can be event based
  componentWillReceiveStateAndActions(nextState, nextActions) {
    // nextState is the global state
    //
    // when we start, the state has defaults - state = {devices:[], ...}
    // when actions occur (like the this.getDevice(...)) above, the data they return is put into the state by reducers
    // the controller can access the data through the state
    // when we have devices, nextState.devices will be a list of devices.
    //
    if(nextState.devices) {
      // find our device for the page we're on
      nextState.devices.map( (device) => {
        if(device.did === this.device_id) {
          this.device = device;
          console.log("Device: ", device)
          // if this is the first time we found the device, we need to do an initialization step
          // if this is the second time we've updated the state, then device data may have been modified,
          // so do some looping to ensure that our controller's local data is in sync with the global device data
          // this means only adding the new points, rather than tearing all the data down and rebuilding
          if(!this.initialized) {
            if(_.keys(device.data).length) {
              nextActions.subscribeToDevices([device])
            }

            this.plotData = _.filter(_.map(PLOT_DATAPORTS, (dataport) => {
              if(this.device.data[dataport]) {
                return {
                  name: dataport,
                  data: this.plotFromData(this.device.data[dataport])
                }
              }
            }))
            this.initialized = true;
          } else {
            //console.log("Updating plot w/ data")
            _.each(this.plotData, (dataseries, index) => {
              // data was loaded, but the limit was bigger so we need to backfill data
              let newData = [];
              //console.log("Device data size: ", this.device.data[dataseries.name].length)
              //console.log("Dataseries length: ", dataseries.data.length)
              if(this.device.data[dataseries.name].length > dataseries.data.length+2) {
                //console.log("Resetting series: ", this.device.data[dataseries.name])
                newData = this.plotFromData(this.device.data[dataseries.name])
                this.plotData[index].data = newData
              } else {
                // live data was added - definite optimizations to be had here
                let latestTimestamp = dataseries.data.last()[0];
                newData = _.filter(this.device.data[dataseries.name], function(point) {
                  return moment(point.ts).valueOf() > latestTimestamp
                });
                if(newData.length) {
                  this.plotData[index].data = dataseries.data.concat(this.plotFromData(newData))
                }
              }

            })

          }
        }
      })
    }

    if(nextState.alarms) {
      // if we have alarms, then make sure our local controller has the same alarms, but only the ones that match
      // our device ID
      this.alarmListItems = _.filter(nextState.alarms.map(alarm => {
        if(alarm.did === this.device_id) {
          return alarm;
        }
      }));
    }

    if(nextState.activities) {
      // if we have activities, then make sure our local controller has the same activities, but only the ones that match
      // our device ID
      this.activityListItems = _.filter(nextState.activities.map(activity => {
        if(activity.did === this.device_id) {
          return activity;
        }
      }));
    }

  }
}

export default DeviceController;
