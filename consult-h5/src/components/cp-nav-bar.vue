<script setup lang="ts">
import { useRouter } from 'vue-router'
// 封装需求❓：支持 title rightText 属性，支持 click-right 事件，click-left函数内支持返回上一页或默认首页
const router = useRouter()

//1，接受父传子变量
const props = defineProps<{
  title: string
  rightText?: string
  back?: () => void
}>()
//2.子传父
const emit = defineEmits<{
  (e: 'click-right'): void
}>()
const onClickLeft = () => {
  if (props.back) {
    return props.back()
  }

  if (history.state?.back) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <van-nav-bar
    left-arrow
    @click-left="onClickLeft"
    fixed
    :title="title"
    :right-text="rightText"
    @click-right="emit('click-right')"
  ></van-nav-bar>
</template>

<style lang="scss" scoped>
::v-deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }
    &__text {
      font-size: 15px;
    }
  }
}
</style>
