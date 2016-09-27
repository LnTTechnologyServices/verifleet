import * as _ from 'lodash';

function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
class FuelController {
    constructor($timeout, $ngRedux, deviceService, $state, auth, store, websocketserver,VfSharedService, $interval) {
        "ngInject";
        this.deviceService = deviceService;
        this.headerUrl = require("./maps.jpg");
        this.auth = auth
        this.$timeout = $timeout
        this.$state = $state;
        this.store = store;
        this.$interval = $interval;
        this.VfSharedService = VfSharedService;
        this.unsubscribe = $ngRedux.connect(this.mapStateToThis, this.deviceService)((selectedState, actions) => {
            this.componentWillReceiveStateAndActions(selectedState, actions);
            Object.assign(this, selectedState, actions);
        });

        this.$timeout = $timeout;
        this.websocketserver = websocketserver;
        this.dateFilterList = [{ "id": 5, "value": "Last 5 Days" },
            { "id": 10, "value": "Last 10 Days" },
            { "id": 15, "value": "Last 15 Days" },
            { "id": 20, "value": "Last 20 Days" }
        ];
        this.dateFilter = 5;
        this.currentDate = Math.floor(new Date() / 1000);
        //alert(this.currentDate);
        let yestDate = new Date();
        yestDate.setDate(yestDate.getDate() - 1);
        this.yestDate = Math.floor(yestDate / 1000);
        let last15Days = new Date();
        this.last15Days = new Date().setDate(new Date().getDate() - 15);
        this.last15Days = Math.floor(last15Days / 1000);

        // this.aliases = '[{"alias":"gps","options": {"sort":"desc", "limit":1 }}, { "alias": "dge", "options": { "sort": "desc", "limit": 5 } }, { "alias": "ecu", "options": { "sort": "desc","starttime":"' + this.yestDate + '", "endtime": "' + this.currentDate + '","limit":100}}]';
        this.aliases = '[{"alias":"gps","options": {"sort":"desc", "limit":1 }}, { "alias": "dge", "options": { "sort": "desc","limit": 1  } }, { "alias": "ecu", "options": { "sort": "desc", "limit":10 } }]';
        //"starttime":last15Days, 
        // create the list of sushi rolls 
        this.deviceslist = [];
        this.deviceListItems = [];

        this.lineChartData = [{
            type: 'area',
            name: this.vechicle_id,
            data: []
        }];

        function loadAfterAuthed(vm) {
            if (vm.auth.isAuthenticated && vm.store.get("token")) {
                var today = new Date();
            var startdatetime = new Date(today.getFullYear(), today.getMonth(), today.getDate(),today.getHours() - 1);
            var enddatetime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            var starttimemilliseconds = (startdatetime.getTime() / 1000);
            var livetripaliases = '[{"alias":"dge","options": {"sort":"desc", "limit":20, "starttime":' + starttimemilliseconds + '}},{"alias":"ecu","options": {"sort":"desc", "limit":20, "starttime":' + starttimemilliseconds + '}},{"alias":"gas_filled","options": {"sort":"desc", "limit":20, "starttime":' + starttimemilliseconds + '}}]';
                vm.getDevicesLiveData(livetripaliases);
            } else {
                if (self.Timer) $timeout.cancel(self.Timer);
                self.Timer = vm.$timeout(() => loadAfterAuthed(vm), 50);
            }
        }

        loadAfterAuthed(this);

        var today = new Date();

        //this.runGasFilled();
        //this.runGasUsed();
        this.ontimeframeChange();
        //this.runMovingLineCharts();

        this.sortType = 'name'; // set the default sort type
        this.sortReverse = false; // set the default sort order
        this.searchFish = ''; // set the default search/filter term

    }

