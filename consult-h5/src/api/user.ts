import { request } from '@/utils/request'
import type { CodeType, User, UserInfo, PatientList, Patient } from '@/types/user'

// 密码登录
export const loginByPassword = (mobile: string, password: string) =>
  request.post<User>('/login/password', { mobile, password })

export const sendMobileCode = (mobile: string, type: CodeType) =>
  request.get<{ code: string }>('/code', { params: { mobile, type } })

export const loginByMobile = (mobile: string, code: string) =>
  request.post<User>('/login', { mobile, code })

//获取用户详情信息
export const userInfo = () => request.get<UserInfo>('/patient/myUser')

// 获患者信息列表
export const getPatientList = () => request.get<PatientList>('/patient/mylist')

// 添加患者信息
export const addPatient = (patient: Patient) => request.post('/patient/add', patient)

// 编辑患者信息
export const editPatient = (patient: Patient) => request.put('/patient/update', patient)

// 删除患者信息
export const delPatient = (id: string) => request.delete(`/patient/del/${id}`)

// 查询患者详情
export const getPatientDetail = (id: string) => request.get<Patient>(`/patient/info/${id}`)
