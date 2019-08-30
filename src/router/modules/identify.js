import Main from '@/components/main'
import i18n from '@/locale'
export default [{
  path: '/identify',
  name: 'identify',
  redirect: '/identify/index',
  component: Main,
  meta: {
    title: i18n.t('router_identify_identify'),
    icon: 'icon-Nav_record'
  },
  children: [
    {
      path: 'index',
      name: 'index',
      component: () => import('@/views/identify/list.vue'),
      meta: {
        title: i18n.t('router_identify_index')
      }
    }
  ]
}]
