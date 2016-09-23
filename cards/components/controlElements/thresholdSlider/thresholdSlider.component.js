import controller from './thresholdSlider.controller';

import './thresholdSlider.scss';
import webTemplate from './thresholdSlider.web.html';
import './thresholdSlider.web.scss';
import mobileTemplate from './thresholdSlider.mobile.html';
import './thresholdSlider.mobile.scss';

let thresholdSliderComponent = {
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

export default thresholdSliderComponent;
