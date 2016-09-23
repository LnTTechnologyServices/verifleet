// This file is mainly responsible for changing the layout when the user is
// not logged in or when viewing the map page, since the offsets have to be
// different on the maps page and the login page.
// There may be a better way to handle this that isn't centralized,
// but for now it is a working solution

class AppController {
  constructor($ngRedux, $state, $rootScope) {
    "ngInject";
    this.authenticated = false
    this.marginTop = '100px';

    $rootScope.$on("$stateChangeStart", (event, toState) => {
      console.log("State: ", toState.name);
      this.isLogin = toState.name === "login";
      this.isMap = toState.name === "map";
      this.setAuthedMargin();
    })

    this.unsubscribe = $ngRedux.connect(this.mapStateToThis)((selectedState, actions) => {
      this.componentWillReceiveStateAndActions(selectedState, actions);
      Object.assign(this, selectedState, actions);
    });
  }

  setAuthedMargin() {
    if(this.isMap) {
      this.marginTop = '65px'
      this.offsetGtMd = 0
    } else if(this.isLogin) {
      this.marginTop = "0px"
      this.offsetGtMd = 10
    } else {
      this.marginTop = '100px'
      this.offsetGtMd = 5
    }
  }

  $onDestroy() {
    this.unsubscribe();
  }

  mapStateToThis(state) {
    const current_user = state.current_user;
    return {
      current_user
    };
  }

  componentWillReceiveStateAndActions(nextState, nextActions) {
    if(nextState.current_user) {
      if(nextState.current_user.email) {
        this.authenticated = true;
        this.setAuthedMargin();
      } else {
        this.authenticated = false;
        this.offsetGtMd = 10
        this.marginTop = '0px';
      }
    }
  }
}

export default AppController;
