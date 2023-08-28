import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@/types/user'

//用户store：存储登陆用户相关数据

export const useUserStore = defineStore(
  'cp-user',
  () => {
    //全局变量1：登陆用户
    //空对象的变量通过as断言指定类型
    const user = ref<User>({} as User)

    //方法：存储与删除
    const setUser = (userData: User) => {
      user.value = userData
    }
    const delUser = () => {
      user.value = {} as User
    }

    //返回变量和方法，外面要用
    return {
      user,
      setUser,
      delUser
    }
  },
  // { persist: true }

  //defineStore传入第三个参数，开启数据持久化

  {
    persist: true
  }
)
