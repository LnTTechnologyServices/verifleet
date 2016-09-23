import * as _ from 'lodash';

function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

class docsController {
  constructor($interval, $timeout) {
    'ngInject';
    this.randomize = true;
    this.runIntervals = true;
    this.$timeout = $timeout

    this.$interval = this.runIntervals ? $interval : function(lamba, timeout) { /* noop */ };

    this.runIcons();
    this.runMoons();
    this.runLinechart();
    this.runBigNumbers();
    this.runDataTables();
    this.runFleetHealth();
    

    this.deviceProperties = {
      "rid": "abcdefghijklmnopqrstuvwxyz",
      "title": "Device 2245",
      "subtitle": "test subtitle",
      "description": "region / customer / division",
      "lastReported": "30 sec in the future",
      "moreOptions": [{
        "text": "option test"
      }],
      "status": "healthy",
      "icon": "power",
      "sideText": "30 cases",
      "onClick": function() {
        console.log("you clicked me!")
      }
    }
    this.device = {
      "rid": this.deviceProperties.rid,
      "title": this.deviceProperties.title
    }

    this.user = {
      "title": "Jacelyn Doe",
      "description": "jacelyndoe@parker.com"
    }

    this.activityProperties = {
      "title": "Device 2245",
      "subtitle": "Enter Service Mode",
      "description": "jacelyndoe@parker.com",
      "icon": "enter_service_mode",
      "timestamp": Date.now()
    }

    this.alarmProperties = {
      "title": "Device 2245",
      "subtitle": "Low Temperature",
      "description": "38 minutes - Active",
      "icon": "exclamation",
      "status": {
        "state": "critical"
      },
      "timestamp": Date.now()
    }

    this.states = ["healthy", "critical", "warning", "inactive", ""]
    this.icons = ["icon-send", "icon-search-filled", "icon-exit-service-mode", "icon-temperature-low"]

    if (this.randomize) {
      $interval(() => {
        this.runRandomize()
      }, 5000);
    }
    this.runRandomize();
  }

  runRandomize() {
    let vm = this;
    var keys = _.filter(_.keys(vm.deviceProperties), function() {
      return Math.random() > 0.5;
    })
    vm.device = _.pick(vm.deviceProperties, keys)
    vm.device.title = vm.deviceProperties.title;
    vm.device.rid = vm.deviceProperties.rid;
    vm.device.status = vm.states[Math.floor(Math.random() * vm.states.length)];

    var keys = _.filter(_.keys(vm.alarmProperties), function() {
      return Math.random() > 0.5;
    })
    vm.alarm = _.pick(vm.alarmProperties)
    vm.alarm.title = vm.alarmProperties.title;
    vm.alarm.status = vm.states[Math.floor(Math.random() * vm.states.length)];
    if (Math.random() > 0.5) {
      vm.alarm.icon = vm.icons[Math.floor(Math.random() * vm.icons.length)];
    }

    var keys = _.filter(_.keys(vm.activityProperties), function() {
      return Math.random() > 0.5;
    })
    vm.activity = _.pick(vm.activityProperties)
    vm.activity.title = vm.activityProperties.title;
  }

  runFleetHealth() {
    this.fleetHealth = true;
    var upperBound = 300;
    var normal = Math.floor(Math.random() * upperBound);
    var warning = Math.floor(Math.random() * upperBound);
    var alarm = Math.floor(Math.random() * upperBound);
    var total = normal + warning + alarm;

    this.fleetHealthData = {
      "total": total,
      "normal": normal,
      "warning": warning,
      "alarm": alarm
    };

    if (this.runIntervals) {
      this.$interval(() => {
        var normal = Math.floor(Math.random() * upperBound);
        var warning = Math.floor(Math.random() * upperBound);
        var alarm = Math.floor(Math.random() * upperBound);
        var total = normal + warning + alarm;

        this.fleetHealthData = {
          "total": total,
          "normal": normal,
          "warning": warning,
          "alarm": alarm
        }
      }, 10000);
    }
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
    this.lineDataStatic = [{
      "key": "temperature",
      "color": "red",
      "unit": "F",
      "values": _.sortBy(_.map(_.range(0,100), function(d) {
        return {x:Date.now() - (d * 10000000), y:d % 10}
      }), 'x')
    }, {
      "key": "humidity",
      "color": "green",
      "values": _.sortBy(_.map(_.range(0,100), function(d) {
        return {x:Date.now() - (d*10000000), y:d % 5}
      }), 'x')
    }]

    this.lineDataDynamic = [{
      "key": "temperature",
      "unit": "F",
      "values": _.sortBy(_.map(_.range(0,20), function(d) {
        return {x:Date.now() - (d * 1000), y: d % 5 + Math.random()}
      }), 'x')
    }, {
      "key": "humidity",
      "area": true,
      "values": _.sortBy(_.map(_.range(0,20), function(d) {
        return {x:Date.now() - (d*1000), y: d % 3}
      }), 'x')
    }]


    this.$interval(() => {
      this.lineDataDynamic[0].values.push( {x:Date.now(), y:choice(_.range(5, 10)) + Math.random()} )
      this.lineDataDynamic[1].values.push( {x:Date.now(), y:choice(_.range(5))} )
    }, 1000)
  }

