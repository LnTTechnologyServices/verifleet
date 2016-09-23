class StackedColumnChartController {
  constructor($element, $timeout, $scope) {
    "ngInject";
    this.$element = $element
    this.$timeout = $timeout
    this.name = 'stackedColumnChart';

    this.configs = {
      options: {
        chart: {
          type: 'column',
          backgroundColor: 'transparent'   
        },
        title: {
          text: ''
        },
        xAxis: {
          categories: ['Engine', 'Tyre', 'Fuel', 'Battery', 'TBD'],
          labels: {
            style: {
              color: 'black',
              font: '18px Helvetica',
              fontWeight: 'bold'
            }
          }
        },
        yAxis: {
          labels: {
            enabled: false
          },
         gridLineColor: 'transparent',
          min: 0,
          title: {
            text: ''
          },
          stackLabels: {
            enabled: true,
            style: {
              fontWeight: 'bold',
              color: 'gray'
            }
          }
        },
        legend: {
          align: 'center',
          verticalAlign: 'top',
          y: -15,
          floating: true,
          backgroundColor: 'white',
          shadow: false
        },
        tooltip: {
          headerFormat: '<b>{point.x}</b><br/>',
          pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: true,
              color: 'white',
              style: {
                textShadow: '0 0 3px black'
              }
            }
          }
        }
      },

      series: this.data,
      func: function(chart) {
          $timeout(function() {
              chart.reflow();
          }, 0);
      },
    };


  }
}

export default StackedColumnChartController;
