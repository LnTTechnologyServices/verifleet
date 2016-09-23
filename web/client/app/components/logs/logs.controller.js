let SEARCH_KEYS = ["text", "title", "subtitle", "status", "name"]

class LogsController {
  constructor($ngRedux, $stateParams, auth, $state, deviceService, store, $timeout) {
    "ngInject";
    this.deviceService = deviceService
    this.auth = auth
    this.store = store
    this.$timeout = $timeout
    this.$state = $state

    this.search = ""
    this.activityAlarmItems = []
    this.filteredActivityAlarmItems = []
    this.initialized = false;

    this.unsubscribe = $ngRedux.connect(this.mapStateToThis, this.deviceService)((selectedState, actions) => {
      this.componentWillReceiveStateAndActions(selectedState, actions);
      Object.assign(this, selectedState, actions);
    });

    function loadAfterAuthed(vm) {
      if(vm.auth.isAuthenticated && vm.store.get("token")) {
        vm.getDevicesIfNeeded();
      } else {
        vm.$timeout(() => loadAfterAuthed(vm), 50);
      }
    }
    loadAfterAuthed(this);
  }

  shouldBeIncluded(item, search) {
    return _.some(item, (value, key) => {
      // check if this is a key we can search for
      if(SEARCH_KEYS.indexOf(key) > -1) {
        // check if our search string matches the value of the key
        if(value.toLowerCase().indexOf(search) > -1) {
          return true;
        }
      }
      return false
    })
  }

  updateResults() {
    if(this.search !== "") {
      this.filteredActivityAlarmItems = _.filter(this.activityAlarmItems, item => {
        return this.shouldBeIncluded(item, this.search)
      })
    } else {
      this.filteredActivityAlarmItems = this.activityAlarmItems;
    }
  }

  $onDestroy() {
    this.unsubscribe();
  }

  // Which part of the Redux global state does our component want to receive?
  mapStateToThis(state) {
    const alarms = state.alarms;
    const activities = state.activities;
    const devices = state.devices;
    const isLoading = state.isLoading;
    return {
      activities,
      alarms,
      devices,
      isLoading,
    };
  }

  componentWillReceiveStateAndActions(nextState, nextActions) {
    if(nextState.devices.length) {
      if(!this.initialized) {
        this.initialized = true;
        nextState.devices.map(device => {
          if(_.keys(device.data)) {
            nextActions.subscribeToDevices(device);
          }
        })
      }
    }

    if(nextState.alarms) {
      let newAlarms = _.difference(nextState.alarms, this.activityAlarmItems)
      if(newAlarms.length) {
        this.updated = true;
        newAlarms = newAlarms.map(alarm => {
          alarm.onClick = () => this.$state.go('device', {device_id: alarm.did})
          return alarm;
        })
        this.activityAlarmItems = this.activityAlarmItems.concat(newAlarms);
      }
    }

    if(nextState.activities) {
      let newActivities = _.difference(nextState.activities, this.activityAlarmItems)
      if(newActivities.length) {
        this.updated = true;
        newActivities.map(activity => {
          this.activityAlarmItems.push(activity => {
             activity.onClick = () => this.$state.go('device', {device_id: alarm.did})
             return activity;
          })
        })
      }
    }

    if(this.updated) {
      this.updated = false;
      this.updateResults();
    }
  }

}

export default LogsController;
