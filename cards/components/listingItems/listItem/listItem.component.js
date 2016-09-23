import webTemplate from './listItem.web.html';
import mobileTemplate from './listItem.mobile.html';
import controller from './listItem.controller';

let listItemComponent = {
  restrict: 'E',
  bindings: {
    item: "<"
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

export default listItemComponent;
