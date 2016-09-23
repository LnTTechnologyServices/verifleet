import uiRouter from 'angular-ui-router';
import logsComponent from './logs.component';

let logsModule = angular.module('logs', [
  uiRouter
])
  .config(($stateProvider, $urlRouterProvider) => {
    "ngInject";
    $stateProvider
      .state('logs', {
        url: '/logs',
        template: '<logs></logs>',
      });
  })
  .component('logs', logsComponent);

export default logsModule;
