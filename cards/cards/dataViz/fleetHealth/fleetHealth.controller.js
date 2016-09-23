class FleetHealthController {
  constructor() {
    this.name = 'fleetHealth';

    // TODO: implement ionic switch in provider
    this.isIonic = !!window.ionic;
    this.infoOverlayHidden = true;

    console.log("this.warningLabel: ", this.warningLabel);

    this.normalStatus = {
      name: 'normal',
      label: this.normalLabel || 'Normal'
    };

    this.alarmStatus = {
      name: 'alarm',
      label: this.alarmLabel || 'Alarm'
    };

    this.warningStatus = {
      name: 'warning',
      label: this.warningLabel || 'Warning'
    };

    this.activeStatus = this.normalStatus;
    var self = this;

    // this.data is expected to be an object with the following structure (for example):
    // {
    //   "total": 40,
    //   "normal": 15,
    //   "warning": 5,
    //   "alarm": 20
    // }
    this.fleetHealthData = this.createChartData(this.data);

    this.chartConfig = {
        loading: false,
        options: {
          chart: {
            backgroundColor: 'transparent',
            type: 'pie',
          },
          colors: [{
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, '#E54538'],
              [1, '#B21205'],
            ]
          }, {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, '#BFCCDD'],
              [1, '#8E9DAE']
            ]
          }, {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1,
            },
            stops: [
              [0, '#8FE557'],
              [1, '#3A9002'],
            ]
          },],
          credits: {
            enabled: false,
          },
          plotOptions: {
            pie: {
              shadow: true,
              dataLabels: {
                enabled: false,
              },
              innerSize: '70%',
              point: {
                events: {
                  click: function(e) {
                    var selectedStatusName = this.name;
                    var availableStatusOptions = [self.normalStatus, self.alarmStatus, self.warningStatus];
                    var selectedStatus = availableStatusOptions.find(function(statusOption) {
                      return selectedStatusName === statusOption.label;
                    });
                    self.setActiveStatus(selectedStatus);
                  }
                }
              },
              size: '100%',
            },
          },
          title: {
            text: null,
            floating: true,
          },
          tooltip: {
            enabled: false,
          },
        },
        series: [
          {
            "name": "Some data",
            "data":this.fleetHealthData,
            "id": "series-0",
            "type": "pie"
          }
        ]
      }
  };

  createChartData(rawData) {
    let alarmCount = rawData.alarm || 0;
    let warningCount = rawData.warning || 0;
    let normalCount = rawData.normal || 0;

    return [
      {
        name: this.alarmStatus.label,
        y: alarmCount,
        color: '#BC0E00',
        selected: this.activeStatus === this.alarmStatus,
        shadow: this.activeStatus === this.alarmStatus,
        sliced: false
      },
      {
        name: this.warningStatus.label,
        y: warningCount,
        color: "#F4CB00",
        selected: this.activeStatus === this.warningStatus,
        shadow: this.activeStatus === this.warningStatus,
        sliced: false
      },
      {
        name: this.normalStatus.label,
        y: normalCount,
        color: '#37C91A',
        selected: this.activeStatus === this.normalStatus,
        shadow: this.activeStatus === this.normalStatus,
        sliced: false
      }]
  }

  redraw() {
    this.chartConfig.series[0].data = this.createChartData(this.fleetHealthData);
  }

  $onChanges(rawData) {
    this.fleetHealthData = rawData.data.currentValue;
    this.redraw();
  }

  getActiveStatPercentage() {
    return Math.round((this.data[this.activeStatus.name] / this.data.total) * 100);
  }

  getActiveStatusLabel() {
    return `IN ${this.activeStatus.label.toUpperCase()} STATE`;
  }

  setActiveStatus(status) {
    this.activeStatus = status;
    this.redraw();
    this.scope.$applyAsync(); //trigger "watcher" set up in the component. Using applyAsync because $apply() seemed to get hung-up and eventually throw errors
  }

  showInfoOverlay() {
    this.infoOverlayHidden = false;
  }

  hideInfoOverlay() {
    this.infoOverlayHidden = true;
  }
}


export default FleetHealthController;
