import controller from './bigIcon.controller';

import './bigIcon.scss';
import webTemplate from './bigIcon.web.html';
import './bigIcon.web.scss';
import mobileTemplate from './bigIcon.mobile.html';
import './bigIcon.mobile.scss';

let bigIconComponent = {
  restrict: 'E',
  bindings:  {
    icon: '<',
    state: '<',
    coloron: '<', //Binding to event handler attributes (all attributes that start with on and formaction attribute) is not supported.
    coloroff: '<'
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

export default bigIconComponent;
