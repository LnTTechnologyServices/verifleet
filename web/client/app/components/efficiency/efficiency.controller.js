import * as _ from 'lodash';

function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

class EfficiencyController {
    constructor($timeout, $ngRedux, deviceService, $state, auth, store, $stateParams, $rootScope, $scope, websocketserver, VfSharedService, $interval) {
        "ngInject";

        this.deviceService = deviceService;
        this.vechicle_id = $stateParams.vechicle_id;
        this.$rootScope = $rootScope;
        this.auth = auth;
        this.$scope = $scope;
        this.$timeout = $timeout
        this.VfSharedService = VfSharedService;
        this.$state = $state;
        this.store = store;
        this.$interval = $interval;
        this.websocketserver = websocketserver;
        this.unsubscribe = $ngRedux.connect(this.mapStateToThis, this.deviceService)((selectedState, actions) => {
            this.componentWillReceiveStateAndActions(selectedState, actions);
            Object.assign(this, selectedState, actions);
        });

        this.activityAlarmItems = [];
        this.requestVehicleReportSent = false;
        this.requestVehicleDGESent = false;
        this.requestVehicleLiveSent = false;
        if (this.VfSharedService.getVechicleData().length > 0) {
            this.vehicleFilterList = this.VfSharedService.getVechicleData();
        } else {
            this.vehicleFilterList = [];
        }

        this.distancetoEmpty = 0;
        // this.websocketserver.validate();
        // this.websocketserver.get();

        this.currentDate = Math.floor(new Date() / 1000);
        //alert(this.currentDate);
        let yestDate = new Date();
        yestDate.setDate(yestDate.getDate() - 1);
        this.yestDate = Math.floor(yestDate / 1000);
        let last15Days = new Date();
        this.last15Days = new Date().setDate(new Date().getDate() - 15);
        this.last15Days = Math.floor(last15Days / 1000);

        this.paramsMG = "MGcurWeek"
        this.devicelistaliases = '[{"alias":"gps","options": {"sort":"desc", "limit":1 }}]';
        this.deviceId = this.vechicle_id;
        this.dateFilterList = [{ "id": 5, "value": "Last 5 Days" },
            { "id": 10, "value": "Last 10 Days" },
            { "id": 15, "value": "Last 15 Days" },
            { "id": 20, "value": "Last 20 Days" }
        ];

        this.dateFilter = 5
        this.vehicleFilter = this.vechicle_id;
        this.lineChartData = [{
            showInLegend: false,
            type: 'area',
            name: this.vechicle_id,
            data: []
        }];
        
        this.initializeBarChart();
        this.initializeFuelGuage();
        this.initializeDistancetoEmpty();

        function loadAfterAuthed(vm) {
            if (vm.auth.isAuthenticated && vm.store.get("token")) {
                if (vm.vehicleFilterList.length == 0) {
                    vm.getDevices(vm.devicelistaliases);
                }
            } else {
                if (self.Timer) $timeout.cancel(self.Timer);
                self.Timer = vm.$timeout(() => loadAfterAuthed(vm), 50);
            }
        }
        loadAfterAuthed(this);

        var today = new Date();
        
        if(this.vehicleFilterList.length != 0 && this.vechicle_id != 0)
        {
            this.getLiveData();
        }

        if(this.vehicleFilterList.length != 0 && this.vechicle_id != 0)
        {
            this.getlasttripdata();
        }

        if(this.vehicleFilterList.length != 0 && this.vechicle_id != 0)
        {
            this.getDGEData();
        }

        if(this.vehicleFilterList.length != 0 && this.vechicle_id != 0)
        {
            this.getVehicleReport();
        }
    }

    getlasttripdata() {
        if (this.vechicle_id && this.vehicleFilterList) {
             console.log('getlasttripdata');
            var today = new Date();
            var startdatetime = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
            var enddatetime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            var starttimemilliseconds = startdatetime.getTime() / 1000;
            var endtimemilliseconds = (enddatetime.getTime() / 1000);
            endtimemilliseconds = endtimemilliseconds - 1;
            console.log('starttimemilliseconds', starttimemilliseconds);
            console.log('endtimemilliseconds', endtimemilliseconds);
            var lasttripaliases = '[{"alias":"dge","options": {"sort":"asc", "limit":300, "starttime":' + starttimemilliseconds + ', "endtime":' + endtimemilliseconds + '}},{"alias":"ecu","options": {"sort":"asc", "limit":300, "starttime":' + starttimemilliseconds + ', "endtime":' + endtimemilliseconds + '}},{"alias":"gas_filled","options": {"sort":"asc", "limit":300, "starttime":' + starttimemilliseconds + ', "endtime":' + endtimemilliseconds + '}}]';
            this.getDeviceslasttrip(this.vechicle_id, lasttripaliases);
        }
    }

