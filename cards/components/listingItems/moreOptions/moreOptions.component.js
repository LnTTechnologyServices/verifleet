import controller from './moreOptions.controller';

import './moreOptions.scss';
import webTemplate from './moreOptions.web.html';
import './moreOptions.web.scss';
import mobileTemplate from './moreOptions.mobile.html';
import './moreOptions.mobile.scss';

let moreOptionsComponent = {
  restrict: 'E',
  bindings: {'options': '<'},
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

export default moreOptionsComponent;
