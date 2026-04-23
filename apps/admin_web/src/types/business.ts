// 库存申请弹窗
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

// 维修项目弹窗
export type RepairItemForm = {
  productId?: string
  productName: string
  faultType: string
  repairContent: string
  estimatedCost?: number
  remark?: string
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

// 附件上传
export type Attachment = {
  fileId: string
  fileName: string
  fileUrl: string
  fileSize: number
  uploadTime: string
}

// 通知/消息
export type NotificationType = 'sms' | 'email' | 'wechat' | 'app'

export type NotificationTemplate = {
  id: string
  name: string
  type: NotificationType
  content: string
}

// 库存申请弹窗选项
export type InventoryRequestOptions = {
  categories: string[]
  reasonCategories: string[]
  reasonSubCategories: Record<string, string[]>
}

// 维修项目选项
export type RepairOptions = {
  faultTypes: string[]
  products: { id: string; name: string; category: string }[]
}

// API 返回的简单 ID 包装
export type SubmitInventoryRequestResult = { requestId: string }
export type SendNotificationResult = { messageId: string }

export type SendNotificationParams = {
  type: NotificationType
  recipient: string
  templateId: string
  variables: Record<string, string>
}
