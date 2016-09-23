import template from './docs.html';
import controller from './docs.controller';
import './docs.scss';

let docsComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
};

export default docsComponent;
