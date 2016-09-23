import angular from 'angular';
import uiRouter from 'angular-ui-router';
import homeComponent from './home.component';
import './home.scss';

let homeModule = angular.module('home', [
  uiRouter
])

.config(($stateProvider, $urlRouterProvider) => {
  "ngInject";

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      template: '<home></home>',
      data: { requiresLogin: true }
    });
})

.component('home', homeComponent);

export default homeModule;
