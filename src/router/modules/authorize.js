import Main from '@/components/main'
import i18n from '@/locale'
export default [{
  path: '/authorize',
  name: 'authorize',
  redirect: '/authorize/authList',
  component: Main,
  meta: {
    title: i18n.t('router_authorize_authorize'),
    icon: 'icon-Nav_warrant'
  },
  children: [
    {
      path: 'authList',
      name: 'authList',
      component: () => import('@/views/authorize/employee/list.vue'),
      meta: {
        title: i18n.t('router_authorize_authList')
      }
    },
    {
      path: 'create',
      name: 'authCreate',
      component: () => import('@/views/authorize/employee/create/index.vue'),
      meta: {
        title: i18n.t('router_authorize_authCreate'),
        hideInMenu: true
      }
    },
    {
      path: 'detail/:id',
      name: 'authDetail',
      component: () => import('@/views/authorize/employee/detail.vue'),
      meta: {
        title: i18n.t('router_authorize_authDetail'),
        hideInMenu: true
      }
    },
    {
      path: 'history',
      name: 'authHistory',
      component: () => import('@/views/authorize/employee/history.vue'),
      meta: {
        title: i18n.t('router_authorize_authHistory'),
        hideInMenu: true
      }
    },
    {
      path: 'device-detail/:id',
      name: 'deviceDetail',
      component: () => import('@/views/authorize/employee/device-detail.vue'),
      meta: {
        title: i18n.t('router_authorize_deviceDetail'),
        hideInMenu: true
      }
    }
  ]
}]
