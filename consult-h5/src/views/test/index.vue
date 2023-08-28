<template>
  <div class="">
    <h1 class="test">测试内容</h1>
    <ul>
      <li>{{ store.user }}</li>
      <li @click="changeUser">123</li>
      <li>{{ store.user }}</li>
      <li>
        <svg aria-hidden="true">
          <!-- #icon-文件夹名称-图片名称 -->
          <use href="#icon-login-eye-off" />
        </svg>
      </li>
      <hr />
      <li><cp-icon name="login-eye-off" /><cp-icon name="consult-alipay" /></li>
      <li></li>
    </ul>
    <hr />
    <van-button type="primary">主要按钮</van-button>
    <van-button type="success">成功按钮</van-button>
    <van-button type="default">默认按钮</van-button>
    <van-button type="warning">警告按钮</van-button>
    <van-button type="danger">危险按钮</van-button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/modules/user'
import { onMounted } from 'vue'

//导入封装的request
import { request } from '@/utils/request'

const store = useUserStore()
const changeUser = () => {
  store.setUser({
    token: 'string',
    id: '213',
    account: 'string',
    mobile: '123',
    avatar: 'string'
  })
}

//测试

// const getHome = async () => {
//   try {
//     const res = await request.get('/patient/myUser')
//     console.log(res)
//   } catch (res) {
//     console.log(res)
//   }
// }
const login = async () => {
  const res = await request.post('/login/password', {
    mobile: '13211112222',
    //密码abc123456测试：出现非10000的情况
    password: 'abc12345000'
  })
  console.log('登陆成功', res)
}
onMounted(() => {
  login()
})
</script>

<style scoped>
.test {
  font-size: 16px;
}
</style>
