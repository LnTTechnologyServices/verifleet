import controller from './fuelChart.controller';
import webTemplate from './fuelChart.web.html';
import './fuelChart.scss';
import './fuelChart.web.scss';
import './fuelChart.mobile.scss';

let fuelChartComponent = {
  restrict: 'E',
  bindings: {
    data: '<',
    title: '<'
  },
  template: '<highchart style="left;margin-left:10px;" config="vm.config"></highchart>',
  controller,
  controllerAs: 'vm'
};

export default fuelChartComponent;

