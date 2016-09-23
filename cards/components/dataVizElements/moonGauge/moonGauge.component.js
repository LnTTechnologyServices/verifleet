import controller from './moonGauge.controller';

import './moonGauge.scss';
import './moonGauge.web.scss';
import './moonGauge.mobile.scss';

let moonGaugeComponent = {
  restrict: 'E',
  bindings: {
    value: '<',
    subtitle: '<',
    decimals: '<',
    title: '<',
    unit: '<',
    min: '<',
    max: '<',
    stops: '<',
    endAngle: '<',
    startAngle: '<'
  },
  template: '<highchart config="vm.config"></highchart>',
  controller,
  controllerAs: 'vm'
};

export default moonGaugeComponent;
