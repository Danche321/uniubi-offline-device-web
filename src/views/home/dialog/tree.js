import i18n from '@/locale'

export const quickBtn = [{
  name: i18n.t('home_quick_btn1'),
  quickId: '1',
  disabled: true,
  children: [{
    name: i18n.t('home_quick_btn2'),
    quickId: '1_1',
    url: 'empInfo'
  }]
}, {
  name: i18n.t('home_quick_btn3'),
  quickId: '2',
  disabled: true,
  children: [{
    name: i18n.t('home_quick_btn4'),
    quickId: '2_1',
    url: 'depInfo'
  }]
}, {
  name: i18n.t('home_quick_btn5'),
  quickId: '3',
  disabled: true,
  children: [{
    name: i18n.t('home_quick_btn6'),
    quickId: '3_1',
    url: 'addManual'
  }, {
    name: i18n.t('home_quick_btn7'),
    quickId: '3_2',
    url: 'addAuto'
  }, {
    name: i18n.t('home_quick_btn8'),
    quickId: '3_3',
    url: 'deviceCheck'
  }, {
    name: i18n.t('home_quick_btn9'),
    quickId: '3_4',
    url: 'batch'
  }, {
    name: i18n.t('home_quick_btn10'),
    quickId: '3_5',
    url: 'groupAdd'
  }]
}, {
  name: i18n.t('home_quick_btn11'),
  quickId: '4',
  disabled: true,
  children: [{
    name: i18n.t('home_quick_btn12'),
    quickId: '4_1',
    url: 'authCreate'
  }]
}]

export const quickEnter = [{
  name: i18n.t('home_quick_enter1'),
  quickId: '1',
  disabled: true,
  children: [{
    name: i18n.t('home_quick_enter2'),
    quickId: '1_1',
    icon: 'icon-Nav_personnel',
    url: 'employeeList'
  }, {
    name: i18n.t('home_quick_enter3'),
    quickId: '1_2',
    icon: 'icon-history_record',
    url: 'history'
  }, {
    name: i18n.t('home_quick_enter4'),
    quickId: '1_3',
    icon: 'icon-department',
    url: 'department'
  }, {
    name: i18n.t('home_quick_enter5'),
    quickId: '1_4',
    icon: 'icon-job_title',
    url: 'position'
  }]
}, {
  name: i18n.t('home_quick_enter6'),
  quickId: '2',
  disabled: true,
  children: [{
    name: i18n.t('home_quick_enter7'),
    quickId: '2_1',
    icon: 'icon-Nav_device',
    url: 'deviceList'
  }, {
    name: i18n.t('home_quick_enter8'),
    quickId: '2_2',
    icon: 'icon-Attendance-machine',
    url: 'group'
  }]
}, {
  name: i18n.t('home_quick_enter9'),
  quickId: '3',
  disabled: true,
  children: [{
    name: i18n.t('home_quick_enter10'),
    quickId: '3_1',
    icon: 'icon-warrant',
    url: 'authList'
  }, {
    name: i18n.t('home_quick_enter11'),
    quickId: '3_2',
    icon: 'icon-history_record',
    url: 'authHistory'
  }]
}, {
  name: i18n.t('home_quick_enter12'),
  quickId: '4',
  disabled: true,
  children: [{
    name: i18n.t('home_quick_enter13'),
    quickId: '4_1',
    icon: 'icon-Nav_record',
    url: 'identify'
  }]
}, {
  name: i18n.t('home_quick_enter14'),
  quickId: '5',
  icon: 'icon-Client',
  url: 'clientSetting'
}, {
  name: i18n.t('home_quick_enter15'),
  quickId: '6',
  icon: 'icon-company',
  url: 'company'
}]
