import BarlineChartModule from './barlineChart'
import BarlineChartController from './barlineChart.controller';
import BarlineChartComponent from './barlineChart.component';
import BarlineChartTemplate from './barlineChart.html';

describe('BarlineChart', () => {
  let $rootScope, makeController;

  beforeEach(window.module(BarlineChartModule.name));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new BarlineChartController();
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
      expect(BarlineChartTemplate).to.match(/{{\s?vm\.name\s?}}/g);
    });
  });

  describe('Component', () => {
      // component/directive specs
      let component = BarlineChartComponent;

      it('includes the intended template',() => {
        expect(component.template).to.equal(BarlineChartTemplate);
      });

      it('uses `controllerAs` syntax', () => {
        expect(component).to.have.property('controllerAs');
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(BarlineChartController);
      });
  });
});