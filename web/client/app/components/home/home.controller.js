import * as _ from 'lodash';

class HomeController {
  constructor($timeout, $ngRedux, deviceService, $state, auth, store) {
    "ngInject";
    this.deviceService = deviceService;
    this.auth = auth
    this.$timeout = $timeout
    this.$state = $state;
    this.store = store;
    this.subscribedDevices = [];
    this.deviceListItems = [];
    this.activityAlarmItems = [];
    this.Timer = null;
    this.unsubscribe = $ngRedux.connect(this.mapStateToThis, this.deviceService)((selectedState, actions) => {
      this.componentWillReceiveStateAndActions(selectedState, actions);
      Object.assign(this, selectedState, actions);
    });

    function loadAfterAuthed(vm) {
      if(vm.auth.isAuthenticated && vm.store.get("token")) {
        vm.getDevices({limit:10});
      } else {
      if(self.Timer)  $timeout.cancel(self.Timer);
       self.Timer= vm.$timeout(() => loadAfterAuthed(vm), 50);
      }
    }
    loadAfterAuthed(this);
  }

  $onDestroy() {
    this.unsubscribe()
  }

  // Which part of the Redux global state does our component want to receive?
  mapStateToThis(state) {
    const devices = state.devices;
    const alarms = state.alarms;
    const activities = state.activities;
    const isLoading = state.isLoading;
    return {
      alarms,
      activities,
      devices,
      isLoading
    };
  }

  getDeviceStatus(device) {
    let status = 'inactive';
    let latestAlarm = {};
    let latestRawData = {};
    if(device.data.raw_data && device.data.raw_data.length > 0) {
      latestRawData = device.data.raw_data.last()
    }
    if(device.data.alarm_log && device.data.alarm_log.length > 0) {
      latestAlarm = device.data.alarm_log.last()
    }
    if(latestAlarm.timestamp > latestRawData.timestamp) {
      return 'critical'
    } else if(Date.now() - latestRawData.timestamp > 1*60*1000) {
      return 'inactive'
    } else {
      return 'healthy'
    }
    return status;
  }

  componentWillReceiveStateAndActions(nextState, nextActions) {
    if(nextState.devices) {
      let devicesToAdd = _.differenceBy(nextState.devices, this.deviceListItems, 'did');
      let devicesToUpdate = _.differenceBy(this.deviceListItems, devicesToAdd, 'did');

      // only add devices that need to be added, otherwise update the devices (prevents UI flickering)
      this.deviceListItems = this.deviceListItems.concat(devicesToAdd.map(device => {
        if(_.keys(device.data)) {
          nextActions.subscribeToDevices(device);
        }
        return {
          'title': device.sn,
          'subtitle': device.pid,
          'did': device.did,
          'icon': 'icon-device',
          'status': this.getDeviceStatus(device),
          onClick: () => {
            this.$state.go('device', {device_id: device.did})
          },
          lastReported: moment(device.lastReported).fromNow()
        }
      }));

      // update only certain portions of the list items
      _.map(devicesToUpdate, (deviceListItem, index) => {
        let device = _.find(nextState.devices, {'did':deviceListItem.did})
        if(!device) {
          return
        }
        // it would be better to update only what changed, but this is fine for now
        let updated = {
          'status': this.getDeviceStatus(device),
          lastReported: moment(device.lastReported).fromNow()
        }
        // update the list item we need to in place
        _.merge(this.deviceListItems[index], updated);
      })
    }

    if(nextState.alarms) {
      console.log("Next state alarms: ", nextState.alarms)
      console.log("This activity alarms: ", this.activityAlarmItems)
      let newAlarms = _.difference(nextState.alarms, this.activityAlarmItems)
      if(newAlarms.length) {
        this.activityAlarmItems = this.activityAlarmItems.concat(newAlarms.map(alarm => {
          alarm.onClick = () => this.$state.go('device', {device_id: alarm.did})
          return alarm;
        }))
      }
      this.activityAlarmItems = _.uniq(this.activityAlarmItems)
    }

    if(nextState.activities) {
      let newActivities = _.difference(nextState.activities, this.activityAlarmItems)
      if(newActivities.length) {
        this.activityAlarmItems = this.activityAlarmItems.concat(newActivities.map(activity => {
          activity.onClick = () => this.$state.go('device', {device_id: activity.did})
          return activity;
        }))
      }
    }
  }
}

export default HomeController;
