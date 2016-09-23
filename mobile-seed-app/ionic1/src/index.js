import dataViz from './dataViz'
import listItem from './listItem'
import login from './login'
import main from './main'
import menu from './menu'

let components = [
  main,
  login,
  menu,
  listItem,
  dataViz,
]

import exosite from 'exosite-pcc/exosite'
import 'exosite-pcc/style/icons/icons.css'

let app = angular.module(
  'starter',
  components.reduce(
    function(all, com) {
      if (com.modules) {
        return all.concat(com.modules)
      } else {
        return all
      }
    }, [
      'ionic',
      exosite.name,
    ]
  )
)

components.forEach(
  function(com) {
    for (let key in com) {
      if (typeof com[key] !== 'function') continue

      if (key === 'controller') {
        app[key](com.controllerName, com[key])
      } else {
        app[key](com[key])
      }
    }
  }
)
