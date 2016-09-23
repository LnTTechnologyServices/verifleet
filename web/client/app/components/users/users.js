import uiRouter from 'angular-ui-router';
import usersComponent from './users.component';

let usersModule = angular.module('users', [
  uiRouter
])
  .config(($stateProvider, $urlRouterProvider) => {
    "ngInject";
    $stateProvider
      .state('users', {
        url: '/users',
        template: '<users></users>',
      });
  })
  .component('users', usersComponent);

export default usersModule;
