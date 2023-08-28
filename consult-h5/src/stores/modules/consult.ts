import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Consult, PartialConsult, InllnessType } from '@/types/consult'
import type { ConsultType } from '@/enum'
export const useConsultStore = defineStore(
  'cp-consult',
  () => {
    //定义全局共享数据
    //全局变量
    const consult = ref<PartialConsult>({})
    // 1.==问诊记录数据，创建订单使用=
    // //修改全局变量的方法
    // 2.修改问诊类型type方法：1找医生2极速问诊3开药问诊
    const setType = (type: ConsultType) => {
      consult.value.type = type
    }
    // 3.修改极速问诊类型illnessType方法：O普通 1三甲
    const setIllnessType = (type: 0 | 1) => {
      consult.value.illnessType = type
    }
    // 4.修改科室1d方法
    const setDepId = (id: string) => {
      consult.value.depId = id
    }
    // 5.修改病情描述相关信息方法：illnessDesc、illnessTime、consultFlag、pictures
    const setIllness = (illness: InllnessType) => {
      consult.value.illnessDesc = illness.illnessDesc
      consult.value.illnessTime = illness.illnessTime
      consult.value.consultFlag = illness.consultFlag
      consult.value.pictures = illness.pictures
    }
    // 6.修改患者patientId的方法
    const setPatient = (id: string) => (consult.value.patientId = id)
    // 7.修改优惠卷couponId的方法
    const setCunpon = (id?: string) => (consult.value.couponId = id)
    // 8。清空问诊记录方法
    const clear = () => (consult.value = {})
    return { consult, setType, setIllnessType, setDepId, setIllness, setPatient, setCunpon, clear }
  },
  {
    persist: true
  }
)
