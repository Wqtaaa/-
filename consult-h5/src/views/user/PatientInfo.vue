<script setup lang="ts">
import { getPatientList, addPatient, editPatient, delPatient } from '@/api/user'
import type { Patient, PatientList } from '@/types/user'
import { computed, onMounted, ref } from 'vue'
import { Toast, Dialog } from 'vant'
import Validator from 'id-validator'
import { useRoute, useRouter } from 'vue-router'
import { useConsultStore } from '@/stores'

const patientlist = ref<PatientList>([])
//获取患者列表方法
const loadList = async () => {
  const res = await getPatientList()
  patientlist.value = res.data
  // 设置默认选中的ID，当你是选择患者的时候，且有患者信息的时候
  if (isSel.value && patientlist.value.length) {
    const defPatient = patientlist.value.find((item) => item.defaultFlag === 1)
    if (defPatient) selectedPatientID.value = defPatient.id!
    else selectedPatientID.value = patientlist.value[0].id!
  }
}
// 增加支持选择患者功能
const route = useRoute()
console.log('路由参数', route)
//是否支持选择档案中的患者使用
const isSel = computed(() => route.query.isSel === '1')
onMounted(() => {
  loadList()
})

// 2. 打开侧滑栏
const show = ref(false)
const openDialog = (item?: Patient) => {
  if (item) {
    // 如果点的是编辑，解构出后台需要的数据
    const { id, gender, name, idCard, defaultFlag } = item
    patient.value = { id, gender, name, idCard, defaultFlag }
  } else {
    patient.value = { ...initPatient }
  }
  show.value = true
}
// 封装单选组件的测试数据
const options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]
// const gender = ref(1)
const initPatient: Patient = {
  name: '',
  idCard: '',
  gender: 1,
  defaultFlag: 0
}
// 定义患者的响应变量
const patient = ref<Patient>({
  ...initPatient
})
// 默认值需要转换
const defaultFlag = computed({
  get() {
    return patient.value.defaultFlag === 1 ? true : false
  },
  set(value) {
    patient.value.defaultFlag = value ? 1 : 0
    // 如果value值为true，则赋值1给patient.value.defaultFlag
    // 三元表达式优先级高
  }
})
const submit = async () => {
  if (!patient.value.name) return Toast.fail('请输入真实姓名')
  if (!patient.value.idCard) return Toast.fail('请输入身份证号')
  // 身份证校验
  const validate = new Validator()
  if (!validate.isValid(patient.value.idCard)) return Toast.fail('身份证格式错误')
  const { sex } = validate.getInfo(patient.value.idCard)
  if (patient.value.gender !== sex) return Toast.fail('性别和身份证不符')
  console.log('校验通过！可以保存')
  // 添加
  try {
    patient.value.id ? await editPatient(patient.value) : await addPatient(patient.value)
    show.value = false
    loadList()
    Toast.success(patient.value.id ? '编辑成功' : '添加成功')
  } catch (err) {
    console.log(err)
  }
}
//定义删除患者函数
const remove = async () => {
  if (patient.value.id) {
    await Dialog.confirm({
      title: '温馨提示',
      message: `您确认要删除 ${patient.value.name} 患者信息吗 ？`
    })
    await delPatient(patient.value.id)
    show.value = false
    loadList()
    Toast.success('删除成功')
  }
}
//const store = useConsultStore();
const router = useRouter()
// 点击选中患者的ID
const selectedPatientID = ref<String>('')
const selPatient = (id: String) => {
  // 判断是否支持选中
  if (isSel.value) {
    selectedPatientID.value = id
  }
}
// 定义下一步事件，跳转到支付页面
const store = useConsultStore()
const next = async () => {
  if (!selectedPatientID.value) return Toast('请选问诊择患者')
  // console.log(selectedPatientID.value)

  store.setPatient(selectedPatientID.value.toString())
  router.push('/consult/pay')
}
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar :title="isSel ? '选择患者' : '家庭档案'"></cp-nav-bar>
    <!-- 头部选择提示 -->
    <div class="patient-change" v-if="isSel">
      <h3>请选择患者信息</h3>
      <p>以便医生给出更准确的治疗，信息仅医生可见</p>
    </div>
    <!-- 患者列表 -->
    <div class="patient-list">
      <div
        @click="selPatient(item.id)"
        v-for="item in patientlist"
        :key="item.id"
        class="patient-item"
        :class="{ selected: selectedPatientID === item.id }"
      >
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <!-- 患者身份证脱敏处理（利用正则表达式） -->
          <span class="id">{{ item.idCard.replace(/^(.{6})(?:\d+)(.{4})$/, '\$1******\$2') }}</span>
          <span>{{ item.gender === 1 ? '男' : '女' }}</span>
          <span>{{ item.age }}</span>
        </div>
        <!-- 点击修改 -->
        <div @click="openDialog(item)" class="icon"><cp-icon name="user-edit" /></div>
        <!-- 默认患者显示div.tag元素 -->
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>

      <!-- 点击新增患者 -->
      <!-- 实现最多可添加 6 人功能：当患者列表长度达到6便不渲染 新增患者按钮Dom节点（v-if实现） -->
      <div @click="openDialog()" class="patient-add" v-if="patientlist.length < 6">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
    </div>
    <!-- 患者选择下一步 -->
    <div class="patient-next" v-if="isSel">
      <van-button type="primary" @click="next" round block>下一步</van-button>
    </div>
    <!-- 新增患者弹层 -->

    <van-popup v-model:show="show" position="right">
      <!-- 放置弹层内容 -->
      <!-- 1.导航栏 -->
      <cp-nav-bar
        :back="() => (show = false)"
        :title="patient.id ? '编辑患者' : '添加患者'"
        right-text="保存"
        @click-right="submit"
      ></cp-nav-bar>
      <!-- 2.新增患者表单 -->
      <van-form autocomplete="off">
        <van-field v-model="patient.name" label="真实姓名" placeholder="请输入真实姓名" />
        <van-field v-model="patient.idCard" label="身份证号" placeholder="请输入身份证号" />
        <van-field label="性别">
          <!-- 单选按钮组件 -->
          <template #input>
            <cp-radio-btn :options="options" v-model="patient.gender"></cp-radio-btn>
          </template>
        </van-field>
        <van-field label="默认就诊人">
          <template #input>
            <!-- 说明：直接绑定存储的是boolean值 -->
            <!-- <van-checkbox round v-model="patient.defaultFlag" /> -->
            <!-- 使用计算属性转换 -->
            <van-checkbox round v-model="defaultFlag" />
          </template>
        </van-field>
      </van-form>
      <van-action-bar v-if="patient.id">
        <van-action-bar-button @click="remove" type="danger" text="删除"></van-action-bar-button>
      </van-action-bar>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;
  ::v-deep() {
    .van-popup {
      width: 100%;
      height: 100%;
      padding-top: 46px;
      box-sizing: border-box;
    }
  }
}

.patient-change {
  padding: 15px;
  > h3 {
    font-weight: normal;
    margin-bottom: 5px;
  }
  > p {
    color: var(--cp-text3);
  }
}
.patient-next {
  padding: 15px;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
  box-sizing: border-box;
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
</style>
