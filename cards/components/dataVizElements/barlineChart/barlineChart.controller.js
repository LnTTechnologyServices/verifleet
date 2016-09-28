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
                
            },
            yAxis: {
                 title: {
                     text: null
                 }
            },
            legend: {
                enabled: true
            },
            scrollbar: {
                enabled: true
            },
        
        tooltip: { enabled: false },
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

    console.log("Changes data");
    console.log(changes);

    if(changes.data.currentValue) {
        console.log("Changes data2 ");

        var categories = [];
        var i = 0;
        for(i =0; i< changes.data.currentValue.length; i++)
        {
            var j = 0;
            for(j =0; j < changes.data.currentValue[i].categories.length; j++)
            {
               categories.push(changes.data.currentValue[i].categories[j]);
            }
        }
        console.log("Changes data2 ", categories);
        categories = categories.sort(function(a,b) { return new Date(b).getTime() - new Date(a).getTime() } );
        this.config.options.xAxis.categories = categories;
        this.config.options.xAxis.min = 1;
        this.config.series =  changes.data.currentValue;
        
        console.log("Changes data2 ", this.config.series);
    }
  }


}
export default barlineChartController;