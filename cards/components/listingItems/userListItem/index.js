import userListItemComponent from './userListItem.component';

let userListItemModule = angular.module('userListItem', [])
  .component('userListItem', userListItemComponent);

export default userListItemModule;
