import template from './logs.html';
import controller from './logs.controller';
import './logs.scss';

let logsComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
};

export default logsComponent;
