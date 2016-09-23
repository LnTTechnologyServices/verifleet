import controller from './basicLineChart.controller';

import './basicLineChart.scss';
import webTemplate from './basicLineChart.web.html';
import './basicLineChart.web.scss';
import mobileTemplate from './basicLineChart.mobile.html';
import './basicLineChart.mobile.scss';

let basicLineChartComponent = {
  restrict: 'E',
  bindings: {
    data: '<',
    title: '<'
  },
  template:'<highchart  style="width:98%" config="vm.configs"></highchart>',
  controller,
  controllerAs: 'vm'
};

export default basicLineChartComponent;
