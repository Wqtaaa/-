import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from '@/stores/index'

//导入全局样式
import '@/styles/index.scss'

//vant需要单独引入的样式
import 'vant/es/toast/style'
import 'vant/es/dialog/style'

//注册图标
import 'virtual:svg-icons-register'
const app = createApp(App)

app.use(router)
app.use(pinia)

app.mount('#app')
