import angular from 'angular';
import Navbar from './navbar/navbar';
import Header from './header/header';

let commonModule = angular.module('app.common', [
  Navbar.name,
  Header.name
]);

export default commonModule;
