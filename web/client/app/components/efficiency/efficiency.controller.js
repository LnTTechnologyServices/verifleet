import * as _ from 'lodash';

class EfficiencyController {
    constructor($timeout, $ngRedux, deviceService, $state, auth, store, $stateParams, $rootScope,$scope,) {
        "ngInject";

        this.deviceService = deviceService;
        this.vechicle_id = $stateParams.vechicle_id;
        this.$rootScope = $rootScope;
        this.auth = auth;
        this.$scope = $scope;
        this.$timeout = $timeout
        this.$state = $state;
        this.store = store;
        this.unsubscribe = $ngRedux.connect(this.mapStateToThis, this.deviceService)((selectedState, actions) => {
            this.componentWillReceiveStateAndActions(selectedState, actions);
            Object.assign(this, selectedState, actions);
        });


        //this.runCommonFunction();
        this.paramsMG = "MGcurWeek"
        this.aliases = '[{"alias":"gps","options": {"sort":"desc", "limit":1 }}, { "alias": "dge", "options": { "sort": "desc", "limit": 5 } }]';

        this.deviceId = this.vechicle_id;
        //'WM-212438'; // Update on navigation

        this.lineChartData = [{
            name: 'VM-121',
            type: 'area',
            pointStart: Date.UTC(2016, 0, 1),
            pointInterval: 24 * 36e5,
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9]
        }];

        this.dateFilterList = [{"id": 5, "value": "Last 5 Days" },
            {"id": 10, "value": "Last 10 Days" },     
            {"id": 15, "value": "Last 15 Days" },   
            {"id": 20, "value": "Last 20 Days" }];

        this.vehicleFilterList = ["WM-212438", "WM-212439", "WM-212440", "WM-212441", "WM-212442"];

        this.dateFilter = 5
        this.vehicleFilter = this.vechicle_id;


        function loadAfterAuthed(vm) {
            if (vm.auth.isAuthenticated && vm.store.get("token")) {
                vm.getDevices(vm.aliases);
            } else {
                if (self.Timer) $timeout.cancel(self.Timer);
                self.Timer = vm.$timeout(() => loadAfterAuthed(vm), 50);
            }
        }
        loadAfterAuthed(this);

        this.runBarMilesGallon();
        this.runFuelGuage();
        this.runDistancetoEmpty();
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

   onvehicleChange(){
        this.vechicle_id = this.vehicleFilter;
        this.initialized = false;
        this.getDevices(this.aliases);
};

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

     runDistancetoEmpty() {
        this.distanceData = {
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
                                console.log("Done", this.vechicle_id);
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
        if (deviceNew && this.milesGallonsData) {
            this.milesGallonsData.values = [];
            this.milesGallonsData.categories = [];
            // if (device.name == this.vechiscle_id) {
            var i = 0;
            if(deviceNew.data.dge){    
                for (i = 0; i < deviceNew.data.dge.length; i++) {
                    this.milesGallonsData.categories.push(this.convertDate(deviceNew.data.dge[i].timestamp));
                    this.milesGallonsData.values.push( Number((deviceNew.data.dge[i].value).toFixed(2)));
                    if((deviceNew.data.dge.length - 1) === i){ 
                        this.displayData = true;
                    } 
                }
             }

                this.config = {
                        options: {
                                chart: {
                                    renderTo: 'container',
                                    type: 'column'
                                },
                                title: {
                                    text: null
                                },
                                xAxis: {
                                    categories: this.milesGallonsData.categories
                                },
                                yAxis: {
                                    title: {
                                    text: null
                                }
                                },
                                legend: {
                                enabled: false
                            },
                                plotOptions: {
                                        series: {
                                            dataLabels: {
                                                enabled: true,
                                                style: {
                                                    color: '#fff'
                                                }
                                            }
                                        }
                            },
                        },
                        series: [{
                                    name: null,
                                    data: this.milesGallonsData.values, color: 'rgb(149, 206, 255)'
                                }]
                };
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