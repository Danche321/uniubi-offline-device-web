import Main from '@/components/main'

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
      title: '登录',
      hideInMenu: true,
      noLogin: true
    }
  },
  {
    path: '/new-password',
    name: 'newPassword',
    component: () => import('@/views/main/new-password/index.vue'),
    meta: {
      title: '设置新密码',
      hideInMenu: true
    }
  },
  {
    path: '/lost-password',
    name: 'lostPassword',
    component: () => import('@/views/main/lost-password/index.vue'),
    meta: {
      title: '找回密码',
      hideInMenu: true,
      noLogin: true
    }
  },
  {
    path: '/completeCompany',
    name: 'completeCompany',
    component: () => import('@/views/main/complete-company.vue'),
    meta: {
      title: '完善公司信息',
      hideInMenu: true
    }
  },
  {
    path: '/reset-password',
    component: Main,
    meta: {
      title: '修改密码',
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
      title: '公司信息',
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
      title: '客户端设置',
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
      title: '首页',
      icon: 'icon-Nav_Home'
    },
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/home/home.vue'),
        meta: {
          title: '首页'
        }
      }
    ]
  }
]
