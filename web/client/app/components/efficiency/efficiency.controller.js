import * as _ from 'lodash';

class EfficiencyController {
  constructor($timeout, $ngRedux, deviceService, $state, auth, store) {
    "ngInject";

  this.deviceService = deviceService;
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
  

  this.barChartFilters = [
    {"id":1,"value":"Last 10 Days"},
    {"id":2,"value":"Last 20 Days"},
    {"id":3,"value":"Last 25 Days"},
    {"id":4,"value":"Last 30 Days"}
  ];
 this.barChartFiltersValue = "Last 10 Days";

 
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
   runBarMilesGallon(){
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
   }




  filtersValue(params){
    if(params == "MGlasWeek"){
      this.paramsMG = "MGlasWeek";
       this.milesGallonsData = {
       "categories" : ['1 Sep', '2 Sep', '3 Sep','4 Sep', '5 Sep', '6 Sep','7 Sep'],
       "yaxisText" : "Gallons",
       "plotLines" :[{
                    value:150,
                    color: 'green',
                    },{
                    value:350,
                    color: 'red',
                    }
                ],
     "values" : [112, 123, 343,543,123,321,532]}
    } else if(params == "MGcurWeek"){
       this.paramsMG = "MGcurWeek";
       this.milesGallonsData = {
       "categories" : ['8 Sep', '9 Sep', '10 Sep','11 Sep', '12 Sep', '13 Sep','14 Sep'],
       "yaxisText" : "Gallons",
       "plotLines" :[{
                    value:150,
                    color: 'green',
                    },{
                    value:350,
                    color: 'red',
                    }
                ],
     "values" : [213, 324, 432,213,456,123,321]}
    } else if(params == "MGmonthly"){
       this.paramsMG = "MGmonthly";
       this.milesGallonsData = {
       "categories" : ['15 Sep', '16 Sep', '17 Sep','18 Sep', '19 Sep', '20 Sep','21 Sep'],
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
    componentWillReceiveStateAndActions(nextState, nextActions) {


  }
}

export default EfficiencyController;
