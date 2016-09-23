import template from './app.html';
import controller from './app.controller'
import './app.scss';
import './parker-colors.scss';
import './parker-fonts.scss';

let appComponent = {
  template,
  restrict: 'E',
  controller,
  controllerAs: 'vm'
};

export default appComponent;
