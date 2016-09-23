export default function run($ionicPlatform) {
  $ionicPlatform.ready(
    () => {
      if (
        window.cordova &&
        window.cordova.plugins.Keyboard
      ) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true)
        cordova.plugins.Keyboard.disableScroll(true)
      }

      if (window.StatusBar) {
        StatusBar.styleDefault()
      }
    }
  )
}
