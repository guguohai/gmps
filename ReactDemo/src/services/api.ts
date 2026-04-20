import type { ModuleSchema, ModuleRow, ModuleSection, ModuleNestedRow, ModuleField } from '../mocks/modules/types'

// 重新导出类型
export type { ModuleSchema, ModuleRow, ModuleSection, ModuleNestedRow, ModuleField }

// API 响应类型
export type ApiResponse<T> = {
  code: number
  message: string
  data: T
}

// 列表查询参数
export type ListQueryParams = {
  page?: number
  pageSize?: number
  filters?: Record<string, string>
  sort?: { field: string; order: 'asc' | 'desc' }
}

// 列表响应
export type ListResponse<T> = {
  list: T[]
  total: number
  page: number
  pageSize: number
}

// 模块路径常量
export const API_PATHS = {
  TICKET: '/ticket/list',
  PRODUCT: '/product/list',
  INVENTORY_RECORD: '/inventory/record',
  INVENTORY_SYNC: '/inventory/sync',
  INVENTORY_TRANSFER: '/inventory/transfer',
  INVENTORY_REQUEST: '/inventory/request',
  INVENTORY_DISCREPANCY: '/inventory/discrepancy',
  PARTS_LIST: '/parts/list',
  PARTS_REQUEST: '/parts/request',
  SURVEY_LIST: '/survey/list',
  SURVEY_TEMPLATE: '/survey-template/list',
  USER_LIST: '/user/list',
  ROLE_LIST: '/role/list',
  PERMISSION_LIST: '/permission/list',
  CONFIG_DICT: '/config/dict',
  CONFIG_STATUS: '/config/status',
  CONFIG_TEMPLATE: '/config/template',
  DELIVERY_INVOICE: '/delivery/invoice',
} as const

// ============================================
// Mock API 实现（开发环境使用）
// ============================================
import { moduleSchemaMap } from '../mocks/modulePageMock'

const mockDelay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 获取模块 Schema（列表页配置）
 * GET /api/schema/:path
 */
export async function getSchema(path: string): Promise<ApiResponse<ModuleSchema | null>> {
  await mockDelay()
  const schema = moduleSchemaMap[path]
  if (!schema) {
    return { code: 404, message: 'Schema not found', data: null }
  }
  return { code: 200, message: 'success', data: schema }
}

/**
 * 获取列表数据
 * GET /api/:path/list
 */
export async function getList<T = ModuleRow>(
  path: string,
  params?: ListQueryParams
): Promise<ApiResponse<ListResponse<T> | null>> {
  await mockDelay()
  const schema = moduleSchemaMap[path]
  if (!schema) {
    return { code: 404, message: 'Schema not found', data: null }
  }
  
  let list = schema.rows as T[]
  
  // 模拟分页
  const page = params?.page || 1
  const pageSize = params?.pageSize || 10
  const total = list.length
  const start = (page - 1) * pageSize
  const end = start + pageSize
  list = list.slice(start, end)
  
  return {
    code: 200,
    message: 'success',
    data: { list, total, page, pageSize }
  }
}

/**
 * 获取详情数据
 * GET /api/:path/detail/:id
 */
export async function getDetail<T = ModuleRow>(
  path: string,
  id: string
): Promise<ApiResponse<T | null>> {
  await mockDelay()
  const schema = moduleSchemaMap[path]
  if (!schema) {
    return { code: 404, message: 'Schema not found', data: null }
  }
  
  const row = schema.rows.find(r => String(r.id) === id) as T | undefined
  if (!row) {
    return { code: 404, message: 'Data not found', data: null }
  }
  
  return { code: 200, message: 'success', data: row }
}

/**
 * 获取详情页 Sections
 * GET /api/:path/sections/:id
 */
export async function getDetailSections(
  path: string,
  _id: string
): Promise<ApiResponse<ModuleSection[] | null>> {
  await mockDelay()
  const schema = moduleSchemaMap[path]
  if (!schema || !schema.sections) {
    return { code: 404, message: 'Sections not found', data: null }
  }
  
  // 这里可以根据 id 获取特定数据的 sections
  // 目前 mock 数据是静态的，直接返回
  return { code: 200, message: 'success', data: schema.sections }
}

/**
 * 保存数据
 * POST /api/:path/save
 */
export async function saveData<T = ModuleRow>(
  path: string,
  data: Partial<T>
): Promise<ApiResponse<T>> {
  await mockDelay(500)
  console.log(`[Mock API] Save ${path}:`, data)
  return { code: 200, message: 'success', data: data as T }
}

/**
 * 删除数据
 * DELETE /api/:path/delete/:id
 */
export async function deleteData(
  path: string,
  id: string
): Promise<ApiResponse<void>> {
  await mockDelay(500)
  console.log(`[Mock API] Delete ${path}/${id}`)
  return { code: 200, message: 'success', data: undefined }
}

