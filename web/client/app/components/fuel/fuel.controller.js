import * as _ from 'lodash';
class FuelController {
    constructor($timeout, $ngRedux, deviceService, $state, auth, store, ) {
        "ngInject";
        this.deviceService = deviceService;
        this.headerUrl = require("./maps.jpg");
        this.auth = auth
        this.$timeout = $timeout
        this.$state = $state;
        this.store = store;
        this.unsubscribe = $ngRedux.connect(this.mapStateToThis, this.deviceService)((selectedState, actions) => {
            Object.assign(this, selectedState, actions);
        });
        this.runBarchart();
        this.runFuelGuage();
        this.runSlider();
        this.$timeout = $timeout;
        
        this.paramsGU = "GUcurWeek";

        function loadAfterAuthed(vm) {
            if (vm.auth.isAuthenticated && vm.store.get("token")) {
                vm.getDevices({
                    limit: 10
                });
             //   vm.getDevicesTrend('raw_data', (Date.now() - vm.timeframeSelected));
            } else {
                if (self.Timer) $timeout.cancel(self.Timer);
                self.Timer = vm.$timeout(() => loadAfterAuthed(vm), 50);
            }
        }
        loadAfterAuthed(this);
        this.ontimeframeChange();
        this.refreshTrendData();


    this.sortType     = 'name'; // set the default sort type
    this.sortReverse  = false;  // set the default sort order
    this.searchFish   = '';     // set the default search/filter term
  
    // create the list of sushi rolls 
    this.sushi = [
        { name: 'BH-1', fish: '30mbh', tastiness: "Los Angeles, CA" },
        { name: 'BH-56', fish: '18mbh', tastiness: "Oxnard, CA" },
        { name: 'BH-45', fish: '28mbh', tastiness: "ButtonWillow,CA" },
        { name: 'BH-98', fish: '15mbh', tastiness: "Los Angeles, CA" },
        { name: 'BH-45', fish: '28mbh', tastiness: "ButtonWillow,CA" },
        { name: 'BH-98', fish: '15mbh', tastiness: "Los Angeles, CA" },
        { name: 'BH-56', fish: '18mbh', tastiness: "Oxnard, CA" },        
        { name: 'BH-45', fish: '28mbh', tastiness: "ButtonWillow,CA" },
    ];

 }




 

    runSlider() {
        this.color = 76;
        this.minvalue = 0;
        this.maxvalue = 100;
    }

    refreshTrendData() {
        // console.log(this.device1Selected)
        // console.log(this.device2Selected)
        this.updateResults();
    }

    ontimeframeChange() {
        this.initialized = false;
        this.devicesTrendData = [];
    //    this.getDevicesTrend('raw_data', (Date.now() - this.timeframeSelected));
    }

    runBarchart() {
        this.barchart = true
        this.renderAgain = true;

          this.milesGallonsData = {
       "categories" : ['12 Sep', '13 Sep', '14 Sep','15 Sep', '16 Sep', '17 Sep','18 Sep'],
       "yaxisText" : "Gallons",
       "plotLines" :[{
                    value:150,
                    color: 'green',
                    },{
                    value:350,
                    color: 'red',
                    }
                ],
     "values" : [450, 234, 321,321,321,321,321]}


        //  this.barData = {
        //         "series": [{
        //             name: 'WM-212330',
        //             data: [167, 143],
        //             categories: ['1 sep', '22 sep'] }]
        //         // }, {
        //         //     name: 'WM-212439',
        //         //     data: [12, 123, 34, 12, 23,45, 53, 12, 12, 12,34, 34, 12, 34],
        //         //     categories: [1, 2, 3, 4, 5,7.8,9,10,12,13,14,15],
        //         // }]
        //     }
    }

    filtersValue(params) {
        if (params == "lasWeek") {
            this.paramsGU = "GUlasWeek";
               this.milesGallonsData = {
       "categories" : ['12 Sep', '13 Sep', '14 Sep','15 Sep', '16 Sep', '17 Sep','18 Sep'],
       "yaxisText" : "Gallons Filled ",
       "plotLines" :[{
                    value:150,
                    color: 'green',
                    },{
                    value:350,
                    color: 'red',
                    }
                ],
     "values" : [450, 234, 321,321,321,321,321]}
        } else if (params == "preWeek") {
             this.paramsGU = "GUcurWeek";
              this.milesGallonsData = {
       "categories" : ['19 Sep', '20 Sep', '21 Sep','22 Sep', '23 Sep', '24 Sep','25 Sep'],
       "yaxisText" : "Gallons Used",
       "plotLines" :[{
                    value:150,
                    color: 'green',
                    },{
                    value:350,
                    color: 'red',
                    }
                ],
     "values" : [123, 211, 456,321,121,432,123]}
        } else if (params == "monthly") {
                this.paramsGU = "GUmonthly";
              this.milesGallonsData = {
       "categories" : ['26 Sep', '27 Sep', '28 Sep','29 Sep', '30 Sep', '1 oct','2 oct'],
       "yaxisText" : "Gallons",
       "plotLines" :[{
                    value:150,
                    color: 'green',
                    },{
                    value:350,
                    color: 'red',
                    }
                ],
     "values" : [450, 234, 321,321,321,321,321]}
        }
    }

    runFuelGuage() {
        this.moons = true
        this.max = 200
        this.min = this.min
        this.gaugeData = {
            "max": this.max,
            "min": this.min,
            "value": 120
        }
    }

    componentWillReceiveStateAndActions(nextState, nextActions) {
        if (nextState.devices.length) {
            //  console.log("trendscontroller",this.initialized);
            if (!this.initialized) {
                this.initialized = true;
                this.deviceListItems = nextState.devices;
                // console.log("devices trend",this.deviceListItems );
                nextState.devices.map((device) => {
                    this.device = device;
                    console.log(JSON.stringify(this.device));
                    if (_.keys(device.data).length) {
                        nextActions.subscribeToDevices([device.sn], _.keys(device.data))
                    }
                    this.plotData = [];
                    _.each(PLOT_DATAPORTS, (dataport) => {
                        // console.log("device data" + this.device.data[dataport]);
                        // console.log("devicecontroller" +dataport + JSON.stringify(this.device.data));
                        if (this.device.data[dataport]) {
                            this.plotData.push({
                                name: dataport,
                                data: this.plotFromData(this.device.data[dataport])
                            })
                        }
                    })

                    this.devicesTrendData.push({
                        name: this.device.name,
                        sn: this.device.sn,
                        plotdata: this.plotData
                    })
                })
                this.updated = true;
                // console.log("trend data", this.devicesTrendData)
            }
        }

        if (this.updated) {
            this.updated = false;
            this.updateResults();
        }
    }

    updateResults() {
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