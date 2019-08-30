import Main from '@/components/main'
import i18n from '@/locale'
export default [{
  path: '/hr',
  name: 'hr',
  redirect: '/hr/employeeList',
  component: Main,
  meta: {
    title: i18n.t('router_hr_hr'),
    icon: 'icon-Nav_personnel'
  },
  children: [
    {
      path: 'employeeList',
      name: 'employeeList',
      component: () => import('@/views/hr/employee/employee.vue'),
      meta: {
        title: i18n.t('router_hr_employeeList')
      }
    },
    {
      path: 'exportDetail',
      name: 'exportDetail',
      component: () => import('@/views/hr/employee/export-detail.vue'),
      meta: {
        title: i18n.t('router_hr_exportDetail'),
        hideInMenu: true
      }
    },
    {
      path: 'empInfo',
      name: 'empInfo',
      component: () => import('@/views/hr/employee/employee-info.vue'),
      meta: {
        title: i18n.t('router_hr_empInfo'),
        hideInMenu: true
      }
    },
    {
      path: 'history',
      name: 'history',
      component: () => import('@/views/hr/employee/history-record.vue'),
      meta: {
        title: i18n.t('router_hr_history'),
        hideInMenu: true
      }
    },
    {
      path: 'taskList',
      name: 'taskList',
      component: () => import('@/views/hr/employee/task-list.vue'),
      meta: {
        title: i18n.t('router_hr_taskList'),
        hideInMenu: true
      }
    },
    {
      path: 'cutEmp',
      name: 'cutEmp',
      component: () => import('@/views/hr/employee/cut-emp.vue'),
      meta: {
        title: i18n.t('router_hr_cutEmp'),
        hideInMenu: true
      }
    },
    {
      path: 'department',
      name: 'department',
      component: () => import('@/views/hr/department/department.vue'),
      meta: {
        title: i18n.t('router_hr_department')
      }
    },
    {
      path: 'depInfo',
      name: 'depInfo',
      component: () => import('@/views/hr/department/department-info.vue'),
      meta: {
        title: i18n.t('router_hr_depInfo'),
        hideInMenu: true
      }
    },
    {
      path: 'position',
      name: 'position',
      component: () => import('@/views/hr/position/position.vue'),
      meta: {
        title: i18n.t('router_hr_position')
      }
    }
  ]
}]
