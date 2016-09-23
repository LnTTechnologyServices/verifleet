import controller from './userListItem.controller';

import './userListItem.scss';
import webTemplate from './userListItem.web.html';
import './userListItem.web.scss';
import mobileTemplate from './userListItem.mobile.html';
import './userListItem.mobile.scss';

let userListItemComponent = {
  restrict: 'E',
  bindings: {
    user: '<'
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

export default userListItemComponent;
