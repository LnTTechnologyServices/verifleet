import bigNumberComponent from './bigNumber.component';

let bigNumberModule = angular.module('bigNumber', [])
  .component('bigNumber', bigNumberComponent);

export default bigNumberModule;
