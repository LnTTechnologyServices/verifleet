import angular from 'angular';
import uiRouter from 'angular-ui-router';
import fuelComponent from './fuel.component';
import './fuel.scss';

let fuelModule = angular.module('fuel', [
  uiRouter
])

.config(($stateProvider, $urlRouterProvider) => {
  "ngInject";

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('fuel', {
      url: '/fuel',
      template: '<fuel></fuel>',
      data: { requiresLogin: true }
    });
})

.component('fuel',fuelComponent);
export default fuelModule;
