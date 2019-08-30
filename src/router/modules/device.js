import Main from '@/components/main'
import i18n from '@/locale'
export default [{
  path: '/device',
  name: 'device',
  redirect: '/device/deviceList',
  component: Main,
  meta: {
    title: i18n.t('router_device_device'),
    icon: 'icon-Nav_device'
  },
  children: [
    {
      path: 'deviceList',
      name: 'deviceList',
      component: () => import('@/views/device/device-list/device-list.vue'),
      meta: {
        title: i18n.t('router_device_deviceList')
      }
    },
    {
      path: 'batch',
      name: 'batch',
      component: () => import('@/views/device/device-list/batch-operate.vue'),
      meta: {
        title: i18n.t('router_device_batch'),
        hideInMenu: true
      }
    },
    {
      path: 'config',
      name: 'config',
      component: () => import('@/views/device/device-list/device-config.vue'),
      meta: {
        title: i18n.t('router_device_config'),
        hideInMenu: true
      }
    },
    {
      path: 'wifi',
      name: 'wifi',
      component: () => import('@/views/device/device-list/device-wifi.vue'),
      meta: {
        title: i18n.t('router_device_wifi'),
        hideInMenu: true
      }
    },
    {
      path: 'time',
      name: 'time',
      component: () => import('@/views/device/device-list/device-time.vue'),
      meta: {
        title: i18n.t('router_device_time'),
        hideInMenu: true
      }
    },
    {
      path: 'upgrade',
      name: 'upgrade',
      component: () => import('@/views/device/device-list/device-upgrade.vue'),
      meta: {
        title: i18n.t('router_device_upgrade'),
        hideInMenu: true
      }
    },
    {
      path: 'group',
      name: 'group',
      component: () => import('@/views/device/device-list/group-list.vue'),
      meta: {
        title: i18n.t('router_device_group')
      }
    },
    {
      path: 'add-manual',
      name: 'addManual',
      component: () => import('@/views/device/device-list/device-add-manual.vue'),
      meta: {
        title: i18n.t('router_device_addManual'),
        hideInMenu: true
      }
    },
    {
      path: 'add-auto',
      name: 'addAuto',
      component: () => import('@/views/device/device-list/device-add-auto.vue'),
      meta: {
        title: i18n.t('router_device_addAuto'),
        hideInMenu: true
      }
    },
    {
      path: 'device-check',
      name: 'deviceCheck',
      component: () => import('@/views/device/device-list/device-check.vue'),
      meta: {
        title: i18n.t('router_device_deviceCheck'),
        hideInMenu: true
      }
    },
    {
      path: 'group-add/:id?',
      name: 'groupAdd',
      component: () => import('@/views/device/device-list/group-add.vue'),
      meta: {
        title: i18n.t('router_device_groupAdd'),
        hideInMenu: true
      }
    }
  ]
}]
