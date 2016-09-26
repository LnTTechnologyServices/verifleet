import tabListComponent from './tabList.component';

let tabListModule = angular.module('tabList', [])
  .component('tabList', tabListComponent);

export default tabListModule;
