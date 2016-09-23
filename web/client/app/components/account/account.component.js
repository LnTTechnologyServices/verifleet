import template from './account.html';
import controller from './account.controller';
import './account.scss';

let accountComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
};

export default accountComponent;
