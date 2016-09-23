// This file is used to register the component
// it grabs the proper information from other files in this directory
// and it gets registered one level up in components.js
// The URL handling is done locally in the component so it's easier to plug and play
// components rather than having to have a global stateProvider configuration

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import deviceComponent from './device.component';

let deviceModule = angular.module('device', [
  uiRouter
])

.config(($stateProvider, $urlRouterProvider) => {
  "ngInject";
  $stateProvider
    .state('device', {
      url: '/device/:device_id',
      // this template needs to be the same as the component name below ('device')
      template: '<device></device>',
    });
})

.component('device', deviceComponent);

export default deviceModule;
