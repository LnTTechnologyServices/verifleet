import './listItemStatus.scss';
import webTemplate from './listItemStatus.web.html';
import './listItemStatus.web.scss';
import mobileTemplate from './listItemStatus.mobile.html';
import './listItemStatus.mobile.scss';

import controller from './listItemStatus.controller';

let listItemStatusComponent = {
  restrict: 'E',
  bindings: {
    status: "<"
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

export default listItemStatusComponent;
