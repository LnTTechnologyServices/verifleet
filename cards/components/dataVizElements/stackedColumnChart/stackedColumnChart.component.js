import controller from './stackedColumnChart.controller';

import './stackedColumnChart.scss';
import webTemplate from './stackedColumnChart.web.html';
import './stackedColumnChart.web.scss';
import mobileTemplate from './stackedColumnChart.mobile.html';
import './stackedColumnChart.mobile.scss';

let stackedColumnChartComponent = {
  restrict: 'E',
  bindings: {
    data: '<',
    title: '<'
  },
   template: function() {
    // pick whether on mobile or web here
    return webTemplate;
  },
  controller,
  controllerAs: 'vm'
};

export default stackedColumnChartComponent;


