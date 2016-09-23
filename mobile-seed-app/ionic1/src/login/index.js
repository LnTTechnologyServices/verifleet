import config from './config'
import constant from './constant'
import controller from './controller'
import run from './run'

export default {
  config,
  controller,
  controllerName: constant.controllerName,
  modules: constant.modules,
  run,
}

