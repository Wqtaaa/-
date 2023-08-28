<script setup lang="ts">
import { ref } from 'vue'
import KnowledgeCard from './KnowledgeCard.vue'
import type { KnowledgeList, KnowledgeType } from '@/types/consult'
import { getKnowledgePage } from '@/api/consult'

//接受type（文章类型）
const props = defineProps<{
  type: KnowledgeType
}>()

const list = ref<KnowledgeList>([])
const loading = ref(false)
const finished = ref(false)

//请求的分页数据
const params = {
  type: props.type, //频道类型
  current: 1, //请求的页码
  pageSize: 10 //每页多少条数据
}
const onLoad = async () => {
  // 异步更新数据
  // setTimeout 仅做示例，真实场景中一般为 ajax 请求
  const { data } = await getKnowledgePage(params)
  //把当前页的数据追加到list列表中
  list.value.push(...data.rows)

  // 加载状态结束
  loading.value = false
  //数据全部加载完成

  // 判断列表的数据是否加载完成了？
  // 1.list长度===total数据总条数
  // 2.current当前页码===pageTotal总页数

  // 数据全部加载完成
  if (list.value.length === data.total) {
    //数据加载完了
    finished.value = true
  } else {
    params.current++
  }
}
</script>

<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <!-- 知识列表item -->
      <knowledge-card v-for="item in list" :key="item.id" :item="item"></knowledge-card>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
