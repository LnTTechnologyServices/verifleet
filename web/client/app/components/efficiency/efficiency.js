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
        vechicle_id: '5f4e7cdaa119439e5897a10eea3c86809942dbfb'
      }
    });
})
.component('efficiencyfile',efficiencyComponent);
export default efficiencyModule;