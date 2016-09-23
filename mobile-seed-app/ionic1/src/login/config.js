import constant from './constant'

export default function config(
  authProvider,
  jwtInterceptorProvider,
  $httpProvider,
  $stateProvider
) {
  $stateProvider.state(
    'login', {
      cache: false,
      controller: constant.controllerName + ' as vm',
      url: '/login',
    }
  )

  authProvider.init({
    clientID: 'WEehSzsjp3hosMfkfOZfpWMceVFdnFBa',
    domain: 'exosite-pcc-seed.auth0.com',
    loginState: 'login',
  })

  jwtInterceptorProvider.tokenGetter = function(store, jwtHelper, auth) {
    let idToken = store.get('token')
    let refreshToken = store.get('refreshToken')

    if (!idToken || !refreshToken) return null

    if (jwtHelper.isTokenExpired(idToken)) {
      return auth.refreshIdToken(refreshToken)
        .then(
          idToken => {
            store.set('token', idToken)
            return idToken
          }
        )
    } else {
      return idToken
    }
  }

  $httpProvider.interceptors.push('jwtInterceptor')
}

