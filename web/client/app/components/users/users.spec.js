import userModule from './users'
import userController from './users.controller';
import userComponent from './users.component';
import userTemplate from './users.html';

describe('users', () => {
  let $rootScope, makeController;

  beforeEach(window.module(userModule.name));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new userController();
    };
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs

  });

  describe('Template', () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}

  });

  describe('Component', () => {
      // component/directive specs
      let component = userComponent;

      it('includes the intended template',() => {
        expect(component.template).to.equal(userTemplate);
      });

      it('uses `controllerAs` syntax', () => {
        expect(component).to.have.property('controllerAs');
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(userController);
      });
  });
});
