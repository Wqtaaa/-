// import Test from '@/views/test/index.vue'
const Test = () => import('@/views/test/index.vue')

//路由配置
const routes = [
  //tabar页面
  {
    //父路由：layout公共布局页面
    path: '/',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/home',
    children: [
      //二级路由：挂载点放到父路由的指定位置
      //子路由：首页，健康百科，消息中心，我的
      { path: '/home', component: () => import('@/views/home/index.vue'), meta: { title: '首页' } },
      {
        path: '/article',
        component: () => import('@/views/article/index.vue'),
        meta: { title: '健康百科' }
      },
      {
        path: '/notify',
        component: () => import('@/views/notify/index.vue'),
        meta: { title: '消息通知' }
      },
      {
        path: '/user',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '个人中心' }
      }
    ]
  },
  {
    path: '/login',

    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  //家庭档案页面
  {
    path: '/user/patient',
    component: () => import('@/views/user/PatientInfo.vue'),
    meta: { title: '家庭档案' }
  },
  //极速问诊
  {
    path: '/consult/fast',
    component: () => import('@/views/consult/ConsultFast.vue'),
    meta: { title: '极速问诊' }
  },
  //选择科室

  {
    path: '/consult/dep',
    component: () => import('@/views/consult/ConsultDep.vue'),
    meta: { title: '选择科室' }
  },
  {
    path: '/consult/illness',
    component: () => import('@/views/consult/ConsultIllness.vue'),
    meta: { title: '病情描述' }
  },
  {
    path: '/consult/pay',
    component: () => import('@/views/consult/ConsultPay.vue'),
    meta: { title: '问诊支付' }
  },
  {
    path: '/test',
    name: 'test',
    component: Test
  }
]

export default routes
