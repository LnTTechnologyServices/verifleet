import controller from './tabList.controller';

import './tabList.scss';
import webTemplate from './tabList.web.html';
import './tabList.web.scss';
import mobileTemplate from './tabList.mobile.html';
import './tabList.mobile.scss';

let tabListComponent = {
  restrict: 'E',
  bindings: {
    "icon":"@",
    "number":"@",
    "header":"@",
    "content":"@",
    "bgcolor":"@"
    
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

export default tabListComponent;
