import controller from './alarmListItem.controller';

import './alarmListItem.scss';
import webTemplate from './alarmListItem.web.html';
import './alarmListItem.web.scss';
import mobileTemplate from './alarmListItem.mobile.html';
import './alarmListItem.mobile.scss';

let alarmListItemComponent = {
  restrict: 'E',
  bindings: {
    "alarm": "<"
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

export default alarmListItemComponent;
