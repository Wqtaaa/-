import type { Doctor, FollowType } from '@/types/consult'
import { followDoctor } from '@/api/consult'
import { ref } from 'vue'
import { Toast } from 'vant'

// 关注逻辑
const useFollow = (type: FollowType = 'doc') => {
  const loading = ref(false)
  const follow = async (doc: { id: string; likeFlag: 0 | 1 }) => {
    // 防止重复点击
    loading.value = true
    try {
      await followDoctor(doc.id, type)
      doc.likeFlag = doc.likeFlag === 1 ? 0 : 1
      Toast.success(doc.likeFlag === 1 ? '关注成功！' : '取关成功！')
    } finally {
      // 无论 try / catch 结果如何都会执行的代码块
      loading.value = false
    }
  }
  return { loading, follow }
}

export { useFollow }
