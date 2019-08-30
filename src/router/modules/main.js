import Main from '@/components/main'
import i18n from '@/locale'

export default [
  {
    path: '/',
    name: '_login',
    redirect: '/login',
    meta: {
      hideInMenu: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/main/login.vue'),
    meta: {
      title: i18n.t('router_main_login'),
      hideInMenu: true,
      noLogin: true
    }
  },
  {
    path: '/new-password',
    name: 'newPassword',
    component: () => import('@/views/main/new-password/index.vue'),
    meta: {
      title: i18n.t('router_main_newPassword'),
      hideInMenu: true
    }
  },
  {
    path: '/lost-password',
    name: 'lostPassword',
    component: () => import('@/views/main/lost-password/index.vue'),
    meta: {
      title: i18n.t('router_main_lostPassword'),
      hideInMenu: true,
      noLogin: true
    }
  },
  {
    path: '/completeCompany',
    name: 'completeCompany',
    component: () => import('@/views/main/complete-company.vue'),
    meta: {
      title: i18n.t('router_main_completeCompany'),
      hideInMenu: true
    }
  },
  {
    path: '/reset-password',
    component: Main,
    meta: {
      title: i18n.t('router_main_resetPassword'),
      hideInMenu: true
    },
    children: [
      {
        path: '',
        name: 'resetPassword',
        component: () => import('@/views/main/reset-password/index.vue')
      }
    ]
  },
  {
    path: '/company',
    component: Main,
    meta: {
      title: i18n.t('router_main_company'),
      hideInMenu: true
    },
    children: [
      {
        path: '',
        name: 'company',
        component: () => import('@/views/main/company.vue')
      }
    ]
  },
  {
    path: '/client-setting',
    component: Main,
    meta: {
      title: i18n.t('router_main_clientSetting'),
      hideInMenu: true
    },
    children: [
      {
        path: '',
        name: 'clientSetting',
        component: () => import('@/views/main/client-setting.vue')
      }
    ]
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/home/index',
    component: Main,
    meta: {
      title: i18n.t('router_main_home'),
      icon: 'icon-Nav_Home'
    },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/home/home.vue'),
        meta: {
          title: i18n.t('router_main_index')
        }
      }
    ]
  }
]
