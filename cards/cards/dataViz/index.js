import dataTable from './dataTable';
import fleetHealth from './fleetHealth';

export default angular.module("dataVizCards", [
  dataTable.name,
  fleetHealth.name
])

