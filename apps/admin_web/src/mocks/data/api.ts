import type { TicketFlowStepsResponse } from '../../types/ticket'
import type {
  CustomerDetail,
  Question,
  Attachment,
  NotificationType,
} from '../../types/business'

// GET /api/ticket/:id/flow-steps
export const TICKET_FLOW_STEPS_MOCK: TicketFlowStepsResponse = {
  currentMainStatus: 'PROCESS',
  currentSubStatus: 'REPAIRING',
  steps: [
    { mainStatus: 'REVIEW', subStatus: 'APPROVED', completedAt: '2023-10-27T10:00:00', operator: '系统' },
    { mainStatus: 'ACCEPT', subStatus: 'ACCEPTED', completedAt: '2023-10-27T11:00:00', operator: '张经理' },
    { mainStatus: 'RECEIVE', subStatus: 'RECEIVED', completedAt: '2023-10-28T09:00:00', operator: '李师傅' },
    { mainStatus: 'JUDGE', subStatus: 'JUDGE_COMPLETED', completedAt: '2023-10-29T14:00:00', operator: '王工' },
    { mainStatus: 'PAY', subStatus: 'PAID', completedAt: '2023-10-29T15:00:00', operator: '客户' },
    { mainStatus: 'PROCESS', subStatus: 'REPAIRING', completedAt: null, operator: null },
  ],
}

// GET /api/inventory/request/options
export const INVENTORY_REQUEST_OPTIONS_MOCK = {
  categories: ['镜片', '镜框', '配件', '螺丝', '鼻托'],
  reasonCategories: ['维修需要', '库存补充', '新品上架', '其他'],
  reasonSubCategories: {
    '维修需要': ['镜片破损', '镜框变形', '配件丢失'],
    '库存补充': ['低于安全库存', '季节性备货'],
    '新品上架': ['新品推广', '替换旧款'],
    '其他': ['其他原因'],
  } as Record<string, string[]>,
}

// GET /api/repair/options
export const REPAIR_OPTIONS_MOCK = {
  faultTypes: ['镜片破损', '镜框变形', '螺丝松动', '鼻托损坏', '镜腿断裂', '其他'],
  products: [
    { id: 'P001', name: 'V8 Turbo Max', category: '太阳镜' },
    { id: 'P002', name: 'Titanium Frame', category: '光学镜' },
    { id: 'P003', name: 'Classic Aviator', category: '太阳镜' },
  ],
}

// GET /api/customer/detail/:customerId
export function getCustomerDetailMock(customerId: string): CustomerDetail {
  return {
    customerId,
    name: 'Vance Jameson',
    phone: '+86 138-8822-1922',
    country: '中国 (China)',
    email: 'vance.design@example.com',
    history: [
      { ticketNo: '115001', acceptDate: '2023-10-27', status: '维修进行中', faultType: '镜框损坏' },
      { ticketNo: '114982', acceptDate: '2023-08-15', status: '已完成', faultType: '螺丝松动' },
      { ticketNo: '113205', acceptDate: '2023-03-02', status: '已完成', faultType: '抛光服务' },
    ],
  }
}

// GET /api/survey/:surveyId/questions
export const SURVEY_QUESTIONS_MOCK: Question[] = [
  { key: '1', questionNo: 'Q1', questionTitle: '服务态度满意度', questionType: '单选', options: '非常满意,满意,一般,不满意', sortOrder: 1 },
  { key: '2', questionNo: 'Q2', questionTitle: '维修质量评价', questionType: '单选', options: '优秀,良好,一般,差', sortOrder: 2 },
  { key: '3', questionNo: 'Q3', questionTitle: '响应速度评价', questionType: '单选', options: '非常快,快,一般,慢', sortOrder: 3 },
]

// POST /api/upload/attachment
export function createAttachmentMock(file: File): Attachment {
  return {
    fileId: `F${Date.now()}`,
    fileName: file.name,
    fileUrl: URL.createObjectURL(file),
    fileSize: file.size,
    uploadTime: new Date().toISOString(),
  }
}

// GET /api/notification/templates
export const NOTIFICATION_TEMPLATES_MOCK = [
  { id: 'T001', name: '维修进度通知', type: 'sms' as NotificationType, content: '您的工单{ticketNo}已进入{status}阶段' },
  { id: 'T002', name: '完成提醒', type: 'email' as NotificationType, content: '您的维修订单已完成，请查收' },
]
