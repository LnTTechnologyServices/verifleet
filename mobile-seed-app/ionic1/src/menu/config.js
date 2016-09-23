import constant from './constant'
import template from './template.html'

export default function config($stateProvider) {
  $stateProvider.state(
    'menu', {
      abstract: true,
      controller: constant.controllerName + ' as vm',
      template,
      url: '',
    }
  )
}

