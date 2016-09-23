let headerUrl = require("./header_logo.png");

class HeaderController {
  constructor($mdSidenav, $ngRedux) {
    "ngInject";
    this.headerUrl = headerUrl;
    this.$mdSidenav = $mdSidenav;
    this.loading = false;
    this.unsubscribe = $ngRedux.connect(this.mapStateToThis)((selectedState, actions) => {
      this.componentWillReceiveStateAndActions(selectedState, actions);
      Object.assign(this, selectedState, actions);
    });
  }

  $onDestroy() {
    this.unsubscribe();
  }

  mapStateToThis(state) {
    const isLoading = state.isLoading;
    return {
      isLoading
    }
  }

  componentWillReceiveStateAndActions(nextState, nextActions) {
    if(nextState.isLoading) {
      if(_.some(nextState.isLoading)) {
        this.loading = true;
      } else {
        this.loading = false;
      }
    }
  }

  toggleSidebar() {
    this.$mdSidenav('left').toggle();
  }
}

export default HeaderController;
