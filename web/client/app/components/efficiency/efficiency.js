import angular from 'angular';
import uiRouter from 'angular-ui-router';
import roundProgressbar from 'angular-svg-round-progressbar';
import efficiencyComponent from './efficiency.component';
import './efficiency.scss';

let efficiencyModule = angular.module('efficiency', [
  uiRouter,roundProgressbar
])

.config(($stateProvider, $urlRouterProvider) => {
  "ngInject";
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('efficiency', {
      url: '/efficiency',
      template: '<efficiencyfile></efficiencyfile>',
      data: { requiresLogin: true }
    });
})
.component('efficiencyfile',efficiencyComponent);
export default efficiencyModule;