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
            // plotLines:[{
            //     value: this.data.plotLines[0].value,
            //     color: this.data.plotLines[0].color,
            //     width:1,
            //     zIndex:4,
            //     dashStyle: 'longDash'
            // },{
            //    value: this.data.plotLines[1].value,
            //     color: this.data.plotLines[1].color,
            //     width:1,
            //     zIndex:4,
            //     dashStyle: 'longDash'
            // }
            // ]
            },
            legend: {
            enabled: false
        },
            plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            style: {
                                color: '#fff'
                            }
                        }
                    }
        },
    },
    series: [{
                name: this.data.yaxisText,
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
    console.log(changes.data.currentValue.values);
    if(changes.data.currentValue.values) {
        this.config.series[0].data =  changes.data.currentValue.values;
    }
  }


}
export default barlineChartController;