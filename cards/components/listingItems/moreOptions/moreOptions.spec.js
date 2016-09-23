import MoreOptionsModule from './'
import MoreOptionsController from './moreOptions.controller';
import MoreOptionsComponent from './moreOptions.component';
import MoreOptionsWebTemplate from './moreOptions.web.html';

describe('MoreOptions', () => {
  let $rootScope, makeController;

  beforeEach(window.module(MoreOptionsModule.name));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new MoreOptionsController();
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

  describe('Web Template', () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
    it('has name in template [REMOVE]', () => {
      expect(MoreOptionsWebTemplate).to.match(/{{\s?vm\.name\s?}}/g);
    });
  });

  describe('Component', () => {
      // component/directive specs
      let component = MoreOptionsComponent;

      it('includes the intended template',() => {
        expect(component.template).to.equal(MoreOptionsWebTemplate);
      });

      it('uses `controllerAs` syntax', () => {
        expect(component).to.have.property('controllerAs');
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(MoreOptionsController);
      });
  });
});
