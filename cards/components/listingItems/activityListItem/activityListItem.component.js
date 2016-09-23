import controller from './activityListItem.controller';

import './activityListItem.scss';
import webTemplate from './activityListItem.web.html';
import './activityListItem.web.scss';
import mobileTemplate from './activityListItem.mobile.html';
import './activityListItem.mobile.scss';

let activityListItemComponent = {
  restrict: 'E',
  bindings: {
    activity: '<'
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

export default activityListItemComponent;
