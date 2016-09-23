class MapController {
  constructor($ngRedux, deviceService, $stateParams, leafletData, $timeout, $state, $scope) {
    "ngInject";
    this.leafletData = leafletData;
    this.$timeout = $timeout;
    this.deviceService = deviceService;
    this.$state = $state;
    this.$scope = $scope;

    this.initialized = false;

    this.unsubscribe = $ngRedux.connect(this.mapStateToThis, this.deviceService)((selectedState, actions) => {
      this.componentWillReceiveStateAndActions(selectedState, actions);
      Object.assign(this, selectedState, actions);
    });

    this.getDevices();
    this.markers = [];

    // this is a hack to get the tiles to load after resizing
    this.leafletData.getMap().then((map) => {
      this.$timeout(function() {
        map.invalidateSize()
      }, 1000);
    });

    this.exosite = {
      lng: -91.6686,
      lat: 41.9831,
      zoom: 6
    }

    this.layers = {
      baselayers: {
        osm: {
          name: 'OpenStreetMap',
          type: 'xyz',
          url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          layerOptions: {
            subdomains: ['a', 'b', 'c'],
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            continuousWorld: true
          }
        },
      },
      overlays: {
        devices: {
          name: 'Devices',
          type: 'markercluster',
          visible: true
        }
      }
    }

    this.defaults = {
      zoomControlPosition: 'topright'
    }
  }

  goToDevice(rid) {
    this.$state.go("device", {
      "device_id": rid
    })
  }

  $onDestroy() {
    this.unsubscribe();
  }

  // Which part of the Redux global state does our component want to receive?
  mapStateToThis(state) {
    const devices = state.devices;
    const isLoading = state.isLoading;
    return {
      devices,
      isLoading
    };
  }

  componentWillReceiveStateAndActions(nextState, nextActions) {
    if(nextState.devices.length) {
      if(!this.initialized) {
        this.initialized = true;
        nextState.devices.map(device => {
          if(_.keys(device.data)) {
            nextActions.subscribeToDevices(device);
          }
        })
      }

      this.markers = _.filter(nextState.devices.map( (device) => {
        let $scope = this.$scope;
        if(device.data.gps) {
          let point = device.data.gps.last();
          if(point.lat && point.lng) {
            return {
              lat: point.lat,
              lng: point.lng,
              name: device.name,
              layer: 'devices',
              message: "<span><a ng-click=\"vm.goToDevice('"+device.rid+"')\">"+device.name+"</a></span>",
              getMessageScope: function() {
                return $scope
              }
            }
          }
        }
      }))
      this.bounds = new L.LatLngBounds(this.markers)
    }
  }
}

export default MapController;
