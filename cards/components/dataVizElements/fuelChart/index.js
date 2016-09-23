import fuelChartComponent from './fuelChart.component';

let fuelChartModule = angular.module('fuelChart', [])
  .component('fuelChart', fuelChartComponent);

export default fuelChartModule;
