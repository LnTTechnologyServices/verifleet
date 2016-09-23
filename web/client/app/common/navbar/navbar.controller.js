class NavbarController {
  constructor(auth, store, $state, $ngRedux, userService, deviceService) {
    "ngInject";
    this.auth = auth
    this.store = store
    this.$state = $state
    this.$ngRedux = $ngRedux
    this.userService = userService
    this.deviceService = deviceService
  }
  logout() {
    this.auth.signout();
    this.store.remove('profile');
    this.store.remove('token');
    this.$ngRedux.dispatch(this.userService.userLoggedOut());
    this.$ngRedux.dispatch(this.deviceService.unsubscribeFromDevices());
    this.$state.go("login");
  }
}

export default NavbarController;
