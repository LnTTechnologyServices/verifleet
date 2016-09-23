// This is file describes the component itself (without registering it to the Angular module)
// it grabs the templates and creates the component using Angular 1.5 component syntax

import template from './device.html';
import controller from './device.controller';
import './device.scss';

let deviceComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
};

export default deviceComponent;
