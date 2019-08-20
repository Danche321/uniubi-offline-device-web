export const quickBtn = [{
  name: '人事管理',
  quickId: '1',
  disabled: true,
  children: [{
    name: '新增员工',
    quickId: '1_1',
    url: 'empInfo'
  }]
}, {
  name: '部门管理',
  quickId: '2',
  disabled: true,
  children: [{
    name: '添加部门',
    quickId: '2_1',
    url: 'depInfo'
  }]
}, {
  name: '设备管理',
  quickId: '3',
  disabled: true,
  children: [{
    name: '手动添加设备',
    quickId: '3_1',
    url: 'addManual'
  }, {
    name: '自动搜索设备',
    quickId: '3_2',
    url: 'addAuto'
  }, {
    name: '检查设备',
    quickId: '3_3',
    url: 'deviceCheck'
  }, {
    name: '批量操作设备',
    quickId: '3_4',
    url: 'batch'
  }, {
    name: '添加设备组',
    quickId: '3_5',
    url: 'groupAdd'
  }]
}, {
  name: '授权管理',
  quickId: '4',
  disabled: true,
  children: [{
    name: '新增授权',
    quickId: '4_1',
    url: 'authCreate'
  }]
}]

export const quickEnter = [{
  name: '人事管理',
  quickId: '1',
  disabled: true,
  children: [{
    name: '员工列表',
    quickId: '1_1',
    icon: 'icon-Nav_personnel',
    url: 'employeeList'
  }, {
    name: '员工历史上传记录',
    quickId: '1_2',
    icon: 'icon-history_record',
    url: 'history'
  }, {
    name: '部门列表',
    quickId: '1_3',
    icon: 'icon-department',
    url: 'department'
  }, {
    name: '职称列表',
    quickId: '1_4',
    icon: 'icon-job_title',
    url: 'position'
  }]
}, {
  name: '设备管理',
  quickId: '2',
  disabled: true,
  children: [{
    name: '设备列表',
    quickId: '2_1',
    icon: 'icon-Nav_device',
    url: 'deviceList'
  }, {
    name: '设备组',
    quickId: '2_2',
    icon: 'icon-Attendance-machine',
    url: 'group'
  }]
}, {
  name: '授权管理',
  quickId: '3',
  disabled: true,
  children: [{
    name: '员工授权',
    quickId: '3_1',
    icon: 'icon-warrant',
    url: 'authList'
  }, {
    name: '历史授权记录',
    quickId: '3_2',
    icon: 'icon-history_record',
    url: 'authHistory'
  }]
}, {
  name: '识别记录',
  quickId: '4',
  disabled: true,
  children: [{
    name: '识别记录',
    quickId: '4_1',
    icon: 'icon-Nav_record',
    url: 'identify'
  }]
}, {
  name: '客户端设置',
  quickId: '5',
  icon: 'icon-Client',
  url: 'clientSetting'
}, {
  name: '公司信息',
  quickId: '6',
  icon: 'icon-company',
  url: 'company'
}]
