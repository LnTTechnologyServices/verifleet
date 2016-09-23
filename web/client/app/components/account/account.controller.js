
class AccountController {
  constructor($ngRedux, $stateParams, auth, $state, userService, store, $timeout) {
    "ngInject";
    this.userService = userService;
    this.auth = auth;
    this.store = store;
    this.$timeout = $timeout;
    this.$state = $state;

    this.currentPassword = "";
    this.newPassword = "";
    this.newPasswordConfirm = "";

    this.units = "";
    this.userProfile = {};

    this.unsubscribe = $ngRedux.connect(this.mapStateToThis, this.userService)((selectedState, actions) => {
      this.componentWillReceiveStateAndActions(selectedState, actions);
      Object.assign(this, selectedState, actions);
    });

    function loadAfterAuthed(vm) {
      if(vm.auth.isAuthenticated && vm.current_user) {
        vm.getUser(vm.current_user.email);  //make sure user's data is loaded from DB. It will be accessible in vm.users[], which is a general users array, so you have to find it by email
        vm.getUserNotifications(vm.current_user.email);
      } else {
        vm.$timeout(() => loadAfterAuthed(vm), 50);
      }
    }
    loadAfterAuthed(this);
  }

  $onDestroy() {
    this.unsubscribe();
  }

  toggleNotifications() {
    this.setUserNotifications(this.myNotificationPreferences);
  }

  // Which part of the Redux global state does our component want to receive?
  mapStateToThis(state) {
    const current_user = state.current_user;
    const users = state.users;
    const notifications = state.notifications;
    return {
      current_user,
      users,
      notifications
    };
  }

  componentWillReceiveStateAndActions(nextState, nextActions) {
    if(nextState.current_user) {
      this.current_user = nextState.current_user;
    }

    if(nextState.notifications) {
      this.myNotificationPreferences = _.find(nextState.notifications, notification => {
        return this.current_user.email == notification.email;
      });
    }

    if(nextState.users) {
      const me = _.find(nextState.users, user => {
        return this.current_user.email == user.email;
      });
      if(me) {
        this.userProfile = me;
      }
    }
  }
}

export default AccountController;
