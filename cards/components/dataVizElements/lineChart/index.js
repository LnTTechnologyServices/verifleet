import lineChartComponent from './lineChart.component';

let lineChartModule = angular.module('lineChart', [])
  .component('lineChart', lineChartComponent);

export default lineChartModule;
