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

     this.stackedChartdata = [{
      name: 'Critical',
      data: [3, 4, 4, 2, 5],
      color: '#c01a00'
    },
      {
        name: 'High',
        data: [2, 2, 3, 2, 1],
        color: '#ffb91d'
      },
      {
        name: 'Low',
        data: [5, 3, 4, 7, 2],
        color: '#A8C3BF'
      }];

    this.summary = 'Last 15 days';
    this.summaryList = ["Last 5 days", "Last 10 days", "Last 15 days", "Last 30 days"];
    this.vehicleList = ["VM-121", "VM-754", "VM-456", "VM-232"];
    this.dgeList = ["Last 5 days", "Last 10 days", "Last 15 days", "Last 30 days"];
    this.timeList = ["Last 5 days", "Last 10 days", "Last 15 days", "Last 30 days"];
   
   
    this.logs = [{
      "title": "11Sep2016 – 10:00 AM",
      "subtitle": "Engine over heat",
      "description": "Critical",
      "icon": "icon-enter-service-mode",
      "timestamp": new Date()
    }, {
        "title": "11Sep2016 – 11:00 AM",
        "subtitle": "Tyre pressure is low",
        "description": "Low",
        "icon": "icon-enter-service-mode",
        "timestamp": new Date()
      }, {
        "title": "11Sep2016 – 12:00 AM",
        "subtitle": "tyre pressure is low",
        "description": "Low",
        "icon": "icon-enter-service-mode",
        "timestamp": new Date()
      }, {
        "title": "11Sep2016 – 12:00 AM",
        "subtitle": "tyre pressure is low",
        "description": "Low",
        "icon": "icon-enter-service-mode",
        "timestamp": new Date()
      }
    ];

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
     console.log("updatere" + JSON.stringify(this.activityAlarmItems));
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
    console.log("nextState");
    console.log(nextState);
    console.log("nextActions");
    console.log(nextActions);
    if(nextState.devices.length) {
      if(!this.initialized) {
        this.initialized = true;
        nextState.devices.map(device => {
          if(_.keys(device.data)) {
            nextActions.subscribeToDevices(device.sn, _.keys(device.data));
          }
        })
      }
    }

    if(nextState.alarms) {
      // console.log("in alarms"+JSON.stringify(nextState.alarms));
      let newAlarms = _.difference(nextState.alarms, this.activityAlarmItems)
      if(newAlarms.length) {
        this.updated = true;
        newAlarms = newAlarms.map(alarm => {
          alarm.onClick = () => this.$state.go('device', {product_id: alarm.pid, device_id: alarm.did})
          return alarm;
        })
      //  this.activityAlarmItems = this.activityAlarmItems.concat(newAlarms);
      }
    }

    if(nextState.activities) {
      console.log("ikn activities"+JSON.stringify(nextState.activities));
      let newActivities = _.difference(nextState.activities, this.activityAlarmItems)
      
      // console.log("newActivities activities"+JSON.stringify(newActivities));
      if(newActivities.length) {
        this.updated = true;
         newActivities = newActivities.map(activity => {
          activity.onClick = () => this.$state.go('device', {product_id: activity.pid, device_id: activity.did})
          return activity;
        })
        this.activityAlarmItems = this.activityAlarmItems.concat(newActivities);
      }
    }

    if(this.updated) {
      this.updated = false;
      this.updateResults();
    }
  }

}
export default LogsController;
