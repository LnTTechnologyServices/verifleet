// This file loads the different page components

import angular from 'angular';
import Home from './home/home';
import Login from './login/login'
import Device from './device/device';
import Logs from './logs/logs';
import Map from './map/map';
import Account from './account/account';
import Users from './users/users';
import Docs from './docs/docs';
import Fuel from './fuel/fuel';
import Efficiency from './efficiency/efficiency';
import Alerts from './alerts/alerts';


let componentModule = angular.module('app.components', [
  Login.name,
  Home.name,
  Device.name,
  Logs.name,
  Map.name,
  Account.name,
  Users.name,
  Docs.name,
  Fuel.name,
  Efficiency.name,
  Alerts.name
]);

export default componentModule;
