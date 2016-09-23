class MoonGaugeController {
  constructor($timeout) {
    "ngInject";

    // TODO: implement ionic switch in provider
    this.isIonic = !!window.ionic;

    this.config = {
      options: {
        exporting:{
          enabled: false
        },
        chart: {
          backgroundColor: 'transparent',
          height: 150,
          type: 'solidgauge',
          width: this.isIonic ? 150 : 180,
        },
        colors: ['#8FE557'],
        credits: {
          enabled: false,
        },
        pane: {
          endAngle: this.endAngle || 90,
          startAngle: this.startAngle || -90,
          background: {
            backgroundColor: '#fff',
            innerRadius: '100%',
            outerRadius: '130%',
            shape: 'arc',
          },
          size: '70%',
        },
        plotOptions: {
          solidgauge: {
            innerRadius: '130%',
            dataLabels: {
              verticalAlign: 'middle',
              borderWidth: 0,
              format: '{point.y:.' + (this.decimals > 0 ? this.decimals : 0) + 'f}',
              style: {
                fontSize: '20px',
              },
              y: -15,
            },
          },
        },
        tooltip: {
          enabled: false,
        },
        title: {
          useHTML:  false,
          floating: true,
          style: {
            fontSize: this.isIonic ? 'medium' : '15px',
            whiteSpace: this.isIonic ? 'nowrap' : 'normal',
          },
          text: this.title,
          y: this.isIonic ? 20 : 20,
          verticalAlign: 'middle',
        },
        yAxis: {
          gridLineColor: 'transparent',
          lineColor: 'transparent',
          minorTickColor: '#000000',
          minorTickLength: 8,
          minorTickPosition: 'outsite',
          tickColor: '#000000',
          tickPosition: 'outsite',
          tickWidth: 2,
          tickLength: 12,
          zIndex: 4,
          labels: {
            enabled: false
          },
          stops: this.stops ? this.stops : [ [0.25, '#0000FF'], [0.3, '#00FF00'], [0.7, '#00FF00'], [0.75, '#FF0000']],
          min: this.min||0,
          max: this.max||100,
          /*plotBands: this.plotBands ? this.plotBands : [{
            innerRadius: '122%',
            outerRadius: '130%',
            from: 75,
            to: 100,
            color: '#D11515'
          }]*/
        },
      },
      series: [{data: [this.value]}],
    };
  }

  $onChanges(changes) {
    if(changes.value && typeof changes.value.currentValue === "number") {
      this.config.series[0].data[0] = changes.value.currentValue;
    }
    if(changes.title && typeof changes.title.currentValue === typeof "string") {
      this.config.options.title.text = changes.title.currentValue;
    }
    if(changes.subtitle && changes.subtitle.currentValue === typeof "string") {
      this.config.options.subtitle.text = changes.subtitle.currentValue;
    }
    if(changes.decimals && typeof changes.decimals.currentValue === "number") {
      this.config.options.plotOptions.solidgauge.dataLabels.format = '{point.y:.' + (changes.decimals.currentValue > 0 ? changes.decimals.currentValue : 0) + 'f}'
    }
    if(changes.stops && _.isArray(changes.stops.currentValue)) {
      this.config.options.yAxis.stops = changes.stops.currentValue
    }
    if(changes.min && typeof changes.min.currentValue === "number") {
      this.config.options.yAxis.min = changes.min.currentValue
    }
    if(changes.max && typeof changes.max.currentValue === "number") {
      this.config.options.yAxis.max = changes.max.currentValue
    }
  }
}

export default MoonGaugeController;
