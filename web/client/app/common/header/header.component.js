import template from './header.html';
import controller from './header.controller';
import './header.scss';

let headerComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
};

export default headerComponent;
