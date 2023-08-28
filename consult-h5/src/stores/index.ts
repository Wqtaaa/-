import { createPinia } from 'pinia'
//导入数据持久化插件
import persis from 'pinia-plugin-persistedstate'
//创建pinia实例
const pinia = createPinia()
//注册持久化插件
pinia.use(persis)

export default pinia

export * from './modules/user'
export * from './modules/consult'
