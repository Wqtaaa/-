<script setup lang="ts">
import { getAllDep } from '@/api/consult'
import { useConsultStore } from '@/stores'
import type { TopDep } from '@/types/consult'
import { ref, onMounted, computed } from 'vue'
//当前选中的科室，索引值
const active = ref(0)
//1.获取所有科室（包括一级和二级）
const allDep = ref<TopDep[]>([])
const getAllDepapi = async () => {
  const { data } = await getAllDep()
  console.log('所有科室', data)
  allDep.value = data
}
onMounted(() => {
  getAllDepapi()
})
//2.点击切换一级科室，动态渲染二级科室
const sonDep = computed(() => {
  //异步数据，刚开始默认为空，此时使用索引取值会报错
  return allDep.value[active.value]?.child
})
// 3.点击二级科室记录选择科室的id
const store = useConsultStore()
</script>

<template>
  <!-- 2. 极速问诊-选择科室 -->
  <div class="consult-dep-page">
    <cp-nav-bar title="选择科室" />
    <div class="wrapper">
      <!-- 一级科室 -->
      <van-sidebar v-model="active">
        <van-sidebar-item v-for="top in allDep" :key="top.id" :title="top.name" />
      </van-sidebar>
      <!-- 二级科室 -->
      <div class="sub-dep">
        <router-link
          @click="store.setDepId(son.id)"
          v-for="son in sonDep"
          :key="son.id"
          to="/consult/illness"
          >{{ son.name }}</router-link
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.van-sidebar {
  width: 114px;
  &-item {
    padding: 14px;
    color: var(--cp-tag);
    &--select {
      color: var(--cp-main);
      font-weight: normal;
      &::before {
        display: none;
      }
    }
  }
}
.consult-dep-page {
  padding-top: 46px;
}

.wrapper {
  height: calc(100vh - 46px);
  overflow: hidden;
  display: flex;
  .sub-dep {
    flex: 1;
    height: 100%;
    overflow-y: auto;
    > a {
      display: block;
      padding: 14px 30px;
      color: var(--cp-dark);
    }
  }
}
</style>
