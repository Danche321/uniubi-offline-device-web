export default {
  // 设备校时
  device_time: {
    title: '设备校时',
    form: {
      timeArea: '时区',
      beijing: '北京',
      typeLabel: '校时方式',
      setManual: '手动校时',
      selfTime: '本机时间',
      tip1: '提示：设置成功后，若设备为连入公网，则此时间会生效',
      tip2: '若设备连入公网，则会重新使用工网时间',
      message: '请填写完整时间'
    },
    dialog: {
      title: '校时失败设备',
      deviceName: '设备名称',
      deviceKey: '设备序列号',
      failReason: '失败原因'
    },
    successMsg: '设备校时成功！'
  },
  // 网络配置
  device_wifi: {
    title: '网络配置',
    form: {
      name: 'WI-FI名称',
      password: 'WI_FI密码',
      ipType: {
        label: 'IP类型',
        value: '固定IP'
      },
      getIpAuto: '自动获取IP',
      fixSet: '固定设置',
      website: 'IP地址',
      gateway: '网关',
      btnConnect: '连接',
      btnWiredSet: '有线配置'
    },
    dialogWire: {
      title: '有线配置',
      IpType: 'IP类型',
      fixIp: '固定IP',
      getIpAuto: '自动获取IP',
      fixSet: '固定设置',
      website: 'IP地址',
      gateway: '网关',
      tip: '配置保存成功后，设备连上网线即生效'
    },
    dialogFail: {
      title: '网络配置失败设备',
      deviceName: '设备名称',
      deviceKey: '设备序列号',
      failReason: '失败原因'
    },
    message: {
      requiredName: '请输入WI-FI名称',
      requiredPassword: '请输入WI-FI密码',
      requiredIp: '请输入IP地址',
      requiredDNS: '请输入DNS',
      requiredGateway: '请输入网关'
    },
    setSuccessMsg: '设备网络配置成功！',
    saveSuccessMsg: '设备网络保存成功！'
  },
  // 固件升级
  device_upgrade: {
    title: '固件升级',
    uploadLabel: '上传固件：',
    select: '选择',
    upgrade: '升级',
    dialog: {
      title: '校时失败设备',
      deviceName: '设备名称',
      deviceKey: '设备序列号',
      failReason: '失败原因'
    },
    message: {
      requiredFirmware: '还未上传固件',
      upgradeSuccess: '固件升级成功！',
      fileNoSupport: '文件格式不支持',
      packageError: '升级包包名错误,无法升级'
    }
  },
  // 设备配置
  device_config: {
    title: '设备配置',
    generalParams: {
      title: '通用参数',
      timeWindow: '时间窗',
      timeWindowTip: '在对应时间窗内，设备只会上传一次识别记录',
      second: '秒',
      recRank: '活体检测',
      recRankTip: '检测是真人还是照片',
      identifyDistance: '识别距离',
      identifyDistanceTip: '例如识别距离在0.5米以内，设备只会检测0.5米以内的人脸',
      miDistance: '米以内',
      noDistance: '无限制',
      delayTimeForCloseDoor: '继电器控制时间',
      delayTimeForCloseDoor_tip1: '继电器控制开门到关门之间的时间间隔',
      delayTimeForCloseDoor_tip2: '请输入100-25500之间的整数，向下取整百'
    },
    identifyParams: {
      title: '识别参数',
      successParams: '识别成功参数',
      ttsModType: '语音播报模式',
      ttsModTypeTip: '识别成功后语音播报内容',
      ttsModTypeTip2: '允许{name}、{tag}、数字、英文和汉字',
      ttsModTypeTip3: '允许{phone}、{idcardNum}、{id}、数字、英文和英文符号',
      ttsModTypeExample: '如：{name}欢迎光临',
      modName: '播报名字',
      modNone: '不播报',
      modCustom: '自定义',
      screen1: '屏幕显示文字1',
      screen1ShowName: '显示名字',
      screen1ShowNone: '不显示内容',
      screen1ShowCustom: '自定义',
      screen2: '屏幕显示文字2',
      screen2IdentifySuccess: '识别成功',
      screen2Custom: '自定义',
      comModType: '串口输出模式',
      comModTypeTip1: '串口支持输出韦根信号，设备需要外接串口→韦根信号转换小板，小板由本公司定制。自定义内容传入格式',
      comModTypeTip2: '韦根26：#26WG{idcardNum}#，韦根34：#34WG{idcardNum}#',
      comModTypeTip3: '注意：{idcardNum}+数字组合后，韦根26范围为1-65535，有效范围为5位；韦根34范围为1-4294967295，有效范围为10位。若超出范围，则输出的信号会进行转换，输出无效信号。',
      comModTypeOpen: '开门',
      comModTypeNoOutPut: '不输出',
      comModTypeOutPutId: '输出人员id',
      comModTypeOutPutCard: '输出idcardNum',
      comModTypeOutPutPhone: '输出phone',
      comModTypeCustom: '自定义',
      recSucWiegandType: '韦根输出模式',
      recSucWiegandTypeTip: '{idcardNum}+数字组合后，韦根26范围为1-65535，有效范围为5位；韦根34范围为1-4294967295，有效范围为10位。若超出范围，则输出的信号会进行转换，输出无效信号',
      recSucWiegandTypeNoOutput: '不输出',
      recSucWiegandTypeWk: '韦根',
      onlyNumber: '只允许数字',
      isOpenRelay: '继电器输出',
      isOpenRelayTip: '继电器输出打开，则识别后会输出开关量信号',
      failParams: '识别失败参数',
      identifyFail: '识别失败',
      identifyFailTip: '控制设备是否提示识别失败,开启后将保存陌生人的记录和现场抓拍照片',
      identifyFailCount: '识别失败判定次数',
      identifyFailCountTip: '设备比对一定次数，均不通过，则判定为识别失败。次数越大，精度越高，时间越长范围（1-20的整数）',
      modFailContent: '识别失败后语音播报内容',
      modFailContent2: '播报识别失败',
      modRule: '只允许数字、英文和汉字',
      modExample: '如：注意陌生人！',
      screenShowText: '屏幕显示文字',
      showFail: '显示识别失败',
      modRule2: '只允许数字、中英文和中英文符号',
      modRule4: '允许数字、英文和英文符号',
      thunkModeTip1: '串口支持输出韦根信号，设备需要外接串口→韦根信号转换小板，小板由本公司定制。',
      thunkModeTip2: '注意：韦根26范围为1-65535，有效范围为5位；韦根34范围为1-4294967295，有效范围为10位。若超出范围，则输出的信号会进行转换，输出无效信号。',
      thunkModeTip3: '韦根26范围为1-65535，有效范围为5位；韦根34范围为1-4294967295，有效范围为10位。若超出范围，则输出的信号会进行转换，输出无效信号。',
      noAccessParams: '权限不足参数',
      noAccessParamsTip: '识别成功后提示权限不足，例如：甲在08：00-20：00方可进入公司，然而他在21：00来到公司，则甲为权限不足',
      noAccessModTip: '权限不足时语音播报内容',
      noAccessNameTip: '播报姓名权限不足',
      modRule3: '允许{name}、{tag}、数字、英文和汉字',
      nameExample: '如：{name}权限不足',
      name: '姓名',
      deviceRule3: '允许{name}、{tag}、数字、中英文和中英文符号',
      nameRule3: '如：{name}权限不足！',
      noAccess: '权限不足',
      thunkTip1: '串口支持输出韦根信号，设备需要外接串口→韦根信号转换小板，小板由本公司定制。自定义内容传入格式：',
      thunkTip2: '韦根26：#26WG{idcardNum}#，韦根34：#34WG{idcardNum}#',
      thunkTip4: '允许{phone}、{idcardNum}、{id}、数字中英文和中英文符号',
      thunkTip3: '串口支持输出韦根信号'
    },
    showParams: {
      title: '显示参数',
      screenArrow: '屏幕方向',
      arrowAcross: '横屏',
      arrowColumn: '竖屏',
      showText: '显示文字',
      hidden: '不显示',
      deviceGroup: '设备组',
      custom: '自定义',
      scrDisplayText1Content: '如：宇泛智能科技有限公司',
      deviceName: '设备名称',
      scrDisplayText2Content: '如：东门口设备',
      showImg: '显示图片',
      previewDefaultImg: '查看默认图',
      imgStandard1: '照片比例1:1，大小不得超过2M',
      imgStandard2: '文件格式支持jpg、jpeg、png',
      imgStandard3: '如：公司logo',
      imgStandard4: '如：二维码',
      imgStandard5: '用于设备禁用时的展示',
      showConfig: '显示设置',
      deviceKey: '设备序列号',
      personCount: '人数',
      disabledImg: '禁用界面图片',
      bigScreen: '大屏模式',
      normalType: '传统模式',
      customType: '自定义模式',
      showForBig: '用于大屏展示',
      slogan: '标语',
      intro: '简介'
    },
    identifyType: {
      title: '识别模式',
      photoIdentify: '人脸识别',
      identifyScores: '人脸识别阈值',
      identifyScoresTip: '请输入1~100的整数，分数越高，识别准确率越高。为保证准确率，建议值50~100',
      moreIdentify: '多人识别',
      moreIdentifyTip: '识别区域内出现的人脸均会检测',
      singleIdentify: '单人识别',
      singleIdentifyTip: '识别区域只检测最大人脸',
      cardIdentify: '刷卡识别',
      cardIdentifyTip: '当前刷卡识别与人卡合一不可共存，因为它们使用同一个串口输出',
      recModeCardIntf: '卡号传输接口',
      recModeCardIntfTip: '（接口类型切换后需要重启设备才能生效）',
      chunk: '串口',
      recModeCardHardware: '外接硬件类型',
      hardware1: 'IC读卡器',
      hardware2: '新中新',
      hardware3: '精伦',
      hardware4: '中控',
      hardware5: '华视',
      personCard: '人卡合一',
      personCardTip: '当前刷卡识别与人卡合一不可共存，因为它们使用同一个串口输出',
      pearsonWithCard: '人证比对',
      pearsonWithCardTip: '人证比对、刷卡、人卡合一不可使用相同的卡号传输接口',
    },
    dialog: {
      title: '配置失败设备',
      deviceName: '设备名称',
      deviceKey: '设备序列号',
      failReason: '失败原因'
    },
    message: {
      rule1: '请输入语音播报自定义内容',
      rule2: '请输入1-255位字符',
      rule3: '允许{name}、{tag}、数字、英文和汉字',
      rule4: '请输入屏幕显示文字',
      rule5: '请输入1-255位字符',
      rule6: '请输入韦根输出自定义内容',
      rule7: '只允许数字',
      rule8: '韦根26范围为1-65535',
      rule9: '韦根34范围为1-4294967295',
      rule10: '请输入人脸识别阈值',
      rule11: '请输入1-100之间的整数',
      rule12: '请输入串口输出自定义内容',
      rule13: '允许数字、英文和英文符号',
      rule14: '允许{phone}、{idcardNum}、{id}、数字、英文和英文符号',
      rule15: '请输入时间窗',
      rule16: '请输入继电器控制时间',
      rule17: '请输入100-25500之间的整数',
      rule18: '请输入识别失败判定次数',
      rule20: '请输入韦根输出自定义内容',
      rule21: '韦根26范围为1-65535',
      rule22: '韦根34范围为1-4294967295',
      rule23: '请输入显示文字内容1',
      rule24: '请输入显示文字内容2',
      rule27: '文件格式不正确，请重新选择',
      rule28: '文件过大，请重新选择',
      rule29: '请输入1-20的整数'
    },
    configSuccess: '设备配置成功！',
    configError: '设备配置内容存在错误，请切换标签页核对后重新提交'
  },
  // 设备列表>>检查设备
  device_check: {
    title: '检查设备',
    search: {
      checking: '正在检查中',
      tip1: '检查设备是否为最新版本',
      tip2: '通过版本升级，提供更优质服务',
      tip3: '搜索到设备',
      reCheck: '重新检查',
      checkRes: '搜索到设备',
      batchUpgrade: '批量升级',
      noDataTip: '没有设备或客户端需要升级'
    },
    table: {
      tabs: {
        tab1: '版本一致',
        tab2: '设备版本低',
        tab3: '客户端版本低',
        tab4: '离线设备'
      },
      labels: {
        deviceKey: '设备序列号',
        version: '软件版本',
        ipAddress: 'IP地址',
        devicePlateName: '设备端名称',
        ClientPlateName: '客户端名称',
        handle: '操作'
      },
      sync: '同步',
      upgrade: '升级',
      enable: '启用',
      forceDelete: '强制删除',
      tip: '请到客户端设置页面升级客户端版本'
    },
    dialog: {
      sync: '同步',
      syncDevice: '同步成设备端名称',
      syncClient: '同步成客户端名称'
    },
    deviceOffLine: '设备离线',
    deviceDisabled: '设备禁用',
    message: {
      syncSuccess: '同步成功',
      requiredDevice: '请选择要升级的设备',
      hasEnable: '设备已启用',
      forceDeleteTip: '强制删除设备，将删除系统保存的所有设备信息，但保留设备内的所有数据',
      forceDelete: '强制删除',
      delete: '删除',
      hasDelete: '设备已删除'
    }
  },
  // 设备列表>>添加设备>>手动添加
  device_addManual: {
    title: '手动添加',
    name: '名称',
    ipAddress: 'IP地址',
    checkDevice: '检测到设备',
    group: '分组',
    add: '添加',
    setPassword: '设置设备密码',
    userAdminPassword: '使用Admin密码',
    setPasswordTip: '请设置密码',
    samePassword: '重复密码',
    hasPasswordTip: '设备已存在密码，请输入密码',
    message: {
      requiredName: '请输入设备名称',
      requiredIpAddress: '请输入ip地址',
      requiredPassword: '请输入密码',
      requiredAgain: '请输入确认密码',
      noIp: '当前IP地址未检测到设备',
      requiredDevice: '请先检测设备',
      addSuccess: '添加成功'
    }
  },
  // 设备列表>>添加设备>>自动添加
  device_addAuto: {
    title: '自动添加',
    search: {
      searching: '正在搜索中',
      res: '搜索到设备',
      reSearch: '重新检查'
    },
    tableHeader: {
      deviceKey: '设备序列号',
      version: '软件版本',
      ipAddress: 'IP地址',
      deviceName: '设备名称',
      deviceGroup: '设备组',
      handle: '操作'
    },
    hasAccess: '已接入',
    dialog: {
      title: '自动添加',
      labels: {
        name: '名称',
        group: '分组'
      },
      setPassword: '设置设备密码',
      userAdminPassword: '使用Admin密码',
      requiredPassword: '请输入密码',
      requireAgain: '请再次输入密码',
      hasPasswordTip: '设备已存在密码，请输入密码'
    },
    message: {
      requiredName: '请输入设备名称',
      requiredPassword: '请输入密码',
      requiredAgain: '请输入确认密码',
      addSuccess: '添加成功'
    }
  },
  // 设备组>>添加设备组
  group_add: {
    editTitle: '编辑设备组',
    addTitle: '添加设备组',
    form: {
      name: '名称',
      remark: '备注',
      device: '设备',
      search: '搜索',
      offLine: '离线',
      disabled: '禁用'
    },
    all: '全部',
    outGroup: '未分组',
    message: {
      requiredName: '请输入名称',
      updateSuccess: '修改成功',
      addSuccess: '添加成功'
    }
  }
}
