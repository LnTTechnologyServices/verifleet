import activityListItemComponent from './activityListItem.component';

let activityListItemModule = angular.module('activityListItem', [])
  .component('activityListItem', activityListItemComponent);

export default activityListItemModule;