    getVehicleReport() {
        if (this.vechicle_id && this.vehicleFilterList) {
            console.log('getVehicleReport',this.dateFilter);
            var today = new Date();
            var startdatetime = new Date(today.getFullYear(), today.getMonth(), today.getDate() - this.dateFilter);
            var enddatetime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            var starttimemilliseconds = startdatetime.getTime() / 1000;
            var vehiclereportaliases = '[{"alias":"gas_filled","options": {"sort":"desc", "limit":1000, "starttime":' + starttimemilliseconds + '}}]';
            this.requestVehicleReportSent = true;
            this.readDeviceWithAction(this.vechicle_id, vehiclereportaliases, 'REQUEST_DEVICE_GASFILLED');
        }
    }

    updateVehicleReport(devicename, dgeFilled) {
        console.log('updateVehicleReport', dgeFilled);
        var milesGallonsDataTemp = {
                            "categories": [],
                            "plotLines": [{
                                value: 150,
                                color: 'green',
                            }, {
                                value: 350,
                                color: 'red',
                            }],
                            "name": devicename,
                            "data": []
        };

        var arraySelection = [];
        for (var i = 0; i < dgeFilled.length; i++) {
            var currentDate = new Date(this.convertDate(dgeFilled[i].timestamp));
            var startOfDay = new Date(dgeFilled[i].timestamp);
            startOfDay.setUTCHours(0,0,0,0);
            arraySelection.push({categories: startOfDay.getTime(),data:(Number((dgeFilled[i].value).toFixed(2)))}); 
        }
                      
        var result = [];
        arraySelection.reduce(function (res, value) {
            if (!res[value.categories]) {
                res[value.categories] = {
                data: 0,
                categories: value.categories
                };
                result.push(res[value.categories])
            }
            res[value.categories].data += value.data
            return res;
        }, {});

        for (var i = 0; i < result.length; i++) {
                console.log("dgeFilled.length");
                console.log(result.length);
                milesGallonsDataTemp.categories.push(result[i].categories);
                milesGallonsDataTemp.data.push(Number((result[i].data).toFixed(2)));
            }

        console.log(milesGallonsDataTemp);
        console.log("milesGallonsDataTemp");
        // console.log(result);
        // console.log("result");



        // for (var i = 0; i < dgeFilled.length; i++) {
        //     milesGallonsDataTemp.categories.push( this.convertDate(dgeFilled[i].timestamp));
        //     milesGallonsDataTemp.data.push(Number((dgeFilled[i].value).toFixed(2)));
        // }

        this.milesGallonsData = [milesGallonsDataTemp];

    }

    updatefaultcodes() {
        this.red_stop_lamp_status = this.getCount('red_stop_lamp_status');
        if (this.activityAlarmItems) {
            this.faultCode = this.activityAlarmItems.length;
        }
    }

     updateVehicleLiveData(livedata) {

        if(livedata)
        {
            console.log('updateVehicleLiveData',livedata);
            this.liveDGEHrs = livedata.dge_hour;
            if(livedata.dge)
            {
                this.gaugeData = {} ;
                this.gaugeData = {
                                "max": 60,
                                "min": 0,
                                "value": Number((livedata.dge.value).toFixed(2))
                            }

                this.gaugeData.value = Number((livedata.dge.value).toFixed(2));

            }
            this.distancetoEmpty = Number((livedata.distance_empty).toFixed(2));

             this.distancetoProgress = Number(120 - (livedata.distance_empty).toFixed(2));
            
            //this.gaugeData.value.push(this.gaugeData.value);
        }
    }

    getDGEData() {
        if (this.vechicle_id && this.vehicleFilterList) {
            console.log('getDGEData',this.dateFilter);
            var today = new Date();
            var startdatetime = new Date(today.getFullYear(), today.getMonth(), today.getDate() - this.dateFilter);
            var enddatetime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            var starttimemilliseconds = startdatetime.getTime() / 1000;
            var vehiclegetDGEDataaliases = '[{"alias":"dge","options": {"sort":"desc", "limit":1000, "starttime":' + starttimemilliseconds + '}}]';
            this.requestVehicleDGESent = true;
            this.readDeviceWithAction(this.vechicle_id, vehiclegetDGEDataaliases, 'REQUEST_DEVICE_GASCONSUMED');
        }
    }