  runMoons() {
    this.moons = true
    this.max = 100
    this.min = 0
    this.measurements = [
      {
        text: 'Temperature',
        unit: "°F"
      }, {
        text: 'Temperature',
        unit: "°C"
      }, {
        text: "RPM",
        unit: ''
      }
    ]

    this.getMoons = function(numMoons) {
      this.moons = _.map(_.range(numMoons), () => {
        let measurement = choice(this.measurements)
        return {
          "max": this.max,
          "min": this.min,
          "value": Math.random() * this.max,
          "decimals": choice(_.range(4)),
          "unit": measurement.unit,
          "text": measurement.text,
        }
      })
    }

    this.$interval(() => {
      _.each(_.range(this.moons.length), (index) => {
        this.moons[index].value = Math.random() * this.max
      })
    }, 1000)

    this.$interval(() => {
      _.each(_.range(this.moons.length), (index) => {
        let measurement = choice(this.measurements)
        this.moons[index].text = measurement.text;
        this.moons[index].decimals = choice([0, 1, 2, 3])
        this.moons[index].unit = measurement.unit
      })
    }, 2000)

    this.$interval(() => {
      this.getMoons(Math.floor(Math.random() * 5) + 1)
    }, 30000)

    this.getMoons(3)
  }

  runBigNumbers() {
    this.bignumbers = true
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

  runDataTables() {
    this.datatable = true;
    this.value = 0;
    this.rowColorFn = function() {
      vm.rowColorFn();
    }

    this.table = {
      "title": "Case Parameters",
      "rows": [{
        "name": "Discharge Temperature (L):",
        "data": [{
          "value": 36,
          "timestamp": "9:10A"
        }, {
          "value": 36,
          "timestamp": "9:41A"
        }]
      }, {
        "name": "Discharge Temperature (C):",
        "data": [{
          "value": 34,
          "timestamp": "9:10A"
        }, {
          "value": 34,
          "timestamp": "9:41A"
        }]
      }, {
        "name": "Discharge Temperature (R):",
        "data": [{
          "value": 38,
          "timestamp": "9:10A"
        }, {
          "value": 44,
          "timestamp": "9:41A"
        }]
      }, {}, {
        "name": "Superheat (L):",
        "data": [{
          "value": 30,
          "timestamp": "9:10A"
        }, {
          "value": 30,
          "timestamp": "9:41A"
        }]
      }, {
        "name": "Superheat (C):",
        "data": [{
          "value": 32,
          "timestamp": "9:10A"
        }, {
          "value": 32,
          "timestamp": "9:41A"
        }]
      }, {
        "name": "Superheat (R):",
        "data": [{
          "value": 35,
          "timestamp": "9:10A"
        }, {
          "value": 35,
          "timestamp": "9:41A"
        }]
      }, {
        "name": "Operating Mode:",
        "data": [{
          "value": "Cool",
          "timestamp": "9:10A"
        }, {
          "value": "Cool",
          "timestamp": "9:41A"
        }]
      }, {
        "name": "Suction Pressure:",
        "data": [{
          "value": 14.8,
          "timestamp": "9:10A"
        }, {
          "value": 14.8,
          "timestamp": "9:41A"
        }]
      }, {
        "name": "EEPR Position (% Open):",
        "data": [{
          "value": 72,
          "timestamp": "9:10A"
        }, {
          "value": 72,
          "timestamp": "9:41A"
        }]
      }],
      rowColorFn: function(data) {
        if (data[0] !== data[data.length - 1]) {
          return "#FF0000"
        }
      }
    }

    this.$interval(() => {
      this.table.rows[0].data[1].value = Math.floor(Math.random() * 100);
      this.table.rows[1].data[1].value = Math.floor(Math.random() * 100);
    }, 2000)
  }

}

export default docsController;