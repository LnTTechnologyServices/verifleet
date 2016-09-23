import template from './fuel.html';
import controller from './fuel.controller';
import './fuel.styl';


let fuelComponent = {
  restrict: 'E',
  bindings: {},
  template,
  controller,
  controllerAs: 'vm'
};

export default fuelComponent;
