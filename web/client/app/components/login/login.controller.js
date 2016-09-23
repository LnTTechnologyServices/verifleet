let loginLogo = require("./login_logo.png")

class LoginController {
  constructor(auth, projectConfig) {
    'ngInject';
    this.projectConfig = projectConfig
    this.auth = auth;
    this.loginLogo = loginLogo
  }
  signin() {
    this.auth.signin({
      icon: require('./parker-yellow.png'),
      closable: false,
      theme: 'parker',
      socialBigButtons: true,
      authParams: {
        scope: 'openid name email' // Specify the scopes you want to retrieve
      }
    })

    this.auth.config.auth0lib.on('signin ready', function() {
      document.querySelector('.a0-action button')
        .innerText = 'LOGIN'

      document.querySelector('.a0-forgot-pass')
        .innerText = 'RESET PASSWORD'

      document.querySelector('.a0-body-content a span:last-child')
        .innerText = 'REQUEST ACCOUNT'

      document.querySelector('.a0-icon-container .a0-avatar-guest')
        .src = require('./RGBgoldwht_tagline.png')

      document.querySelector('.a0-theme-parker')
        .style.display = 'block'
    });
  }
}

export default LoginController;
