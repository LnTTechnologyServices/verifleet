class FuelChartController {
  constructor($element, $timeout) {
    "ngInject";
    this.name = 'fuelChart';
    this.$element = $element
    this.$timeout = $timeout
    this.config = {
      options: {
    chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
    title: {
      text: null,
    },
    plotOptions: {
      gauge: {
        allowPointSelect: true,
        states: {
          hover: {
            enabled: true,
            marker: {
              fillColor: "#FF0000",
              lineColor: "#0000FF",
              lineWidth: 5
            }
          }
        }
      }
    },

    pane: {
      startAngle: -150,
      endAngle: 150,
      background: [{
        backgroundColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, '#FFF'],
            [1, '#333']
          ]
        },
        borderWidth: 0,
        outerRadius: '109%'
      }, {
        backgroundColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, '#333'],
            [1, '#FFF']
          ]
        },
        borderWidth: 1,
        outerRadius: '107%'
      }, {
        // default background
      }, {
        backgroundColor: '#DDD',
        borderWidth: 0,
        outerRadius: '105%',
        innerRadius: '103%'
      }]
    },

    // the value axis
    yAxis: {
      min: this.data.min,
      max: this.data.max,

      minorTickInterval: 'auto',
      minorTickWidth: 1,
      minorTickLength: 10,
      minorTickPosition: 'inside',
      minorTickColor: '#666',
      tickPixelInterval: 30,
      tickWidth: 2,
      tickPosition: 'inside',
      tickLength: 10,
      tickColor: '#666',
      labels: {
        step: 2,
        rotation: 'auto'
      },
      title: {
        text: 'Fuel Guage'
      },
      plotBands: [{
        from: 0,
        to: 30,
        color: '#55BF3B' // green
      }, {
        from: 30,
        to: 40,
        color: '#DDDF0D' // yellow
      }, {
        from: 40,
        to: 60,
        color: '#DF5353' // red
      }]
    },
      },
    series: [{
      name: 'Speed',
      data: [this.data.value],
      tooltip: {
        valueSuffix: 'Fuel Guage'
      }
    }],
    func: function(chart) {
            $timeout(function() {
                chart.reflow();
            }, 0);
        },
    };
  }

  $onChanges(changes) {
    console.log(changes);
    if(changes.data.currentValue.value) {
        this.config.series.data =  changes.data.currentValue.value;
    }

    // if(changes.data.currentValue.max) {
    //     this.config.yAxis.max =  changes.data.currentValue.max;
    // }    

    // if(changes.data.currentValue.min) {
    //     this.config.yAxis.min  =  changes.data.currentValue.min;
    // }

  } 


}
export default FuelChartController;