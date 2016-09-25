class barlineChartController {
  constructor($element, $timeout,$window,$scope) {
    "ngInject";
    this.$element = $element
    this.$timeout = $timeout
    this.config = {
      options: {
            chart: {
                renderTo: 'container',
                type: 'column'
            },
            title: {
                text: null
            },
            xAxis: {
                categories: this.data.categories
            },
            yAxis: {
                 title: {
                 text: null
            }
            },
            legend: {
            enabled: false
        },
        tooltip: { enabled: false },
        plotOptions: {
            bar: {
                dataLabels: {
                    enabled: false
                }
            }
        },
    },
    series: [{
                name: "Distance to empty",
                showInLegend: false,
                data: this.data.values
            }],
            func: function(chart) {
                $timeout(function() {
                    chart.reflow();
                }, 0);
            }
    };
}

    $onChanges(changes) {

    console.log("Changes data");
    console.log(changes);
    
    if(changes.data.currentValue.values) {
        this.config.series[0].data =  changes.data.currentValue.values;
    }
  }


}
export default barlineChartController;