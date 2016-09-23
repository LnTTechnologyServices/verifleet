import uiRouter from 'angular-ui-router';
import accountComponent from './account.component';

let accountModule = angular.module('account', [
  uiRouter
])
  .config(($stateProvider, $urlRouterProvider) => {
    "ngInject";
    $stateProvider
      .state('account', {
        url: '/account',
        template: '<account></account>',
      });
  })
  .component('account', accountComponent);

export default accountModule;
