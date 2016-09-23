class BasicLineChartController {
  constructor($element, $timeout,$scope) {
    "ngInject";
    this.$element = $element
    this.$timeout = $timeout
    this.name = 'basicLineChart';

    this.configs = {
      options: {
        chart: {
          type: 'line',
          backgroundColor: 'transparent',   
          
        },
        title: {
            text: '',
        },
        subtitle: {
            text: '',
        },
        xAxis: {
            categories: ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20']
        },
        yAxis: {
            title: {
                text: 'DGE'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: ''
        },
         legend: {
            layout: 'horizontal',
            align: 'center',
            verticalAlign: 'bottom',
            borderWidth: 0
        }
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
