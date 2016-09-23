import template from './alerts.html';
import controller from './alerts.controller';
import './alerts.scss';

let alertsComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
};

export default alertsComponent;
