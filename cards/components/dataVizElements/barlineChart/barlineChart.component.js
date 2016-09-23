import controller from './barlineChart.controller';
import webTemplate from './barlineChart.web.html';
import './barlineChart.scss';
import './barlineChart.web.scss';
import './barlineChart.mobile.scss';

let barlineChartComponent = {
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

export default barlineChartComponent;