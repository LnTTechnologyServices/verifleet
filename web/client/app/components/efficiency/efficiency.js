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
      url: '/efficiency/:vechicle_id',
      template: '<efficiencyfile></efficiencyfile>',
      data: { requiresLogin: true },
      params: {
        vechicle_id: 'WM-212438'
      }
    });
})
.component('efficiencyfile',efficiencyComponent);
export default efficiencyModule;