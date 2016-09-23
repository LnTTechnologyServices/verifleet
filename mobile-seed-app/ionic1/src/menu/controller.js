export default class controller {
  constructor(
    auth,
    store,
    $ionicHistory,
    $state
  ) {
    let vm = this

    vm.go = function(id) {
      $ionicHistory.nextViewOptions({
        disableBack: true,
      })
      $state.go(id)
    }
    vm.logout = function() {
      auth.signout()
      store.remove('profile')
      store.remove('token')
      $state.go('login')
    }
  }
}

