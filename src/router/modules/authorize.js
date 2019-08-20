import Main from '@/components/main'

export default [{
  path: '/authorize',
  name: 'authorize',
  redirect: '/authorize/authList',
  component: Main,
  meta: {
    title: '授权管理',
    icon: 'icon-Nav_warrant'
  },
  children: [
    {
      path: 'authList',
      name: 'authList',
      component: () => import('@/views/authorize/employee/list.vue'),
      meta: {
        title: '员工授权'
      }
    },
    {
      path: 'create',
      name: 'authCreate',
      component: () => import('@/views/authorize/employee/create/index.vue'),
      meta: {
        title: '新增授权',
        hideInMenu: true
      }
    },
    {
      path: 'detail/:id',
      name: 'authDetail',
      component: () => import('@/views/authorize/employee/detail.vue'),
      meta: {
        title: '授权详情',
        hideInMenu: true
      }
    },
    {
      path: 'history',
      name: 'authHistory',
      component: () => import('@/views/authorize/employee/history.vue'),
      meta: {
        title: '历史授权记录',
        hideInMenu: true
      }
    },
    {
      path: 'device-detail/:id',
      name: 'deviceDetail',
      component: () => import('@/views/authorize/employee/device-detail.vue'),
      meta: {
        title: '设备人员详情',
        hideInMenu: true
      }
    }
  ]
}]
