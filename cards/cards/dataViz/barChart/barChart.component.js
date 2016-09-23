import controller from './barChart.controller';

import './barChart.scss';
import webTemplate from './barChart.web.html';
import './barChart.web.scss';
import mobileTemplate from './barChart.mobile.html';
import './barChart.mobile.scss';

let barChartComponent = {
  restrict: 'E',
  bindings: {},
  template: function() {
    if (window.ionic) {
      return mobileTemplate;
    } else {
      return webTemplate;
    }
  },
  controller,
  controllerAs: 'vm'
};

export default barChartComponent;
