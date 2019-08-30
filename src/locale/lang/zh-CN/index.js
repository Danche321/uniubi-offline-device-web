import router from './router'
import components from './components'
import lib from './lib'
import statics from './static' // static 是关键字
import common from './common'
import department from './hr/department'
import position from './hr/position'
import employee from './hr/employee'
import deviceList from './device/device-list'
import authorize from './authorize'
import identify from './identify'
import device from './device'
import main from './main'
import home from './home'
import rule from './rule'
import error from './error'

export default {
  ...common,
  ...authorize,
  ...identify,
  ...common,
  ...main,
  ...router,
  ...components,
  ...lib,
  ...device,
  ...statics,
  ...common,
  ...home,
  ...rule,
  ...error,
  ...employee,
  ...department,
  ...position,
  ...deviceList
}