    getVehicleReport() {
        if (this.deviceListItems && this.dateFilter) {
            console.log('getVehicleReport',this.dateFilter);
            var today = new Date();
            var startdatetime = new Date(today.getFullYear(), today.getMonth(), today.getDate() - this.dateFilter);
            var enddatetime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            var starttimemilliseconds = startdatetime.getTime() / 1000;
            var vehiclereportaliases = '[{"alias":"gas_filled","options": {"sort":"asc", "limit":300, "starttime":' + starttimemilliseconds + '}}]';
            this.requestVehicleReportSent = true;
            this.getDevicesWithAction(vehiclereportaliases, 'REQUEST_DEVICES_GASFILLED');
        }
    }

    UpdateSiteSummary(deviceListItems)
    {
         console.log('UpdateSiteSummary', this.deviceListItems);
    }

    updateVehicleReport(deviceListItems) {
        console.log('updateVehicleReport', deviceListItems);

        if(deviceListItems)
        {
//             this.milesGallonsFilledData = [];
//             this.deviceData = [];
//             var i = 0;
//              for (i = 0; i < deviceListItems.length; i++) {
                    
//                     var j = 0;
//                     for (j = 0; j < deviceListItems[i].dgeFilled.length; j++) {
//                         this.deviceData.categories.push(this.convertDate(dgeFilled[i].timestamp));
//                         this.deviceData.values.push(Number((dgeFilled[i].value).toFixed(2)));
//                     }

//  this.deviceslist.push({ name: device.name, type: device.type, lastReported: device.updated,
//                                 rid : device.rid, status: "healthy", onClick: () => this.$state.go('efficiency', {vechicle_id: device.rid}) });
                    
//              }

        }

        // this.milesGallonsData.values.length = 0
        // this.milesGallonsData.categories.length = 0
        // var i = 0;
        // for (i = 0; i < dgeFilled.length; i++) {
        //     this.milesGallonsData.categories.push(this.convertDate(dgeFilled[i].timestamp));
        //     this.milesGallonsData.values.push(Number((dgeFilled[i].value).toFixed(2)));
        // }
    }

    updatefaultcodes() {
        this.red_stop_lamp_status = this.getCount('red_stop_lamp_status');
        if (this.activityAlarmItems) {
            this.faultCode = this.activityAlarmItems.length;
        }
    }
    
    updatedgelivegraph(deviceListItems)
    {    
        console.log('updatedgelivegraph', deviceListItems);
         console.log('updatedgelivegraph 2', this.deviceslist);

        if (deviceListItems && this.deviceslist ) {
                
                var devicefilteredItems = deviceListItems.filter(function(device) { if (device.gasConsumed) return true; });
                if(devicefilteredItems && devicefilteredItems.length > 0)
                {
                    for(var device in devicefilteredItems)
                    {
                        console.log('device ---',devicefilteredItems[device].rid);
                        //var deviceSelected = _.find(this.deviceslist , function(obj) { return obj.rid === devicefilteredItems[device].rid })
                        
                        for(var devicegraph in this.deviceslist)
                        {
                            if(this.deviceslist[devicegraph].rid === devicefilteredItems[device].rid)
                            { 
                                console.log('deviceSelected',this.deviceslist[devicegraph]);
                                if(devicefilteredItems[device].gasConsumed)
                                {
                                    var i = 0;
                                    for (i = 0; i < devicefilteredItems[device].gasConsumed.length; i++) {
                                        this.deviceslist[devicegraph].lineChartData[0].data.length = 0;
                                        this.deviceslist[devicegraph].lineChartData[0].data.push({x: devicefilteredItems[device].gasConsumed[i].timestamp, y: Number(( devicefilteredItems[device].gasConsumed[i].value).toFixed(2))});
                                    }
                                }
                            }
                        }
                    }
                }
        }
    }

