import controller from './binarySwitch.controller';

import './binarySwitch.scss';
import webTemplate from './binarySwitch.web.html';
import './binarySwitch.web.scss';
import mobileTemplate from './binarySwitch.mobile.html';
import './binarySwitch.mobile.scss';

let binarySwitchComponent = {
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

export default binarySwitchComponent;
