import i18n from '@/locale'

// 手机号
export const phoneRule = (rule, value, callback) => {
  if (value) {
    if (/\D/.test(value)) {
      callback(new Error(i18n.t('rule_phone_msg1')))
    } else if (!/^\d{11}$/.test(value)) {
      callback(new Error(i18n.t('rule_phone_msg2')))
    } else if (!/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(value)) {
      callback(new Error(i18n.t('rule_phone_msg3')))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 座机
export const telNumberRule = (rule, value, callback) => {
  if (value) {
    if (/\D-/.test(value)) {
      callback(new Error(i18n.t('rule_tel_msg1')))
    } else if (!/^(\d{3,4}-\d{7,8}|\d{3,4}-\d{7,8}-\d{1,4})$/.test(value)) {
      callback(new Error(i18n.t('rule_tel_msg2')))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 手机座机号
export const telPhoneNumRule = (rule, value, callback) => {
  if (value) {
    if (/\D-/.test(value)) {
      callback(new Error(i18n.t('rule_tel_phone_msg1')))
    } else if (!/^(\d{3,4}-\d{7,8}|\d{3,4}-\d{7,8}-\d{1,4})$/.test(value) && !/^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/.test(value)) {
      callback(new Error(i18n.t('rule_tel_phone_msg2')))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 图片验证码
export const captchaRule = (rule, value, callback) => {
  if (value === null || value === undefined || value === '') {
    callback(new Error(i18n.t('rule_captcha_msg1')))
  } else if (!/^[a-zA-Z0-9]{4}$/.test(value)) {
    callback(new Error(i18n.t('rule_captcha_msg1')))
  } else {
    callback()
  }
}

// 密码
export const passwordRule = (rule, value, callback) => {
  if (value === null || value === undefined || value === '') {
    callback(new Error(i18n.t('rule_password_msg1')))
  } else if (!/^(?![a-zA-Z]+$)(?!\d+$)(?![~!@#$%^&*?]+$)\S{6,18}$/.test(value)) {
    callback(new Error(i18n.t('rule_password_msg2')))
  } else {
    callback()
  }
}

// 密码二次校验
export const passwordAgainRule = (rule, value, callback, password) => {
  if (value === null || value === undefined || value === '') {
    callback(new Error(i18n.t('rule_password_again_msg1')))
  } else if (value !== password) {
    callback(new Error(i18n.t('rule_password_again_msg2')))
  } else {
    callback()
  }
}

// 名称 汉字/字母/数字/空格
export const nameRule = (rule, value, callback) => {
  if (value) {
    if (value.length > 32) {
      callback(new Error(i18n.t('rule_name_msg1')))
    } else if (!/^[\u4e00-\u9fa5\sa-zA-Z0-9]+$/.test(value)) {
      callback(new Error(i18n.t('rule_name_msg2')))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 设备名称 汉字/字母/数字/空格/下划线
export const name2Rule = (rule, value, callback) => {
  if (value) {
    if (value.length > 32) {
      callback(new Error(i18n.t('rule_name2_msg1')))
    } else if (!/^[\u4e00-\u9fa5\sa-zA-Z0-9_]+$/.test(value)) {
      callback(new Error(i18n.t('rule_name2_msg2')))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 工号卡号学号
export const numAndLetterRule = (rule, value, callback) => {
  if (value) {
    if (value.length > 32) {
      callback(new Error(i18n.t('rule_num_letter_msg1')))
    } else if (!/^[a-zA-Z0-9]+$/.test(value)) {
      callback(new Error(i18n.t('rule_num_letter_msg2')))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 邮箱
export const mailRule = (rule, value, callback) => {
  if (value) {
    if (value.length > 255 || value.length < 4) {
      callback(new Error(i18n.t('rule_mail_msg1')))
    } else if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
      callback(new Error(i18n.t('rule_mail_msg2')))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 职位、角色 [字母汉字2-32位]
export const positionRule = (rule, value, callback) => {
  if (value) {
    if (value.length > 32 || value.length < 2) {
      callback(new Error(i18n.t('rule_position_mag1')))
    } else if (!/^[\u4e00-\u9fa5a-zA-Z]+$/.test(value)) {
      callback(new Error(i18n.t('rule_position_mag2')))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 地址
export const addressRule = (rule, value, callback) => {
  if (value) {
    if (value.length > 128) {
      callback(new Error(i18n.t('rule_address_msg1')))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// 短信验证码校验
export const smsCodeRule = (rule, value, callback, params) => {
  if (value === null || value === undefined || value === '') {
    callback(new Error(i18n.t('rule_sms_msg1')))
  } else if (/\D/.test(value)) {
    callback(new Error(i18n.t('rule_sms_msg2')))
  } else if (!/^\d{6}$/.test(value)) {
    callback(new Error(i18n.t('rule_sms_msg3')))
  } else if (!params.userName) {
    callback(new Error(i18n.t('rule_sms_msg4')))
  } else {
    callback()
  }
}

// ip地址
export const ipRule = (rule, value, callback) => {
  if (value) {
    if (!/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/.test(value)) {
      callback(new Error(i18n.t('rule_ip_msg1')))
    } else {
      callback()
    }
  } else {
    callback()
  }
}

// url地址
export const urlRule = (rule, value, callback) => {
  if (value) {
    if (!/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/.test(value)) {
      callback(new Error(i18n.t('rule_url_msg1')))
    } else {
      callback()
    }
  } else {
    callback()
  }
}