     updateVehicleLiveData(deviceListItems) {
          console.log('deviceListItems',deviceListItems);

          var totalAvgHr = 0;
          var lowAvgHr = 0;
          var highAvgHr = 0;

          if (deviceListItems && deviceListItems.length > 0) {
              
            var devicefilteredItems = deviceListItems.filter(function(device) { if (device.liveData) return true; });
                console.log('devicefilteredItems',devicefilteredItems);

            if(devicefilteredItems && devicefilteredItems.length > 0)    {
                for (var device in devicefilteredItems) {
                    console.log('gasfilled', devicefilteredItems[device].liveData);
                    if (devicefilteredItems[device].liveData) {
                        totalAvgHr = totalAvgHr + devicefilteredItems[device].liveData.dge_hour;
                    }
                }
                var truckMax = devicefilteredItems.reduce((prev, current) => (prev.liveData.dge_hour > current.liveData.dge_hour) ? prev : current)
                var truckMin = devicefilteredItems.reduce((prev, current) => (prev.liveData.dge_hour < current.liveData.dge_hour) ? prev : current)
                this.topTruckPerformer = truckMax.name;
                this.lowTruckPerformer = truckMin.name;
                this.avgDGEHr = Number((totalAvgHr / devicefilteredItems.length).toFixed(2));
            }
          }
          else
          {
              console.log('No live data in device list items')
          }

        // this.gaugeData.value = Number((livedata.dge.value).toFixed(2));
        // this.distanceData.value = Number((livedata.distance_empty).toFixed(2));
    }

    getDGEData() {
        if (this.deviceslist) {
           console.log('getDGEData',this.dateFilter);
            var today = new Date();
            var startdatetime = new Date(today.getFullYear(), today.getMonth(), today.getDate() - this.dateFilter);
            var enddatetime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            var starttimemilliseconds = startdatetime.getTime() / 1000;
            var vehiclegetDGEDataaliases = '[{"alias":"dge","options": {"sort":"asc", "limit":100, "starttime":' + starttimemilliseconds + '}}]';
            this.requestVehicleDGESent = true;
            this.getDevicesWithAction(vehiclegetDGEDataaliases, 'REQUEST_DEVICES_GASCONSUMED');
        }
    }

