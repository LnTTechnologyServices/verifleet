class BasicLineChartController {
  constructor($element, $timeout,$scope) {
    "ngInject";
    this.$element = $element
    this.$timeout = $timeout
    this.name = 'basicLineChart';

    this.configs = {
      options: {
        chart: {
                zoomType: 'x'
            },
            title: {
                text: null
            },
                xAxis: {
            type: 'datetime',
            showEmpty: false,
            title: {
            text: null
            },
            labels: {
            //You can format the label according to your need
            format: '{value:%m/%d - %H:%m}'
        },
        legend: {
            enabled: false
        },

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
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, Highcharts.getOptions().colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 0
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
      },
      series: this.data,
        func: function(chart) {
                        $timeout(function() {
                            chart.reflow();
                        }, 0);
                    }
    };
  }

   $onChanges(changes) {
       if(changes.data && _.isArray(changes.data.currentValue)) {
        this.configs.series = changes.data.currentValue
       }
    }

}

export default BasicLineChartController;