    getLiveData() {
        if (this.vechicle_id && this.vehicleFilterList) {
            console.log('getLiveData',this.dateFilter);
            var today = new Date();
            var startdatetime = new Date(today.getFullYear(), today.getMonth(), today.getDate(),today.getHours() - 1);
            var enddatetime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            var starttimemilliseconds = (startdatetime.getTime() / 1000);
           
            // var livetripaliases = '[{"alias":"dge","options": {"sort":"desc", "limit":20, "starttime":' + starttimemilliseconds + '}},{"alias":"ecu","options": {"sort":"desc", "limit":20, "starttime":' + starttimemilliseconds + '}},{"alias":"gas_filled","options": {"sort":"desc", "limit":20, "starttime":' + starttimemilliseconds + '}}]';

            var livetripaliases = '[{"alias":"dge","options": {"sort":"desc", "limit":13}},{"alias":"ecu","options": {"sort":"desc", "limit":13}},{"alias":"gas_filled","options": {"sort":"desc", "limit":13}}]';   

            console.log('getlivedata', livetripaliases);
            this.requestVehicleLiveSent = true;
            this.readDeviceLiveData(this.vechicle_id, livetripaliases);
        }
    }

    // Which part of the Redux global state does our component want to receive?
    mapStateToThis(state) {
        const devices = state.devices;
        const alarms = state.alarms;
        const lasttrip = state.lasttrip;
        const activities = state.activities;
        const isLoading = state.isLoading;
        const websocket = state.websocket;
        return {
            alarms,
            activities,
            devices,
            lasttrip,
            isLoading,
            websocket
        };
    }

    onvehicleChange() {
        this.vechicle_id = this.vehicleFilter;
        this.initialized = false;
        this.getLiveData();
        this.getlasttripdata();
        this.getVehicleReport();
        this.getDGEData();
    };

    onDateChange() 
    {
        this.getVehicleReport();
    }

    runMovingLineChart() {
         this.lineChartData = [{
            showInLegend: false, 
            name: 'VM-121',
            type: 'area',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9]
        }];

