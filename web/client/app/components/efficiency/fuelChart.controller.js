class FuelChartController {
    constructor($element, $timeout) {
        "ngInject";
        this.name = 'fuelChart';
        this.$element = $element
        this.$timeout = $timeout

        this.config = {
            options: {
                exporting: {
                    enabled: false
                },
                chart: {
                    type: 'solidgauge'
                },
                colors: ['red'],
                credits: {
                    enabled: false,
                },
                pane: {
                    center: ['40%', '80%'],
                    size: '81%',
                    startAngle: -90,
                    endAngle: 90,
                    background: {
                        backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                        innerRadius: '60%',
                        outerRadius: '100%',
                        shape: 'arc'
                    }
                },

                plotOptions: {
                    solidgauge: {
                        dataLabels: {
                            y: 5,
                            borderWidth: 0,
                            useHTML: true
                        },
                    }
                },
                tooltip: {
                    enabled: false,
                },
                title: {
                    useHTML: false,
                    floating: true,
                    style: {
                        fontSize: this.isIonic ? 'medium' : '18px',
                        whiteSpace: this.isIonic ? 'nowrap' : 'normal',
                    },
                    text: null,
                    y: this.isIonic ? -170 : -20,
                    verticalAlign: 'middle',
                },
                yAxis: {
                    min: this.data.min || 0,
                    max: this.data.max || 100,
                    minorTickInterval: 0,
                    tickPositions: [0, this.data.max || 100],
                    labels: {
                        y: 16,
                        formatter: function() {
                            return this.value ? 'F' : 'E'
                        }
                    }
                },
            },
            series: [{
                data: [this.data.value],
                dataLabels: {
                    enabled: false
                },
                tooltip: {
                    valueSuffix: ''
                }
            }, {
                name: 'Foo',
                type: 'gauge',
                data: [this.data.value]
            }],
            func: function(chart) {
                $timeout(function() {
                    chart.reflow();
                }, 0);
            },
        };



        /*$postLink() {
          this.$timeout(
            () => {
              let parent = this.$element.parent()[0]
                this.chart.setSize(parent.offsetWidth, parent.offsetHeight)
                this.chart.reflow()
            },
            0
          )
        }*/
    }
}
export default FuelChartController;