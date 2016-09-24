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
            text: '',
        },
        subtitle: {
            text: '',
        },
        xAxis: {
            type: 'datetime',
            labels: {
            //You can format the label according to your need
            format: '{value:%m/%d - %H:%m}'
        },

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
                        [0, '#87CEFA'],
                        [1, '#F0F8FF']
                    ]
                 },
                 marker: {
                    radius: 2
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

        tooltip: {
            valueSuffix: ''
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
}

export default BasicLineChartController;
