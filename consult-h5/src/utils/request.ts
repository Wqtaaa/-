import { useUserStore } from '@/stores/modules/user'
import router from '@/router'
import axios from 'axios'
import { Toast } from 'vant'

//1,新axios实例，基础配置
const baseURL = 'https://consult-api.itheima.net/'
const request = axios.create({
  baseURL,
  timeout: 10000
})

//2.请求拦截器，携带Token
request.interceptors.request.use(
  (config) => {
    const store = useUserStore()
    if (store.user?.token && config.headers) {
      config.headers['Authorization'] = `Bearer ${store.user?.token}`
    }
    return config
  },
  (err) => Promise.reject(err)
)

//3.响应拦截器，剥离无效数据，401拦截=》发请求之后
request.interceptors.response.use(
  (res) => {
    //后台约定，响应成功，但是code不是10000，则是业务逻辑失败
    if (res.data?.code !== 10000) {
      Toast(res.data?.message)
      return Promise.reject(res.data)
    }
    //业务逻辑成功，返回响应数据，作为axios成功的结果
    return res.data
  },
  (err) => {
    console.log(err)

    if (err.response.status === 401) {
      //删除用户信息
      const store = useUserStore()
      store.delUser()
      //跳转登陆，带上接口失效所在页面的地址，登陆完成后回跳使用
      //为什么携带出现401页面的地址？
      //router.currentRoute.value.fullPath当前访问页面的path地址
      //说明：vue3=》router.currentRoute.value是个ref变量，所以访问需要加value
      //答：为了让用户重新登录后，跳转回上次访问页面=》交互体验好
      router.push(`/login?returnUrl=${router.currentRoute.value.fullPath}`)
    }
    return Promise.reject(err)
  }
)
export { baseURL, request }
