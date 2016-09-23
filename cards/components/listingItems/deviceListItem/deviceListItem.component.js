import controller from './deviceListItem.controller';

var template;
if (window.ionic) {
  require('./deviceListItem.mobile.scss');
   template = require('./deviceListItem.mobile.html');
} else {
  require("./deviceListItem.web.scss");
  template = require('./deviceListItem.web.html');
}

let deviceListItemComponent = {
  restrict: 'E',
  bindings: {
    device: "<"
  },
  template: template,
  controller,
  controllerAs: 'vm'
};

export default deviceListItemComponent;
