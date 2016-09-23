import uiRouter from 'angular-ui-router';
import alertsComponent from './alerts.component';

let alertsModule = angular.module('alerts', [
  uiRouter
])
  .config(($stateProvider, $urlRouterProvider) => {
    "ngInject";
    $stateProvider
      .state('alerts', {
        url: '/alerts',
        template: '<alerts></alerts>',
      });
  })
  .component('alerts', alertsComponent);

export default alertsModule;
