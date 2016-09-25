class BarChartController {
  constructor($element ,$timeout, $window, $scope,) {
    "ngInject";
    this.$element = $element
    this.$timeout = $timeout
    this.$scope = $scope
    this.config = {
       options: {
            chart: {
                renderTo: 'container',
                defaultSeriesType: 'bar',
                plotBorderWidth: 2,
                plotBackgroundColor: '#F5E6E6',
                plotBorderColor: '#D8D8D8',
                plotShadow: true,
                spacingBottom: 13,
                height:80
            },
            credits: {
                enabled: false
            },
            xAxis: {
                labels: {
                    enabled: false
                },
                tickLength: 0
            },
            title: {
                text: null
            },
            legend: {
                enabled: false
            },
            
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    y: 20
                },
                min: 0,
                max: 120,
                tickInterval: 20,
                minorTickInterval: 5,
                tickWidth: 1,
                tickLength: 8,
                minorTickLength: 5,
                minorTickWidth: 1,
                minorGridLineWidth: 0
            },
            plotOptions: {},
       },
            series: [{
                borderColor: '#7070B8',
                borderRadius: 3,
                borderWidth: 1,
                color: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 1,
                        y2: 0
                    },
                    stops: [ //[ 0.35, '#7070B8' ], [0, '#D69999'],
                                                   [0.3, '#B84D4D'],
                                                   [0.45, '#7A0000'],
                                                   [0.55, '#7A0000'],
                                                   [0.7, '#B84D4D'],
                                                   [1, '#D69999']]
                },
                pointWidth: 50,
                data: [this.data.value]}],
                func: function(chart) {
                        $timeout(function() {
                            chart.reflow();
                },10);
        }
    }
}

$onChanges(changes) {
    console.log(changes);
    if(changes.data.currentValue.series) {
        this.config.series =  changes.data.currentValue.series;
    }

    if(changes.data.currentValue.series) {
        this.config.categories =  changes.data.currentValue.categories;
    }    
  }   
}
 export default BarChartController;