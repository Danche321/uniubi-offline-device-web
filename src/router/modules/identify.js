import Main from '@/components/main'

export default [{
  path: '/identify',
  name: 'identify',
  redirect: '/identify/index',
  component: Main,
  meta: {
    title: '识别记录',
    icon: 'icon-Nav_record'
  },
  children: [
    {
      path: 'index',
      name: 'index',
      component: () => import('@/views/identify/list.vue'),
      meta: {
        title: '识别记录'
      }
    }
  ]
}]