/**
 * 批量操作
 * POST /api/:path/batch
 */
export async function batchOperation<T = ModuleRow>(
  path: string,
  operation: 'delete' | 'update' | 'export',
  ids: string[],
  data?: Partial<T>
): Promise<ApiResponse<void>> {
  await mockDelay(800)
  console.log(`[Mock API] Batch ${operation} ${path}:`, ids, data)
  return { code: 200, message: 'success', data: undefined }
}

// ============================================
// 弹窗/交互相关 API
// ============================================

// 库存申请弹窗数据
export type InventoryRequestItem = {
  key: string
  productName: string
  quantity: number
  category: string
  reasonCategory: string
  reasonSubCategory: string
}

export type InventoryRequestForm = {
  items: InventoryRequestItem[]
  remark?: string
}

/**
 * 获取库存申请弹窗配置（产品分类、原因分类等选项）
 * GET /api/inventory/request/options
 */
export async function getInventoryRequestOptions(): Promise<ApiResponse<{
  categories: string[]
  reasonCategories: string[]
  reasonSubCategories: Record<string, string[]>
}>> {
  await mockDelay()
  return {
    code: 200,
    message: 'success',
    data: {
      categories: ['镜片', '镜框', '配件', '螺丝', '鼻托'],
      reasonCategories: ['维修需要', '库存补充', '新品上架', '其他'],
      reasonSubCategories: {
        '维修需要': ['镜片破损', '镜框变形', '配件丢失'],
        '库存补充': ['低于安全库存', '季节性备货'],
        '新品上架': ['新品推广', '替换旧款'],
        '其他': ['其他原因']
      }
    }
  }
}

/**
 * 提交库存申请
 * POST /api/inventory/request/submit
 */
export async function submitInventoryRequest(
  data: InventoryRequestForm
): Promise<ApiResponse<{ requestId: string }>> {
  await mockDelay(800)
  console.log('[Mock API] Submit inventory request:', data)
  return {
    code: 200,
    message: 'success',
    data: { requestId: `REQ${Date.now()}` }
  }
}

// 维修项目弹窗数据
export type RepairItemForm = {
  productId?: string
  productName: string
  faultType: string
  repairContent: string
  estimatedCost?: number
  remark?: string
}

/**
 * 获取维修项目选项
 * GET /api/repair/options
 */
export async function getRepairOptions(): Promise<ApiResponse<{
  faultTypes: string[]
  products: { id: string; name: string; category: string }[]
}>> {
  await mockDelay()
  return {
    code: 200,
    message: 'success',
    data: {
      faultTypes: ['镜片破损', '镜框变形', '螺丝松动', '鼻托损坏', '镜腿断裂', '其他'],
      products: [
        { id: 'P001', name: 'V8 Turbo Max', category: '太阳镜' },
        { id: 'P002', name: 'Titanium Frame', category: '光学镜' },
        { id: 'P003', name: 'Classic Aviator', category: '太阳镜' }
      ]
    }
  }
}

/**
 * 添加维修项目
 * POST /api/repair/item/add
 */
export async function addRepairItem(
  ticketId: string,
  data: RepairItemForm
): Promise<ApiResponse<void>> {
  await mockDelay(600)
  console.log('[Mock API] Add repair item to ticket', ticketId, ':', data)
  return { code: 200, message: 'success', data: undefined }
}

// 客户详情弹窗
export type CustomerHistory = {
  ticketNo: string
  acceptDate: string
  status: string
  faultType: string
}

export type CustomerDetail = {
  customerId: string
  name: string
  phone: string
  country: string
  email: string
  history: CustomerHistory[]
}

/**
 * 获取客户详情（含历史工单）
 * GET /api/customer/detail/:customerId
 */
export async function getCustomerDetail(
  customerId: string
): Promise<ApiResponse<CustomerDetail | null>> {
  await mockDelay()
  return {
    code: 200,
    message: 'success',
    data: {
      customerId,
      name: 'Vance Jameson',
      phone: '+86 138-8822-1922',
      country: '中国 (China)',
      email: 'vance.design@example.com',
      history: [
        { ticketNo: '115001', acceptDate: '2023-10-27', status: '维修进行中', faultType: '镜框损坏' },
        { ticketNo: '114982', acceptDate: '2023-08-15', status: '已完成', faultType: '螺丝松动' },
        { ticketNo: '113205', acceptDate: '2023-03-02', status: '已完成', faultType: '抛光服务' }
      ]
    }
  }
}

// 问卷题目管理
export type QuestionType = '单选' | '多选' | '文本' | '评分'

export type Question = {
  key: string
  questionNo: string
  questionTitle: string
  questionType: QuestionType
  options: string
  sortOrder: number
}

export type QuestionOption = {
  key: string
  optionNo: number
  optionId: string
  optionContent: string
}

/**
 * 获取问卷题目列表
 * GET /api/survey/:surveyId/questions
 */
