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
  
    var today = new Date();
    var startdatetime = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7); //Last Week
    var milliseconds = startdatetime.getTime() / 1000;
    //var starttime = Math.floor((new Date).getTime()/1000);
    this.aliases = '[{"alias":"ecu","options": {"sort":"desc", "limit":100, "starttime":' + milliseconds + '}}]';

    this.unsubscribe = $ngRedux.connect(this.mapStateToThis, this.deviceService)((selectedState, actions) => {
      this.componentWillReceiveStateAndActions(selectedState, actions);
      Object.assign(this, selectedState, actions);
    });

     this.getDevices(this.aliases);

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

   this.vehicleFilterList = ["WM-212438", "WM-212439", "WM-212440", "WM-212441", "WM-212442"];
   this.vehicleFilter = "WM-212438";

   this.red_stop_lamp_status = 0;
   this.amber_lamp_status = 0;
   this.malfunction_indicator_lamp_status = 0;
   this.protect_lamp_status = 0;

   this.nextMaintenance = new Date();
 
   this.scheMaintenance = [{
      "lastThree": "11 Sep, 2016 – 10:00 AM",
      "engineHoursAfterMain": "2321" }, 
      {
        "lastThree": "23 Feb, 2016 – 11:00 AM",
        "engineHoursAfterMain": "13343"
      }, {
        "lastThree": "12 Dec, 2015 – 12:00 AM",
        "engineHoursAfterMain": "12353"
      }];


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

 getCount(group) {
    var count = 0;
    if(this.activityAlarmItems)
    {
      for (var i = 0; i < this.activityAlarmItems.length; i++) {
          if (this.activityAlarmItems[i].group == group) {
              count++;
          }
      }
    }
    return count;
 }

  updateResults() {
    
    var d = new Date();
    var n = d.getTime();

    this.activityAlarmItems.push({"status":"fault","title":"WM-212440","group":"amber_lamp_status","subtitle":"Fault code Status 459","timestamp":n,"icon":"icon-warning-general","did":null,"type":"alarm","onClick":"test"});
    
    n = (n - 5 * 60 * 1000);

    this.activityAlarmItems.push({"status":"fault","title":"WM-212441","group":"amber_lamp_status","subtitle":"Fault code Status 806","timestamp":n,"icon":"icon-warning-general","did":null,"type":"alarm","onClick":"test"});
    
     n = (n - 10 * 60 * 1000);
    
    this.activityAlarmItems.push({"status":"fault","title":"WM-212438","group":"amber_lamp_status","subtitle":"Fault code Status 159","timestamp":n,"icon":"icon-warning-general","did":null,"type":"alarm","onClick":"test"});
    
     n = (n - 15 * 60 * 1000);

    this.activityAlarmItems.push({"status":"fault","title":"WM-212439","group":"amber_lamp_status","subtitle":"Fault code Status 127","timestamp":n,"icon":"icon-warning-general","did":null,"type":"alarm","onClick":"test"});     

 console.log("updatere" + JSON.stringify(this.activityAlarmItems));

    if(this.search !== "") {
      this.filteredActivityAlarmItems = _.filter(this.activityAlarmItems, item => {
        return this.shouldBeIncluded(item, this.search)
      })
    } else {

      console.log("activityAlarmItems");
      console.log(this.activityAlarmItems);

      this.filteredActivityAlarmItems = this.activityAlarmItems;

// alerts.push({num : 3, app:'helloagain_again',message:'yet another message'});

// this.stackedChartdata = [{
//       name: 'Critical',
//       data: [3, 4, 4, 2, 5],
//       color: '#c01a00'
//     },
//       {
//         name: 'High',
//         data: [2, 2, 3, 2, 1],
//         color: '#ffb91d'
//       },
//       {
//         name: 'Low',
//         data: [5, 3, 4, 7, 2],
//         color: '#A8C3BF'
//       }];


    }

    this.red_stop_lamp_status = this.getCount('red_stop_lamp_status');
    this.amber_lamp_status =  this.getCount('amber_lamp_status');
    this.malfunction_indicator_lamp_status = this.getCount('malfunction_indicator_lamp_status');
    this.protect_lamp_status =  this.getCount('protect_lamp_status');

  }

  $onDestroy() {
    this.unsubscribe();
  }

  // Which part of the Redux global state does our component want to receive?
  mapStateToThis(state) {
    const alarms = state.alarms;
    const devices = state.devices;
    const isLoading = state.isLoading;
    return {
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
       console.log("in alarms"+JSON.stringify(nextState.alarms));
      let newAlarms = _.difference(nextState.alarms, this.activityAlarmItems)
      if(newAlarms.length) {
        this.updated = true;
        newAlarms = newAlarms.map( alarm => {
            alarm.onClick = () => this.$state.go('', {product_id: alarm.pid, device_id: alarm.did})
            return alarm;
        })
        this.activityAlarmItems = this.activityAlarmItems.concat(newAlarms);
      }
    }

    if(nextState.activities) {
      console.log("ikn activities"+JSON.stringify(nextState.activities));
      let newActivities = _.difference(nextState.activities, this.activityAlarmItems)
      
       console.log("newActivities activities"+JSON.stringify(newActivities));
      if(newActivities.length) {
        this.updated = true;
         newActivities = newActivities.map(activity => {
          activity.onClick = () => this.$state.go('', {product_id: activity.pid, device_id: activity.did})
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
