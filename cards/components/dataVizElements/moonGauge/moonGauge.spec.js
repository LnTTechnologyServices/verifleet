import MoonGaugeModule from './moonGauge'
import MoonGaugeController from './moonGauge.controller';
import MoonGaugeComponent from './moonGauge.component';
import MoonGaugeTemplate from './moonGauge.html';

describe('MoonGauge', () => {
  let $rootScope, makeController;

  beforeEach(window.module(MoonGaugeModule.name));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new MoonGaugeController();
    };
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    it('has a name property [REMOVE]', () => { // erase if removing this.name from the controller
      let controller = makeController();
      expect(controller).to.have.property('name');
    });
  });

  describe('Template', () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
    it('has name in template [REMOVE]', () => {
      expect(MoonGaugeTemplate).to.match(/{{\s?vm\.name\s?}}/g);
    });
  });

  describe('Component', () => {
      // component/directive specs
      let component = MoonGaugeComponent;

      it('includes the intended template',() => {
        expect(component.template).to.equal(MoonGaugeTemplate);
      });

      it('uses `controllerAs` syntax', () => {
        expect(component).to.have.property('controllerAs');
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(MoonGaugeController);
      });
  });
});
