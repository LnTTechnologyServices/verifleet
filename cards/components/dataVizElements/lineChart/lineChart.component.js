import controller from './lineChart.controller';

import './lineChart.scss';
import './lineChart.web.scss';
import './lineChart.mobile.scss';

let lineChartComponent = {
  restrict: 'E',
  bindings: {
    data: '<',
    title: '<'
  },
  template: '<highchart  style="width:100%" config="vm.config"></highchart>',
  controller,
  controllerAs: 'vm'
};

export default lineChartComponent;