class BarChartController {
  constructor($element, $timeout,$scope) {
    "ngInject";
    this.$element = $element
    this.$timeout = $timeout
    this.name = 'basicLineChart';

    this.config = {
      options: {
       chart: {
        renderTo: 'chart',
        type: 'column',
        style: {
            fontSize: 12,
            fontFamily: 'Helvetica Neue, Arial, sans-serif'
        },
       
    },
    xAxis: {
        min:0,
        categories: ['26 Sep 16', '25 Sep 16', '24 Sep 16', '23 Sep 16', '22 Sep 16'],
        tickWidth: 0
    },
    yAxis: {
        labels: {
            style: {
                color: '#fff'
            },
            align: 'left',
            x: 5,
            y: -3
        },
        showLastLabel: false,
        title: null
    },
    title: null,
    plotOptions: {
        series: {
            dataLabels: {
                enabled: false,
                style: {
                    color: '#fff'
                }
            }
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
            console.log(changes.data.currentValue);
            this.config.series = changes.data.currentValue;
       }
    }
}

export default BarChartController;
