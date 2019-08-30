import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { localRead } from '@/libs/util'
import customZhCn from './lang/zh-CN'
import customEn from './lang/en'
import zhCnLocale from 'element-ui/src/locale/lang/zh-CN'
import enUsLocale from 'element-ui/src/locale/lang/en'

Vue.use(VueI18n)

// 自动根据浏览器系统语言设置语言
const navLang = navigator.language
const localLang = (navLang === 'zh-CN' || navLang === 'en-US') ? navLang : false
let lang = localLang || localRead('local') || 'zh-CN'

Vue.locale = () => {}

const messages = {
  'zh-CN': Object.assign(zhCnLocale, customZhCn),
  'en': Object.assign(enUsLocale, customEn)
}

const i18n = new VueI18n({
  locale: lang,
  messages
})

export default i18n
