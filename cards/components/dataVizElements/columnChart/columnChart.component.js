import controller from './columnChart.controller';

import './columnChart.scss';
import './columnChart.web.scss';
import './columnChart.mobile.scss';

let columnChartComponent = {
  restrict: 'E',
  bindings: {
    data: '<',
    title: '<'
  },
  template: '<highchart style="width:100%" config="vm.config"></highchart>',
  controller,
  controllerAs: 'vm'
};

export default columnChartComponent;
