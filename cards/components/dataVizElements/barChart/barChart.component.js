import controller from './barChart.controller';
import webTemplate from './barChart.web.html';
import './barChart.scss';
import './barChart.web.scss';
import './barChart.mobile.scss';

let barChartComponent = {
       restrict: 'E',
        replace: true,
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

export default barChartComponent;


