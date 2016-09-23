import controller from './bigNumber.controller';

import './bigNumber.scss';
import webTemplate from './bigNumber.web.html';
import './bigNumber.web.scss';
import mobileTemplate from './bigNumber.mobile.html';
import './bigNumber.mobile.scss';

let bigNumberComponent = {
  restrict: 'E',
  bindings:  {
    value: '<',
    unit: '@',
    title: '@',
    decimals: '<'
   },
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

export default bigNumberComponent;