        this.$interval(() => {
          this.lineChartData[0].data.push([choice(_.range(5,10))]);
        }, 1000);

    }

    initializeFuelGuage() {
        this.moons = true
        this.gaugeData = {
                "max": 60,
                "min": 0,
                "value": 0,
            }
    }

    initializeDistancetoEmpty() {
        this.distanceData = {
            "max": this.max,
            "min": this.min,
            "value": 0
        }
    }

    //Miiles/Gallon
    initializeBarChart() {
        this.milesGallonsData = [{
            "categories": [],
            "yaxisText": "Gallons",
            "plotLines": [{
                value: 150,
                color: 'green',
            }, {
                value: 350,
                color: 'red',
            }],
            "data": []
        }]
    }

    componentWillReceiveStateAndActions(nextState, nextActions) {
         console.log("EfficiencyController", nextState)
        // console.log("EfficiencyController", nextActions)
        // console.log("STATE", JSON.stringify(nextState.websocket));
        if (nextState.devices)
            if (nextState.devices.length) {
                //  console.log("trendscontroller",this.initialized);
                //this.websocketserver.initData(nextState.devices);

                if (!this.initialized) {
                    this.initialized = true;
                    this.deviceListItems = nextState.devices;
                    console.log("devices:", this.deviceListItems);

                    if (this.vehicleFilterList && this.vehicleFilterList.length == 0) {
                        nextState.devices.map((device) => {
                            this.device = device;
                            if (_.keys(device.data).length) {
                                nextActions.subscribeToDevices([device.sn], _.keys(device.data))
                            }

                            this.vehicleFilterList.push({ name: device.name, type: device.type, location: device.data.gps[0].value, rid: device.rid });
                        })
                        this.updated = true;
                    }

                    this.getLiveData();

                    this.getlasttripdata();
                    
                    this.getVehicleReport();

                    this.getDGEData();
                }

                if(this.requestVehicleLiveSent)
                {
                    console.log("requestVehicleLiveSent", nextState.devices);

                    for (var i = 0; i < nextState.devices.length; i++) {
                        if (nextState.devices[i].rid == this.vechicle_id) {
                            console.log("Got it requestVehicleLiveSent", nextState.devices[i].liveData)
                            if (nextState.devices[i].liveData) {
                                this.requestVehicleLiveSent = false;
                                this.updateVehicleLiveData(nextState.devices[i].liveData);
                            }
                            break;
                        }
                    }
                }

                if (this.requestVehicleReportSent) {

                    console.log("requestVehicleReportSent", nextState.devices)

                    for (var i = 0; i < nextState.devices.length; i++) {
                        if (nextState.devices[i].rid == this.vechicle_id) {

                            console.log("Got it", nextState.devices[i].gasFilled)
                            if (nextState.devices[i].gasFilled) {
                                this.requestVehicleReportSent = false;
                                this.updateVehicleReport(nextState.devices[i].name, nextState.devices[i].gasFilled);
                            }
                            break;
                        }
                    }
                }

                if (this.requestVehicleDGESent) {

                    console.log("requestVehicleDGESent", nextState.devices)

                    for (var i = 0; i < nextState.devices.length; i++) {
                        if (nextState.devices[i].rid == this.vechicle_id) {

                            console.log("Got it", this.vechicle_id)
                            console.log("Got it", nextState.devices[i].gasConsumed)
                            if (nextState.devices[i].gasConsumed) {
                                this.requestVehicleDGESent = false;
                                this.updatedgelivegraph(nextState.devices[i].gasConsumed);
                            }
                            break;
                        }
                    }
                }
            }

        if (nextState.lasttrip) {
            this.engineHours = nextState.lasttrip.enginehours;
            this.milesDriven = nextState.lasttrip.milesdriven;
            this.DGEHrs = nextState.lasttrip.dge_hr;
            this.totalGasUsed = nextState.lasttrip.totalgasused;
            
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

        // if (this.updated) {
        this.updated = false;
        //this.updateResults();
        // }
        // if (nextState.websocket) {

        //     console.log("Websockeettt",nextState.websocket)
        //     if (nextState.websocket.alias == 10) // 10 : test(alias)
        //         if (this.distanceData)
        //             this.distanceData.value = nextState.websocket.data; // * average_fuel_economy
        //     if (this.gaugeData)
        //         this.gaugeData.value = nextState.websocket.data;
        //     if (this.lineChartData)
        //         if (this.lineChartData.data) {
        //            // this.lineChartData.data.push(nextState.websocket.data);
        //         }
        //     console.log("SUCCESS" + JSON.stringify(nextState.websocket));
        // }
        // if (this.lineChartData)
        //     if (this.lineChartData.data) {
        //        // this.lineChartData.data.push(12);
        //     }
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

    updatedgelivegraph(dgeCollection)
    {    
        console.log('updatedgelivegraph', dgeCollection);
        this.lineChartData[0].data.length = 0;
        var i = 0;
        for (i = 0; i < dgeCollection.length; i++) {
            this.lineChartData[0].data.push({x:dgeCollection[i].timestamp, y: Number((dgeCollection[i].value).toFixed(2))});
        }

         console.log(' this.lineChartData.data',  this.lineChartData.data);
    }

    convertDate(unix_timestamp) {
        var a = new Date(unix_timestamp);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
    }

    updateResults() {

        if (this.deviceListItems)
            var deviceNew = this.deviceListItems.find(function(x) {
                return x.name == this.vechicle_id;
            }, this);
        if (deviceNew && this.milesGallonsData) {
            // this.milesGallonsData.values = [];
            // this.milesGallonsData.categories = [];
            // if (device.name == this.vechiscle_id) {
            var i = 0;
            // if (deviceNew.data.dge) {
            //     for (i = 0; i < deviceNew.data.dge.length; i++) {
            //         this.milesGallonsData.categories.push(this.convertDate(deviceNew.data.dge[i].timestamp));
            //         this.milesGallonsData.values.push(Number((deviceNew.data.dge[i].value).toFixed(2)));
            //         if ((deviceNew.data.dge.length - 1) === i) {
            //             this.displayData = true;
            //         }
            //     }
            // }

        }

        if (this.gaugeData) {
            this.runFuelGuage();
            // alert(this.websocketserver.getDGE(this.vechicle_id));
            // this.gaugeData.value = this.websocketserver.getDGE(this.vechicle_id);
        }

        this.runDistancetoEmpty();
        /*this.engineHours = this.websocketserver.getEngineHours(this.vechicle_id);
        this.milesDriven = this.websocketserver.getMilesDriven(this.vechicle_id);
        this.DGEHrs = this.websocketserver.getDGEperHours(this.vechicle_id);
        this.faultCode = this.websocketserver.getFaultCode(this.vechicle_id);
        this.totalGasUsed = this.websocketserver.getTotalGasUsed(this.vechicle_id);
        this.last15DaysGasFilled = this.websocketserver.getGasFilled(this.vechicle_id, 5);
        if (this.milesGallonsData)
            for (i = 0; i < this.last15DaysGasFilled.length; i++) {
                this.milesGallonsData.categories.push(this.last15DaysGasFilled[i].timestamp);
                this.milesGallonsData.values.push(Math.round(this.last15DaysGasFilled[i].value));
            }*/
    }

    convertDate(unix_timestamp) {
        var a = new Date(unix_timestamp);
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
         var days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        var year = a.getFullYear();
        var month = months[a.getMonth()];
        var date = a.getDate();
        var hour = a.getHours();
        var min = a.getMinutes();
        var sec = a.getSeconds();
        var day = days[a.getDay()];
        var time = date + ' ' + month + ' ' + year  + '/' + day;
      //  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
        return time;
    }
}

export default EfficiencyController;