import angular from 'angular';
import uiRouter from 'angular-ui-router';
import docsComponent from './docs.component';

let docsModule = angular.module('docs', [
  uiRouter
])
.config(($stateProvider, $urlRouterProvider) => {
  "ngInject";
  $stateProvider
    .state('docs', {
      url: '/docs',
      template: '<docs></docs>'
    });
})
.component('docs', docsComponent);

export default docsModule;
