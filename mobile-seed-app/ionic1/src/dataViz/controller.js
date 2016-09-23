import _ from 'lodash'

function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default class controller {
  constructor($interval) {
    'ngInject';
    this.$interval = $interval
    this.runIcons();
    this.runMoons();
    this.runLinechart();
    this.runBigNumbers();
  }

  runIcons() {
    this.icons = true
    this.icon_list = ["icon-users", "icon-search", "icon-send"]
    this.$interval(() => {
      this.oncolor = choice(["#00FF00", "#FF0000", "#0000FF", "#FF00FF"]);
      this.offcolor = choice(["#FFFF00", "#000000", "#FF00FF", "#FF00FF"]);
      this.state = choice(["on", "off", "1", "0"]);
    }, 1000)
  }

  runLinechart() {
    this.linechart = true
    this.lineData = [{
      "name": "temperature",
      "data": _.map(_.range(100), function(d) {
        return [Date.now() - d * 1000, d % 10]
      }).reverse(),
      "unit": "F"
    }, {
      "name": "humidity",
      "data": _.map(_.range(100), function(d) {
        return [Date.now() - d * 1000, d % 5]
      }).reverse()
    }]

    this.$interval(() => {
      this.lineData[0].data.push([Date.now(), choice(_.range(5, 10))])
      this.lineData[1].data.push([Date.now(), choice(_.range(5))])
    }, 1000)
  }

  runMoons() {
    this.moons = true
    this.numMoons = _.range(1)
    this.max = 100
    this.min = this.min

    this.gaugeData = {
      "max": this.max,
      "min": this.min,
      "value": this.max / 2,
      "decimals": 0,
      "unit": "°F",
      "title": "Temperature",
      "subtitle": "subtitle",
      "stops": [
        [0.1, '#55BF3B'],
        [0.5, '#DDDF0D'],
        [0.9, '#DF5353']
      ]
    }

    this.units = ["°F", "°C", "RPM"]
    this.$interval(() => {
      this.gaugeData.value = Math.random() * this.max
    }, 2000)

    this.$interval(() => {
      this.gaugeData.title = choice(["Temperature", "Temp", "Pressure"]);
      this.gaugeData.decimals = choice([0, 1, 2, 3])
    }, 5000)

    this.$interval(() => {
      this.numMoons = _.range(Math.floor(Math.random() * 5) + 1)
    }, 10000)

  }

  runBigNumbers() {
    this.bigNumbers = [];
    this.bigNumbers.push({
      value: 70
    });
    this.bigNumbers.push({
      value: 70
    });
    this.bigNumbers.push({
      value: 70
    });
    this.$interval(() => {
      this.bigNumbers[0].value = Math.floor(Math.random() * 100);
      this.bigNumbers[1].value = Math.floor(Math.random() * 100);
      this.bigNumbers[2].value = Math.floor(Math.random() * 100);
    }, 2000)
  }
}

