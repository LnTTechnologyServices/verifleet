import * as _ from 'lodash';

class EfficiencyController {
    constructor($timeout, $ngRedux, deviceService, $state, auth, store, $stateParams) {
        "ngInject";

        this.deviceService = deviceService;
        this.vechicle_id = $stateParams.vechicle_id;
        console.log("VEHICLE:" + this.vechicle_id);

        this.auth = auth
        this.$timeout = $timeout
        this.$state = $state;
        this.store = store;
        this.unsubscribe = $ngRedux.connect(this.mapStateToThis, this.deviceService)((selectedState, actions) => {
            this.componentWillReceiveStateAndActions(selectedState, actions);
            Object.assign(this, selectedState, actions);
        });

        this.runBarMilesGallon();
        this.runFuelGuage();

        //this.runCommonFunction();
        this.paramsMG = "MGcurWeek"
        this.aliases = '[{"alias":"gps","options": {"sort":"desc", "limit":1 }}, { "alias": "dge", "options": { "sort": "desc", "limit": 5 } }]';

        this.deviceId = this.vechicle_id;
        //'WM-212438'; // Update on navigation
        this.barChartFilters = [
            { "id": 1, "value": "Last 10 Days" },
            { "id": 2, "value": "Last 20 Days" },
            { "id": 3, "value": "Last 25 Days" },
            { "id": 4, "value": "Last 30 Days" }
        ];
        this.barChartFiltersValue = "Last 10 Days";

        this.lineChartData = [{
            name: 'VM-121',
            type: 'area',
            pointStart: Date.UTC(2016, 0, 1),
            pointInterval: 24 * 36e5,
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9]
        }];

        this.summaryList = ["Last 5 days", "Last 10 days", "Last 15 days", "Last 30 days"];
        this.vehicleList = ["VM-121", "VM-754", "VM-456", "VM-232"];
        this.dgeList = ["Last 5 days", "Last 10 days", "Last 15 days", "Last 30 days"];
        this.timeList = ["Last 5 days", "Last 10 days", "Last 15 days", "Last 30 days"];

        function loadAfterAuthed(vm) {
            if (vm.auth.isAuthenticated && vm.store.get("token")) {
                vm.getDevices(vm.aliases);
            } else {
                if (self.Timer) $timeout.cancel(self.Timer);
                self.Timer = vm.$timeout(() => loadAfterAuthed(vm), 50);
            }
        }
        loadAfterAuthed(this);
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
    runFuelGuage() {
        this.moons = true
        this.max = 60
        this.min = 0
        this.gaugeData = {
            "max": this.max,
            "min": this.min,
            "value": 45
        }
    }


    //Miiles/Gallon
    runBarMilesGallon() {
        this.milesGallonsData = {
            "categories": [],
            "yaxisText": "Gallons",
            "plotLines": [{
                value: 150,
                color: 'green',
            }, {
                value: 350,
                color: 'red',
            }],
            "values": []
        }
    }




    filtersValue(params) {
        if (params == "MGlasWeek") {
            this.paramsMG = "MGlasWeek";
            this.milesGallonsData = {
                "categories": ['1 Sep', '2 Sep', '3 Sep', '4 Sep', '5 Sep', '6 Sep', '7 Sep'],
                "yaxisText": "Gallons",
                "plotLines": [{
                    value: 150,
                    color: 'green',
                }, {
                    value: 350,
                    color: 'red',
                }],
                "values": [112, 123, 343, 543, 123, 321, 532]
            }
        } else if (params == "MGcurWeek") {
            this.paramsMG = "MGcurWeek";
            this.milesGallonsData = {
                "categories": ['8 Sep', '9 Sep', '10 Sep', '11 Sep', '12 Sep', '13 Sep', '14 Sep'],
                "yaxisText": "Gallons",
                "plotLines": [{
                    value: 150,
                    color: 'green',
                }, {
                    value: 350,
                    color: 'red',
                }],
                "values": [213, 324, 432, 213, 456, 123, 321]
            }
        } else if (params == "MGmonthly") {
            this.paramsMG = "MGmonthly";
            this.milesGallonsData = {
                "categories": ['15 Sep', '16 Sep', '17 Sep', '18 Sep', '19 Sep', '20 Sep', '21 Sep'],
                "yaxisText": "Gallons",
                "plotLines": [{
                    value: 150,
                    color: 'green',
                }, {
                    value: 350,
                    color: 'red',
                }],
                "values": [450, 234, 321, 321, 321, 321, 321]
            }
        }


    }
    componentWillReceiveStateAndActions(nextState, nextActions) {
        console.log("LOADED")
            // alert(JSON.stringify(nextState.devices));
        if (nextState.devices)
            if (nextState.devices.length) {
                //  console.log("trendscontroller",this.initialized);
                if (!this.initialized) {
                    this.initialized = true;
                    this.deviceListItems = nextState.devices;
                    // console.log("devices trend",this.deviceListItems );
                    nextState.devices.map((device) => {
                        this.device = device;
                        if (_.keys(device.data).length) {
                            nextActions.subscribeToDevices([device.sn], _.keys(device.data))
                        }
                        if (this.milesGallonsData) {
                            if (device.name == this.vechicle_id) {
                                var i = 0;
                                console.log("Done");
                                for (i = 0; i < device.data.dge.length; i++) {
                                    this.milesGallonsData.categories.push(this.convertDate(device.data.dge[i].timestamp));
                                    this.milesGallonsData.values.push(device.data.dge[i].value);
                                }
                            }
                        }
                    })
                    this.updated = true;
                    // console.log("trend data", this.devicesTrendData)
                }
            }

            // if (this.updated) {
        this.updated = false;
        this.updateResults();
        // }
    }
    updateResults() {
        if (this.deviceListItems)
            var deviceNew = this.deviceListItems.find(function(x) {
                return x.name == this.vechicle_id;
            }, this);
        console.log("result" + JSON.stringify(deviceNew));
        if (deviceNew && this.milesGallonsData) {
            this.milesGallonsData.values = [];
            this.milesGallonsData.categories = [];
            // if (device.name == this.vechiscle_id) {
            var i = 0;
            console.log("Done");
            for (i = 0; i < deviceNew.data.dge.length; i++) {
                this.milesGallonsData.categories.push(this.convertDate(deviceNew.data.dge[i].timestamp));
                this.milesGallonsData.values.push(deviceNew.data.dge[i].value);
            }
            // }
        }
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
}

export default EfficiencyController;