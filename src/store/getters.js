import { routerList } from '@/router'
import { getMenuByRouter } from '@/libs/util'

const getters = {
  menuList: (state, getters) => getMenuByRouter(routerList),
}

export default getters
