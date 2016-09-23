import deviceService from './deviceService';

var service;

describe('deviceService', () => {
  var $httpBackend;
  beforeEach(mocks.module('deviceService'))

  beforeEach(function () {
    let config =  {"api_base_url":"test"}
     module(function ($provide) {
         $provide.constant('projectConfig', config);
     });
 });

  beforeEach( () => {
    inject( function(_$httpBackend_) {
      $httpBackend = _$httpBackend_;
    })
  });

  beforeEach( () => {
    service = deviceService();
  })

  describe('API definition', () => {
    it('should expose getDevices', () => {
        expect(service.getDevices).to.exist;
    });

    it('should expose getDevice', () => {
        expect(service.getDevice).to.exist;
    });

    it('should expose getDevicesIfNeeded', () => {
        expect(service.getDevicesIfNeeded).to.exist;
    });

    it('should expose readDevice', () => {
        expect(service.readDevices).to.exist;
    });

    it('should expose writeDevice', () => {
        expect(service.writeDevices).to.exist;
    });

    it('should expose createDevice', () => {
        expect(service.createDevices).to.exist;
    });

    it('should expose deleteDevice', () => {
        expect(service.deleteDevices).to.exist;
    })
  })

  describe("getting devices", function() {
    it("should call /devices ", () => {

    })
  })


})
