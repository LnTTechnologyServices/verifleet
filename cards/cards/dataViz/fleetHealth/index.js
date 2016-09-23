import fleetHealthComponent from './fleetHealth.component';

let fleetHealthModule = angular.module('fleetHealth', [])
  .directive('fleetHealth', fleetHealthComponent);

export default fleetHealthModule;
