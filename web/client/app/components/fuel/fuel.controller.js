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

        function loadAfterAuthed(vm) {
            if (vm.auth.isAuthenticated && vm.store.get("token")) {
                vm.getDevices(vm.aliases);
            } else {
                if (self.Timer) $timeout.cancel(self.Timer);
                self.Timer = vm.$timeout(() => loadAfterAuthed(vm), 50);
            }
        }

        loadAfterAuthed(this);

        this.runGasFilled();
        this.runGasUsed();
        this.ontimeframeChange();
        this.runMovingLineCharts();

        this.sortType = 'name'; // set the default sort type
        this.sortReverse = false; // set the default sort order
        this.searchFish = ''; // set the default search/filter term

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
    componentWillReceiveStateAndActions(nextState, nextActions) {
        // alert(JSON.stringify(nextState.devices));
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
                        // _.each(this.device, function(dev) {
                            this.deviceslist.push({ name: device.name, type: device.type, lastReported: device.updated,
                                rid : device.rid, status: "healthy", onClick: () => this.$state.go('efficiency', {vechicle_id: device.rid}) });

                            
                        // }, this);
                        // this.plotData = [];
                        // _.each(PLOT_DATAPORTS, (dataport) => {
                        //     // console.log("device data" + this.device.data[dataport]);
                        //     // console.log("devicecontroller" +dataport + JSON.stringify(this.device.data));
                        //     if (this.device.data[dataport]) {
                        //         this.plotData.push({
                        //             name: dataport,
                        //             data: this.plotFromData(this.device.data[dataport])
                        //         })
                        //     }
                        // })

                        // this.devicesTrendData.push({
                        //     name: this.device.name,
                        //     sn: this.device.sn,
                        //     plotdata: this.plotData
                        // })
                    })

                     if(this.deviceslist){ 
                        this.VfSharedService .setVechicleData(this.deviceslist);
                    }

                    this.updated = true;
                    // console.log("trend data", this.devicesTrendData)
                }
            }

        if (this.updated) {
            this.updated = false;
            this.updateResults();
        }


    }

    // refreshTrendData() {
    //     // console.log(this.device1Selected)
    //     // console.log(this.device2Selected)
    //     this.updateResults();
    // }

    ontimeframeChange() {
        this.initialized = false;
        this.devicesTrendData = [];
        //    this.getDevicesTrend('raw_data', (Date.now() - this.timeframeSelected));
    }

   runMovingLineCharts() {
         this.lineChartData = [{
            name: 'VM-121',
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