export async function getSurveyQuestions(
  surveyId: string
): Promise<ApiResponse<Question[]>> {
  await mockDelay()
  console.log('[Mock API] Get survey questions:', surveyId)
  return {
    code: 200,
    message: 'success',
    data: [
      { key: '1', questionNo: 'Q1', questionTitle: '服务态度满意度', questionType: '单选', options: '非常满意,满意,一般,不满意', sortOrder: 1 },
      { key: '2', questionNo: 'Q2', questionTitle: '维修质量评价', questionType: '单选', options: '优秀,良好,一般,差', sortOrder: 2 },
      { key: '3', questionNo: 'Q3', questionTitle: '响应速度评价', questionType: '单选', options: '非常快,快,一般,慢', sortOrder: 3 }
    ]
  }
}

/**
 * 保存问卷题目（新增/编辑）
 * POST /api/survey/:surveyId/question/save
 */
export async function saveSurveyQuestion(
  surveyId: string,
  data: Partial<Question>
): Promise<ApiResponse<Question>> {
  await mockDelay(500)
  console.log('[Mock API] Save survey question:', surveyId, data)
  return {
    code: 200,
    message: 'success',
    data: { ...data, key: data.key || Date.now().toString() } as Question
  }
}

/**
 * 删除问卷题目
 * DELETE /api/survey/:surveyId/question/:questionId
 */
export async function deleteSurveyQuestion(
  surveyId: string,
  questionId: string
): Promise<ApiResponse<void>> {
  await mockDelay(400)
  console.log('[Mock API] Delete survey question:', surveyId, questionId)
  return { code: 200, message: 'success', data: undefined }
}

/**
 * 调整题目排序
 * POST /api/survey/:surveyId/question/reorder
 */
export async function reorderSurveyQuestions(
  surveyId: string,
  questionIds: string[]
): Promise<ApiResponse<void>> {
  await mockDelay(400)
  console.log('[Mock API] Reorder survey questions:', surveyId, questionIds)
  return { code: 200, message: 'success', data: undefined }
}

// 附件上传
export type Attachment = {
  fileId: string
  fileName: string
  fileUrl: string
  fileSize: number
  uploadTime: string
}

/**
 * 上传附件
 * POST /api/upload/attachment
 */
export async function uploadAttachment(
  file: File,
  relatedId: string,
  relatedType: 'ticket' | 'survey' | 'product'
): Promise<ApiResponse<Attachment>> {
  await mockDelay(1000)
  console.log('[Mock API] Upload attachment:', file.name, relatedId, relatedType)
  return {
    code: 200,
    message: 'success',
    data: {
      fileId: `F${Date.now()}`,
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
      fileSize: file.size,
      uploadTime: new Date().toISOString()
    }
  }
}

/**
 * 删除附件
 * DELETE /api/attachment/:fileId
 */
export async function deleteAttachment(
  fileId: string
): Promise<ApiResponse<void>> {
  await mockDelay(400)
  console.log('[Mock API] Delete attachment:', fileId)
  return { code: 200, message: 'success', data: undefined }
}

// 通知/消息
export type NotificationType = 'sms' | 'email' | 'wechat' | 'app'

/**
 * 发送通知
 * POST /api/notification/send
 */
export async function sendNotification(
  params: {
    type: NotificationType
    recipient: string
    templateId: string
    variables: Record<string, string>
  }
): Promise<ApiResponse<{ messageId: string }>> {
  await mockDelay(600)
  console.log('[Mock API] Send notification:', params)
  return {
    code: 200,
    message: 'success',
    data: { messageId: `MSG${Date.now()}` }
  }
}

/**
 * 获取通知模板列表
 * GET /api/notification/templates
 */
export async function getNotificationTemplates(): Promise<ApiResponse<{
  id: string
  name: string
  type: NotificationType
  content: string
}[]>> {
  await mockDelay()
  return {
    code: 200,
    message: 'success',
    data: [
      { id: 'T001', name: '维修进度通知', type: 'sms', content: '您的工单{ticketNo}已进入{status}阶段' },
      { id: 'T002', name: '完成提醒', type: 'email', content: '您的维修订单已完成，请查收' }
    ]
  }
}

// ============================================
// 正式 API 切换指南
// ============================================
// 1. 安装 axios: npm install axios
// 2. 创建 axios 实例
// 3. 替换上面的 mock 实现为真实 HTTP 请求
// 
// 示例：
// import axios from 'axios'
// const apiClient = axios.create({ baseURL: '/api' })
// 
// export async function getSchema(path: string) {
//   const res = await apiClient.get(`/schema${path}`)
//   return res.data
// }
//
// 建议：将 mock 数据和真实 API 分离
// - 开发环境：使用上面的 mock 实现
// - 生产环境：替换为真实 HTTP 请求
// 可以通过环境变量切换：
// const isMock = import.meta.env.VITE_USE_MOCK === 'true'
