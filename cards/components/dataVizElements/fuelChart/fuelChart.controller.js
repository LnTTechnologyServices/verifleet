class FuelChartController {
  constructor($element, $timeout) {
    "ngInject";
    this.name = 'fuelChart';
    this.$element = $element
    this.$timeout = $timeout
    this.config = {
      options: {
         chart: {
            type: 'solidgauge',
            marginTop: 50
        },
        title: {
            text: 'Activity',
            style: {
                fontSize: '24px'
            }
        },
        tooltip: {
            borderWidth: 0,
            backgroundColor: 'none',
            shadow: false,
            style: {
                fontSize: '16px'
            },
            pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>',
            positioner: function (labelWidth) {
                return {
                    x: 270 - labelWidth / 2,
                    y: 180
                };
            }
        },
        pane: {
            startAngle: 0,
            endAngle: 360,
            background: [{ // Track for Move
                outerRadius: '112%',
                innerRadius: '88%',
                backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),
                borderWidth: 0
            }, { // Track for Exercise
                outerRadius: '87%',
                innerRadius: '63%',
                backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.3).get(),
                borderWidth: 0
            }, { // Track for Stand
                outerRadius: '62%',
                innerRadius: '38%',
                backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[2]).setOpacity(0.3).get(),
                borderWidth: 0
            }]
        },
        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickPositions: []
        },
        plotOptions: {
            solidgauge: {
                borderWidth: '34px',
                dataLabels: {
                    enabled: false
                },
                linecap: 'round',
                stickyTracking: false
            }
        },
      },
    series: [{
            name: 'Total',
            borderColor: Highcharts.getOptions().colors[0],
            data: [{
                color: Highcharts.getOptions().colors[0],
                radius: '100%',
                innerRadius: '100%',
                y: 100
            }]
        }, {
            name: 'Exercise',
            borderColor: Highcharts.getOptions().colors[1],
            data: [{
                color: Highcharts.getOptions().colors[1],
                radius: '75%',
                innerRadius: '75%',
                y: 65
            }]
        }, {
            name: 'Stand',
            borderColor: Highcharts.getOptions().colors[2],
            data: [{
                color: Highcharts.getOptions().colors[2],
                radius: '50%',
                innerRadius: '50%',
                y: this.data.value
            }]
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