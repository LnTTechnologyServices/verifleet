import controller from './dropDown.controller';

import './dropDown.scss';
import webTemplate from './dropDown.web.html';
import './dropDown.web.scss';
import mobileTemplate from './dropDown.mobile.html';
import './dropDown.mobile.scss';

let dropDownComponent = {
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

export default dropDownComponent;
