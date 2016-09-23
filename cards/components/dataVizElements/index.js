import bigNumber from './bigNumber';
import bigIcon from './bigIcon';
import moonGauge from './moonGauge';
import lineChart from './lineChart';
import columnChart from './columnChart';
import fuelChart from './fuelChart';
import barChart from './barChart';
import barlineChart from './barlineChart';
import stackedColumnChart from './stackedColumnChart';
import basicLineChart from './basicLineChart';

module.exports = angular
  .module('dataVizComponents', [
    bigNumber.name,
    bigIcon.name,
    moonGauge.name,
    lineChart.name,
    columnChart.name,
    fuelChart.name,
    barChart.name,
    barlineChart.name,
    stackedColumnChart.name,
    basicLineChart.name

  ])