    getLiveData() {
        if (this.deviceslist) {
            console.log('getLiveData',this.dateFilter);
            var today = new Date();
            var startdatetime = new Date(today.getFullYear(), today.getMonth(), today.getDate(),today.getHours() - 1);
            var enddatetime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            var starttimemilliseconds = (startdatetime.getTime() / 1000);
            var livetripaliases = '[{"alias":"dge","options": {"sort":"desc", "limit":20, "starttime":' + starttimemilliseconds + '}},{"alias":"ecu","options": {"sort":"desc", "limit":20, "starttime":' + starttimemilliseconds + '}},{"alias":"gas_filled","options": {"sort":"desc", "limit":20, "starttime":' + starttimemilliseconds + '}}]';
            this.requestVehicleLiveSent = true;
            this.getDevicesLiveData(livetripaliases);
        }
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

    onDateChange() 
    {
        this.getVehicleReport();
    }

    componentWillReceiveStateAndActions(nextState, nextActions) {
        console.log("FuelController", nextState);
        if (nextState.devices)
            if (nextState.devices.length) {
                //  console.log("trendscontroller",this.initialized);
                if (!this.initialized) {
                    this.initialized = true;
                    this.deviceListItems = nextState.devices;
                    // console.log("devices trend",this.deviceListItems );
                    if (this.websocketserver)
                        this.websocketserver.initData(nextState.devices);
                    nextState.devices.map((device) => {
                        this.device = device;

                        console.log(device);
                        console.log("device status check");

                        // console.log(device.data.gps[0].value);
                        if (_.keys(device.data).length) {
                            nextActions.subscribeToDevices([device.sn], _.keys(device.data))
                        }
                        if (this.deviceslist)
                            this.deviceslist.push({ name: device.name, type: device.type, lastReported: device.updated,lineChartData : [{
                                                type: 'area',
                                                name: device.name,
                                                data: []
                                            }],
                                rid : device.rid, status: "healthy", onClick: () => this.$state.go('efficiency', {vechicle_id: device.rid}) });
                    })

                     if(this.deviceslist){ 
                        this.VfSharedService.setVechicleData(this.deviceslist);
                    }

                    this.updated = true;

                    //this.UpdateSiteSummary(this.deviceListItems);
                    //this.updateVehicleLiveData(this.deviceListItems)

                    this.getVehicleReport();

                    this.getDGEData();
                    // console.log("trend data", this.devicesTrendData)
                }

                this.updateVehicleLiveData(nextState.devices);

                this.updatedgelivegraph(nextState.devices);

                if (this.requestVehicleReportSent) {

                    console.log("requestVehicleReportSent", nextState.devices)

                    this.requestVehicleReportSent = false;
                    this.updateVehicleReport(nextState.devices);

                }
            }

             if (nextState.alarms) {
                    console.log("alarms", nextState.alarms)
                    if(!this.activityAlarmItems)
                    {
                        this.activityAlarmItems = [];
                    }
                    let newAlarms = _.difference(nextState.alarms, this.activityAlarmItems)
                    if (newAlarms.length) {
                        this.updated = true;
                        newAlarms = newAlarms.map(alarm => {
                            alarm.onClick = () => this.$state.go('device', { product_id: alarm.pid, device_id: alarm.did })
                            return alarm;
                        })
                        this.activityAlarmItems = this.activityAlarmItems.concat(newAlarms);
                    }
                    console.log("alarms", this.activityAlarmItems)
                    this.updatefaultcodes();
            }

        if (this.updated) {
            this.updated = false;
            this.updateResults();
        }


    }

     getCount(group) {
        var count = 0;
        if (this.activityAlarmItems) {
            for (var i = 0; i < this.activityAlarmItems.length; i++) {
                if (this.activityAlarmItems[i].group == group) {
                    count++;
                }
            }
        }
        return count;
    }

    ontimeframeChange() {
        this.initialized = false;
        this.devicesTrendData = [];
        //    this.getDevicesTrend('raw_data', (Date.now() - this.timeframeSelected));
    }

   runMovingLineCharts() {
         this.lineChartData = [{
            name: 'WM-212439',
            type: 'area',
            pointStart: Date.UTC(2016, 0, 1),
            pointInterval: 24 * 36e5,
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9]
        }];

        this.$interval(() => {
          this.lineChartData[0].data.push([choice(_.range(5,10))]);
        }, 1000);

    }
    runGasFilled() {
        this.barchart = true
        this.renderAgain = true;

        this.milesGallonsFilledData = {
            "categories": ['12 Sep', '13 Sep', '14 Sep', '15 Sep', '16 Sep', '17 Sep', '18 Sep'],
            "values": [450, 234, 321, 321, 321, 321, 321]
        }
    }

    runGasUsed() {
        this.barchart = true
        this.renderAgain = true;
        this.milesGallonsUsedData = {
            "categories": ['12 Sep', '13 Sep', '14 Sep', '15 Sep', '16 Sep', '17 Sep', '18 Sep'],
            "values": [443, 322, 323, 542, 322, 112, 232]
        }
    }

    updateResults() {
        if (this.websocketserver)
            this.websocketserver.getDGEFilledperDay();
        if (this.devicesTrendData) {
            this.trendData = [];
            this.devicesTrendData.map((device) => {
                this.device = device;
                console.log("trend results 1", this.device);
                if (this.device1Selected && this.device.sn === this.device1Selected || this.device2Selected && this.device.sn === this.device2Selected) {
                    _.each(device.plotdata, (dataport) => {
                        if (dataport.name === this.dataTypeSelected) {
                            this.trendData.push({
                                name: device.name,
                                data: dataport.data
                            })
                        }
                    })
                }
            })
        }
    }

}
export default FuelController;