import constant from './constant'
import template from './template.html'

export default function config($stateProvider) {
  $stateProvider.state(
    'menu.listItem', {
      data: {
        requiresLogin: true,
      },
      url: '/listItem',
      views: {
        menuContent: {
          template,
          controller: constant.controllerName + ' as vm',
        },
      },
    }
  )
}

