import controller from './<%= name %>.controller';

import './<%= name %>.scss';
import webTemplate from './<%= name %>.web.html';
import './<%= name %>.web.scss';
import mobileTemplate from './<%= name %>.mobile.html';
import './<%= name %>.mobile.scss';

let <%= name %>Component = {
  restrict: 'E',
  bindings: {},
  template: function() {
    if (window.ionic) {
      return mobileTemplate;
    } else {
      return webTemplate;
    }
  },
  controller,
  controllerAs: 'vm'
};

export default <%= name %>Component;
