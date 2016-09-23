import DataTableModule from './'
import DataTableController from './dataTable.controller';
import DataTableComponent from './dataTable.component';
import DataTableTemplate from './dataTable.web.html';

describe('DataTable', () => {
  let $rootScope, makeController;

  beforeEach(window.module(DataTableModule.name));
  beforeEach(inject((_$rootScope_) => {
    $rootScope = _$rootScope_;
    makeController = () => {
      return new DataTableController();
    };
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  it('has the name dataTable', () => {
    let controller = makeController();
    console.log("Controller: ", controller);
  })

 describe('Template', () => {

    it('has title in template', () => {
      expect(DataTableTemplate).to.match(/\s?vm\.title\s?/g);
    });

    it('has rows in template', () => {
      expect(DataTableTemplate).to.match(/\s?vm\.rows\s?/g);
    });

    it('has row color function in template', () => {
      expect(DataTableTemplate).to.match(/\s?vm\.rowColorFn\s?/g);
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
      expect(controller.rows).to.not.be.undefined;
      expect(controller.rowsColorFn).to.not.be.undefined;
    });

    it('rowsColorFn should return color based on array', () => {
      let controller = makeController();
      controller.rows =  [
      {
        name: "Discharge Temperature (L):",
        data: [
          { value: 55, timestamp: "9:10A" },
          { value: 23, timestamp: "9:41A" }
        ]
      },
      {
        name: "Discharge Temperature (C):",
        data: [
          { value: 56, timestamp: "9:10A" },
          { value: 23, timestamp: "9:41A" }
        ]
      }];
      expect(controller.rowColorFn(controller.rows)).to.equal("#FF0000");
    });

  });

  describe('Component', () => {
      // component/directive specs
      let component = DataTableComponent;

      it('includes the intended template',() => {
        expect(component.template).to.equal(DataTableTemplate);
      });

      it('uses `controllerAs` syntax', () => {
        expect(component).to.have.property('controllerAs');
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(DataTableController);
      });
  });
});
