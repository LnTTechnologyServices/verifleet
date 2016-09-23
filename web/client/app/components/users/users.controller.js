let SEARCH_KEYS = ["text", "title", "subtitle", "status", "name"]

class UsersController {
  constructor($ngRedux, $stateParams, auth, $state, userService, store, $timeout) {
    "ngInject";
    this.userService = userService
    this.auth = auth
    this.store = store
    this.$timeout = $timeout
    this.$state = $state

    this.users = []
    this.initialized = false;
    this.search = '';

    this.unsubscribe = $ngRedux.connect(this.mapStateToThis, this.userService)((selectedState, actions) => {
      this.componentWillReceiveStateAndActions(selectedState, actions);
      Object.assign(this, selectedState, actions);
    });

    function loadAfterAuthed(vm) {
      if(vm.auth.isAuthenticated && vm.store.get("token")) {
        vm.getUsersIfNeeded();
      } else {
        vm.$timeout(() => loadAfterAuthed(vm), 50);
      }
    }
    loadAfterAuthed(this);
  }

  $onDestroy() {
    this.unsubscribe();
  }

  // Which part of the Redux global state does our component want to receive?
  mapStateToThis(state) {
    const users = state.users.map( (user) => {
      //convert user to a structure expected by the userListItem card
      return {
        title: user.name,
        subtitle: user.email,
        description: user.jobTitle || 'Technician',
        sideText: user.role,
        icon: user.name.split(' ').map( name => name.charAt(0) ).join(''),
        moreOptions: [ { text: 'Delete' }]
      }
    } );

    const isLoading = state.isLoading;

    return {
      users,
      isLoading
    };
  }

  componentWillReceiveStateAndActions(nextState, nextActions) {
    if(nextState.users.length) {
      console.log("nextState.users: ", nextState.users);
      this.users = nextState.users;
    }
  }
}

export default UsersController;
