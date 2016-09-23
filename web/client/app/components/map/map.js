import uiRouter from 'angular-ui-router';
import mapComponent from './map.component';

import leaflet from 'leaflet/dist/leaflet';
import "leaflet/dist/leaflet.css";
import 'angular-simple-logger';
import 'ui-leaflet/dist/ui-leaflet.min.js';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

let mapModule = angular.module('map', [
  uiRouter,
  'nemLogging',
  'ui-leaflet',
])

.config(($stateProvider, $urlRouterProvider) => {
  "ngInject";
  $stateProvider
    .state('map', {
      url: '/lookup',
      template: '<map></map>',
    });
})

.component('map', mapComponent);

export default mapModule;
