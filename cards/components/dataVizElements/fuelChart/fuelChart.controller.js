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
                        plotShadow: false,
                        backgroundColor: 'white',
                        height:300,
                        width:280
                    },
            title: {
                text: null
            },
            pane: {
                center:[110,112],
                startAngle: -150,
                endAngle: 150,
                background: [{
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, '#ffb91d'],
                            [1, '#ffb91d']
                        ]
                    },
                    borderWidth: 0,
                    outerRadius: '109%'
                }, {
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                        stops: [
                            [0, '#ffb91d'],
                            [1, '#ffb91d']
                        ]
                    },
                    borderWidth: 1,
                    outerRadius: '107%'
                }, {
                    // default background
                }, {
                    backgroundColor: '#ffb91d',
                    borderWidth: 0,
                    outerRadius: '105%',
                    innerRadius: '103%'
                }]
            },

            // the value axis
            yAxis: {
                min: this.data.min,
                max: this.data.max,
                minorTickInterval: 5,
                minorTickWidth: 1,
                minorTickLength: 20,
                minorTickPosition: 'inside',
                minorTickColor: 'white',

                tickPixelInterval: 30,
                tickWidth: 2,
                tickPosition: 'outside',
                tickLength: 10,
                tickColor: 'white',
                labels: {
                    step: 2,
                    rotation: 'auto'
                },
                title: {
                    text: "Fuel",
                    style:{
                        color: '#ffb91d',
                        font: '16px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                    }
                },
                plotBands: [{
                    from: 0,
                    to: 15,
                    color: '#D02323' // Red
                   
                }, {
                    from: 15,
                    to: 30,
                    color: '#ffb91d' // yellow
                }, {
                    from: 30,
                    to: 60,
                     color: '#09A80E' // green
                }]
            },
      },
    series: [{
                name: 'Fuel Level',
                data: [this.data.value]
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
  } 


}
export default FuelChartController;