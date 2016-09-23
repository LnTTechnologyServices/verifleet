import controller from './dataTable.controller';
import './dataTable.scss';
var template;
if(window.ionic) {
  template = require('./dataTable.mobile.html');
  require('./dataTable.mobile.scss');
} else {
  template = require('./dataTable.web.html');
  require('./dataTable.web.scss');
}

let dataTableComponent = {
  restrict: 'E',
  bindings: {
    title : '<',
    rows  : '<',
    rowColorFn : '&'
  },
  template: template,
  controller,
  controllerAs: 'vm'
};

export default dataTableComponent;
