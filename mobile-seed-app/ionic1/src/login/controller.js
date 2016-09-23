export default class {
  constructor(
    auth,
    store,
    $log,
    $state
  ) {
    auth.signin({
        authParams: {
          device: 'Mobile device',
          scope: 'openid offline_access',
        },
        closable: false,
        icon: '/img/Parker-yellow.png',
        socialBigButtons: true,
        theme: 'parker',
      }, (profile, token, accessToken, state, refreshToken) => {
        store.set('profile', profile)
        store.set('token', token)
        store.set('refreshToken', refreshToken)
        $state.go('menu.listItem')
      },
      e => {
        $log.error(e)
      }
    )

    auth.config.auth0lib.on('ready', () => {
      document.querySelector('.a0-icon-container .a0-avatar-guest')
        .src = '/img/RGBgoldwht_tagline.png'

      document.querySelector('.a0-theme-parker')
        .style.display = 'block'
    })

    auth.config.auth0lib.on('signin ready', () => {
      document.querySelector('.a0-action button')
        .innerText = 'LOGIN'

      document.querySelector('.a0-forgot-pass')
        .innerText = 'RESET PASSWORD'

      document.querySelector('.a0-body-content a span:last-child')
        .innerText = 'REQUEST ACCOUNT'
    })
  }
}

