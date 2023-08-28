<template>
  <svg aria-hidden="true" class="icon">
    <!-- #icon-文件夹名称-图片名称 -->
    <use :href="`#icon-${name}`" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{ name: string }>()
</script>

<style scoped>
.icon {
  width: 1em;
  height: 1em;
}
</style>
