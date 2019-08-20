import Main from '@/components/main'

export default [{
  path: '/device',
  name: 'device',
  redirect: '/device/deviceList',
  component: Main,
  meta: {
    title: '设备管理',
    icon: 'icon-Nav_device'
  },
  children: [
    {
      path: 'deviceList',
      name: 'deviceList',
      component: () => import('@/views/device/device-list/device-list.vue'),
      meta: {
        title: '设备列表'
      }
    },
    {
      path: 'batch',
      name: 'batch',
      component: () => import('@/views/device/device-list/batch-operate.vue'),
      meta: {
        title: '批量操作',
        hideInMenu: true
      }
    },
    {
      path: 'config',
      name: 'config',
      component: () => import('@/views/device/device-list/device-config.vue'),
      meta: {
        title: '设备配置',
        hideInMenu: true
      }
    },
    {
      path: 'wifi',
      name: 'wifi',
      component: () => import('@/views/device/device-list/device-wifi.vue'),
      meta: {
        title: '网络配置',
        hideInMenu: true
      }
    },
    {
      path: 'time',
      name: 'time',
      component: () => import('@/views/device/device-list/device-time.vue'),
      meta: {
        title: '设备校时',
        hideInMenu: true
      }
    },
    {
      path: 'upgrade',
      name: 'upgrade',
      component: () => import('@/views/device/device-list/device-upgrade.vue'),
      meta: {
        title: '固件升级',
        hideInMenu: true
      }
    },
    {
      path: 'group',
      name: 'group',
      component: () => import('@/views/device/device-list/group-list.vue'),
      meta: {
        title: '设备组'
      }
    },
    {
      path: 'add-manual',
      name: 'addManual',
      component: () => import('@/views/device/device-list/device-add-manual.vue'),
      meta: {
        title: '手动添加设备',
        hideInMenu: true
      }
    },
    {
      path: 'add-auto',
      name: 'addAuto',
      component: () => import('@/views/device/device-list/device-add-auto.vue'),
      meta: {
        title: '自动添加设备',
        hideInMenu: true
      }
    },
    {
      path: 'device-check',
      name: 'deviceCheck',
      component: () => import('@/views/device/device-list/device-check.vue'),
      meta: {
        title: '检查设备',
        hideInMenu: true
      }
    },
    {
      path: 'group-add/:id?',
      name: 'groupAdd',
      component: () => import('@/views/device/device-list/group-add.vue'),
      meta: {
        title: '添加组',
        hideInMenu: true
      }
    }
  ]
}]
