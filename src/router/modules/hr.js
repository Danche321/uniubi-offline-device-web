import Main from '@/components/main'

export default [{
  path: '/hr',
  name: 'hr',
  redirect: '/hr/employeeList',
  component: Main,
  meta: {
    title: '人事管理',
    icon: 'icon-Nav_personnel'
  },
  children: [
    {
      path: 'employeeList',
      name: 'employeeList',
      component: () => import('@/views/hr/employee/employee.vue'),
      meta: {
        title: '员工列表'
      }
    },
    {
      path: 'exportDetail',
      name: 'exportDetail',
      component: () => import('@/views/hr/employee/export-detail.vue'),
      meta: {
        title: '上传记录详情',
        hideInMenu: true
      }
    },
    {
      path: 'empInfo',
      name: 'empInfo',
      component: () => import('@/views/hr/employee/employee-info.vue'),
      meta: {
        title: '添加员工',
        hideInMenu: true
      }
    },
    {
      path: 'history',
      name: 'history',
      component: () => import('@/views/hr/employee/history-record.vue'),
      meta: {
        title: '历史上传记录',
        hideInMenu: true
      }
    },
    {
      path: 'taskList',
      name: 'taskList',
      component: () => import('@/views/hr/employee/task-list.vue'),
      meta: {
        title: '任务列表',
        hideInMenu: true
      }
    },
    {
      path: 'cutEmp',
      name: 'cutEmp',
      component: () => import('@/views/hr/employee/cut-emp.vue'),
      meta: {
        title: '详情',
        hideInMenu: true
      }
    },
    {
      path: 'department',
      name: 'department',
      component: () => import('@/views/hr/department/department.vue'),
      meta: {
        title: '部门管理'
      }
    },
    {
      path: 'depInfo',
      name: 'depInfo',
      component: () => import('@/views/hr/department/department-info.vue'),
      meta: {
        title: '添加部门',
        hideInMenu: true
      }
    },
    {
      path: 'position',
      name: 'position',
      component: () => import('@/views/hr/position/position.vue'),
      meta: {
        title: '职称管理'
      }
    }
  ]
}]
