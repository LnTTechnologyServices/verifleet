import BigNumberModule from './'
import BigNumberController from './bigNumber.controller';
import BigNumberComponent from './bigNumber.component';
import BigNumberTemplate from './bigNumber.web.html';

describe('BigNumber', () => {
  let $rootScope, makeController;

  beforeEach(window.module(BigNumberModule.name));

  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new BigNumberController();
    };
  }));

  it('has the name bigNumber', () => {
    let controller = makeController();
    console.log("Controller: ", controller);
  })

  describe('Template', () => {

    it('has value in template', () => {
      expect(BigNumberTemplate).to.match(/\s?vm\.value\s?/g);
    });

    it('has title in template', () => {
      expect(BigNumberTemplate).to.match(/\s?vm\.title\s?/g);
    });

    it('has unit in template', () => {
      expect(BigNumberTemplate).to.match(/\s?vm\.unit\s?/g);
    });


  });

  describe('Controller', () => {
    // controller specs
    it('has a name property', () => { // erase if removing this.name from the controller
      let controller = makeController();
      expect(controller).to.have.property('name');
    });

    it('has default values initialized', () => {
      let controller = makeController();
      expect(controller.title).to.not.be.undefined;
      expect(controller.value).to.not.be.undefined;
      expect(controller.unit).to.not.be.undefined;
    });

    it('bigNumber value should be set as integer', () => {
      let controller = makeController();
      controller.value = 80;
      expect(controller.value).to.equal(80);
    });

  });

  describe('Component', () => {
    // component/directive specs
    let component = BigNumberComponent;

    it('includes the intended template', () => {
      expect(component.template()).to.equal(BigNumberTemplate);
    });

    it('uses `controllerAs` syntax', () => {
      expect(component).to.have.property('controllerAs');
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(BigNumberController);
    });

  });
});
