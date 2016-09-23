export default function run(
  auth,
  jwtHelper,
  store,
  $rootScope,
  $state
) {
  auth.hookEvents()

  let refreshingToken = null
  $rootScope.$on('$locationChangeStart', () => {
    let token = store.get('token')
    let refreshToken = store.get('refreshToken')

    if (token) {
      if (!jwtHelper.isTokenExpired(token)) {
        if (!auth.isAuthenticated) {
          auth.authenticate(store.get('profile'), token)
        }
      } else {
        if (refreshToken) {
          if (refreshingToken === null) {
            refreshingToken = auth.refreshIdToken(refreshToken)
              .then(
                idToken => {
                  store.set('token', idToken)
                  auth.authenticate(store.get('profile'), idToken)
                }
              )
              .finally(
                () => {
                  refreshingToken = null
                }
              )
          }
          return refreshingToken
        } else {
          $state.go('login')
        }
      }
    }
  })
}

