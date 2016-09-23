import dataTableComponent from './dataTable.component';

let dataTableModule = angular.module('tableData', [])
  .component('exoTable', dataTableComponent);

export default dataTableModule;
