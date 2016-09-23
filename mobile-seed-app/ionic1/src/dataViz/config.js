import constant from './constant'
import template from './template.html'

export default function config($stateProvider) {
  $stateProvider.state(
    'menu.dataViz', {
      data: {
        requiresLogin: true,
      },
      url: '/dataViz',
      views: {
        menuContent: {
          template,
          controller: constant.controllerName + ' as vm',
        },
      },
    }
  )
}

