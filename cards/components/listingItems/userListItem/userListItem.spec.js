import UserListItemModule from './'
import UserListItemController from './userListItem.controller';
import UserListItemComponent from './userListItem.component';
import UserListItemWebTemplate from './userListItem.web.html';

describe('UserListItem', () => {
  let $rootScope, makeController;

  beforeEach(window.module(UserListItemModule.name));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new UserListItemController();
    };
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    it('has a name property', () => { // erase if removing this.name from the controller
      let controller = makeController();
      expect(controller).to.have.property('name');
    });
  });

  describe('Web Template', () => {
    // template specs
    // tip: use regex to ensure correct bindings are used e.g., {{  }}
    it('has title in template', () => {
      expect(UserListItemWebTemplate).to.match(/{{\s?vm\.user\.title\s?}}/g);
    });
    it('has subtitle in template', () => {
      expect(UserListItemWebTemplate).to.match(/{{\s?vm\.user\.subtitle\s?}}/g);
    });
    it('has description in template', () => {
      expect(UserListItemWebTemplate).to.match(/{{\s?vm\.user\.description\s?}}/g);
    });
    it('has onClick in template', () => {
      expect(UserListItemWebTemplate).to.match(/\s?vm\.user\.onClick\s?/g);
    });
    it('has moreOptions in template', () => {
      expect(UserListItemWebTemplate).to.match(/\s?vm\.user\.moreOptions\s?/g);
    });
    it('has sideText in template', () => {
      expect(UserListItemWebTemplate).to.match(/{{\s?vm\.user\.sideText\s?}}/g);
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = UserListItemComponent;

    it('includes the intended web template',() => {
      expect(component.template()).to.equal(UserListItemWebTemplate);
    });

    it('uses `controllerAs` syntax', () => {
      expect(component).to.have.property('controllerAs');
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(UserListItemController);
    });
    it('has a 1 way binding to user', () => {
      expect(component.bindings).to.have.property('user');
      expect(component.bindings.user).to.equal('<');
    });
  });
});
