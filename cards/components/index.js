import listingItems from './listingItems';
import dataVizElements from './dataVizElements';
import uiElements from './uiElements';

let components = angular.module('components', [
  listingItems.name,
  uiElements.name,
  dataVizElements.name
])

export default components;
