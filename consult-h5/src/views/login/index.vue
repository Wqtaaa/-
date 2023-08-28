<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { mobileRules, passwordRules } from '@/utils/rules'
import { Toast } from 'vant'
import { loginByPassword } from '@/api/user'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import { codeRules } from '@/utils/rules'
import type { FormInstance } from 'vant'
import { sendMobileCode } from '@/api/user'
import { loginByMobile } from '@/api/user'

const store = useUserStore()
const router = useRouter()
const route = useRoute()
const clickRight = () => {
  console.log('点击了右边的文字')
}
const isShowPass = ref(false)
const agree = ref(false)
const mobile = ref('13230000001')
const password = ref('abc12345')
const code = ref('')
const form = ref<FormInstance>()
let timeId: number

const login = async () => {
  if (!agree.value) return Toast('请勾选我已同意')
  // 验证完毕，进行登录
  try {
    const res = isPass.value
      ? await loginByPassword(mobile.value, password.value)
      : await loginByMobile(mobile.value, code.value)
    store.setUser(res.data)
    console.log(res)

    // 如果有回跳地址就进行回跳，没有跳转到个人中心
    router.push((route.query.returnUrl as string) || '/user')
    Toast.success('登录成功')
  } catch (err) {
    console.log(err)
  }
}
const isPass = ref(true)
const time = ref(0)
const send = async () => {
  // 已经倒计时time的值大于0，60s内不能重复发送验证码
  if (time.value > 0) return
  // 验证不通过报错，阻止程序继续执行
  await form.value?.validate('mobile')
  const res = await sendMobileCode(mobile.value, 'login')
  code.value = res.data.code
  Toast.success('发送成功')
  time.value = 60
  // 倒计时
  timeId = window.setInterval(() => {
    time.value--
    if (time.value <= 0) window.clearInterval(timeId)
  }, 1000)
}
onUnmounted(() => {
  window.clearInterval(timeId)
})
</script>

<template>
  <cp-nav-bar middle="登录" right="注册" @click-right="clickRight"> </cp-nav-bar>
  <div class="login">
    <!-- 1.头部 -->
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;" @click="isPass = !isPass">
        <span>{{ !isPass ? '密码登录' : '短信验证码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- ==2. form 表单 == -->
    <van-form @submit="login" autocomplete="off">
      <!-- 1.手机号输入框 -->
      <van-field
        name="mobile"
        v-model="mobile"
        :rules="mobileRules"
        placeholder="请输入手机号"
        type="tel"
      ></van-field>
      <!-- 2.密码输入框 -->
      <!-- <van-field
        v-model="password"
        :rules="passwordRules"
        placeholder="请输入密码"
        :type="isShowPass ? 'text' : 'password'"
      >
        <template #button>
          <cp-icon
            @click="isShowPass = !isShowPass"
            :name="`login-eye-${isShowPass ? 'on' : 'off'}`"
          ></cp-icon>
        </template>
      </van-field> -->
      <!-- 2.密码输入框 -->
      <van-field
        v-if="isPass"
        v-model="password"
        :rules="passwordRules"
        placeholder="请输入密码"
        :type="isShowPass ? 'text' : 'password'"
      >
        <template #button>
          <cp-icon
            @click="isShowPass = !isShowPass"
            :name="`login-eye-${isShowPass ? 'on' : 'off'}`"
          ></cp-icon>
        </template>
      </van-field>
      <!-- 3.验证码输入框 -->
      <van-field v-else v-model="code" :rules="codeRules" placeholder="短信验证码">
        <template #button>
          <span :class="{ active: time > 0 }" @click="send">
            {{ time > 0 ? `${time}s后再次发送` : '发送验证码' }}
          </span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button native-type="submit" block round type="primary">登 录</van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
.active {
  color: red;
}
.login {
  padding-top: 46px;
  &-head {
    padding: 30px 30px 50px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  .van-form {
    padding: 0 14px;
    .cp-cell {
      height: 52px;
      padding: 14px 16px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      .van-checkbox {
        a {
          color: var(--cp-primary);
          padding: 0 5px;
        }
      }
    }
  }
}
</style>
