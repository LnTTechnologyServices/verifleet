import activityListItem from './activityListItem';
import alarmListItem from './alarmListItem';
import deviceListItem from './deviceListItem';
import listItemStatus from './listItemStatus';
import listItem from './listItem';
import userListItem from './userListItem';
import moreOptions from './moreOptions';
import './list.scss'


module.exports = angular
  .module('listingItems', [
    listItem.name,
    activityListItem.name,
    alarmListItem.name,
    deviceListItem.name,
    listItemStatus.name,
    userListItem.name,
    moreOptions.name
  ])
