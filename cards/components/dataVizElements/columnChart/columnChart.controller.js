class ColumnChartController {
  constructor(
      $element,
      $timeout
  ) {
    "ngInject";
    this.$element = $element
    this.$timeout = $timeout

    this.config = {
      options: {
        chart: {
          width: 0,
          height: this.height||200,
          type: 'column',
       
          zoomType: 'x',
          backgroundColor: 'transparent'
        },
        rangeSelector: {
          enabled: false
        },
        legend: {
          enabled: true,
        },
        plotOptions: {
          line: {
            marker: {
              enabled: false
            }
          }
        },
        navigator: {
          adaptToUpdatedData: true,
          enabled: false,
          xAxis: {
            type: 'datetime',
            ordinal: false
          }
        },
        tooltip: {
          pointFormat: '<span style="color:{point.color}">{series.name}:</span> <b>{point.y:,.1f}</b><br/>',
        },
        xAxis: {
          type: "datetime",
          ordinal: false
        },
        yAxis: {
          title: ""
        },
        useHighStocks: true,
        credits: {
          enabled: false
        }
      },
      func: chart => {
        this.chart = chart;
        this.$timeout(() => {
          this.chart.reflow()
        })
      },
      title: {
        text: this.title||""
      },
      series: this.data,
    }
  }

  $postLink() {
    this.$timeout(
      () => {
        let parent = this.$element.parent()[0]
          this.chart.setSize(parent.offsetWidth, parent.offsetHeight)
          this.chart.reflow()
      },
      0
    )
  }
}

export default ColumnChartController;
