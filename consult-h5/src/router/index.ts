import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
import routes from './routers'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 访问权限控制
router.beforeEach((to) => {
  // console.log(to.path, from.path)
  document.title = `优医问诊-${to.meta.title || ''}`
  // 用户仓库
  const store = useUserStore()
  // console.log(!store.user.token)
  // console.log(!['/login', '/other'].includes(to.path))
  // console.log(store.user.token)

  // 不需要登录的页面，白名单
  // const wihteList = ['/login']
  // 如果没有登录且不在白名单内，去登录

  if (!store.user.token && !['/login', '/other'].includes(to.path)) return '/login'

  // 否则不做任何处理
  // return true
})

export default router
