import type { ApiResponse, DictItem, DictType } from '../types/api'
import type {
  InventoryRequestForm,
  RepairItemForm,
  CustomerDetail,
  Question,
  Attachment,
  InventoryRequestOptions,
  RepairOptions,
  NotificationTemplate,
  SendNotificationParams,
  SendNotificationResult,
  SubmitInventoryRequestResult,
} from '../types/business'
import { DICT_DATA } from '../mocks/data/dict'
import {
  INVENTORY_REQUEST_OPTIONS_MOCK,
  REPAIR_OPTIONS_MOCK,
  getCustomerDetailMock,
  SURVEY_QUESTIONS_MOCK,
  createAttachmentMock,
  NOTIFICATION_TEMPLATES_MOCK,
} from '../mocks/data/api'

const mockDelay = (ms: number = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function getDict(type: DictType): Promise<ApiResponse<DictItem[]>> {
  await mockDelay(200)
  const data = (DICT_DATA[type] ?? []) as DictItem[]
  return { code: 200, message: 'success', data }
}

export async function getInventoryRequestOptions(): Promise<ApiResponse<InventoryRequestOptions>> {
  await mockDelay()
  return { code: 200, message: 'success', data: INVENTORY_REQUEST_OPTIONS_MOCK }
}

export async function submitInventoryRequest(
  data: InventoryRequestForm,
): Promise<ApiResponse<SubmitInventoryRequestResult>> {
  await mockDelay(800)
  console.log('[Mock API] Submit inventory request:', data)
  return {
    code: 200,
    message: 'success',
    data: { requestId: `REQ${Date.now()}` },
  }
}

export async function getRepairOptions(): Promise<ApiResponse<RepairOptions>> {
  await mockDelay()
  return { code: 200, message: 'success', data: REPAIR_OPTIONS_MOCK }
}

export async function addRepairItem(
  ticketId: string,
  data: RepairItemForm,
): Promise<ApiResponse<void>> {
  await mockDelay(600)
  console.log('[Mock API] Add repair item to ticket', ticketId, ':', data)
  return { code: 200, message: 'success', data: undefined }
}

export async function getCustomerDetail(
  customerId: string,
): Promise<ApiResponse<CustomerDetail | null>> {
  await mockDelay()
  return { code: 200, message: 'success', data: getCustomerDetailMock(customerId) }
}

export async function getSurveyQuestions(
  surveyId: string,
): Promise<ApiResponse<Question[]>> {
  await mockDelay()
  console.log('[Mock API] Get survey questions:', surveyId)
  return { code: 200, message: 'success', data: SURVEY_QUESTIONS_MOCK }
}

export async function saveSurveyQuestion(
  surveyId: string,
  data: Partial<Question>,
): Promise<ApiResponse<Question>> {
  await mockDelay(500)
  console.log('[Mock API] Save survey question:', surveyId, data)
  return {
    code: 200,
    message: 'success',
    data: { ...data, key: data.key || Date.now().toString() } as Question,
  }
}

export async function deleteSurveyQuestion(
  surveyId: string,
  questionId: string,
): Promise<ApiResponse<void>> {
  await mockDelay(400)
  console.log('[Mock API] Delete survey question:', surveyId, questionId)
  return { code: 200, message: 'success', data: undefined }
}

export async function reorderSurveyQuestions(
  surveyId: string,
  questionIds: string[],
): Promise<ApiResponse<void>> {
  await mockDelay(400)
  console.log('[Mock API] Reorder survey questions:', surveyId, questionIds)
  return { code: 200, message: 'success', data: undefined }
}

export async function uploadAttachment(
  file: File,
  relatedId: string,
  relatedType: 'ticket' | 'survey' | 'product',
): Promise<ApiResponse<Attachment>> {
  await mockDelay(1000)
  console.log('[Mock API] Upload attachment:', file.name, relatedId, relatedType)
  return { code: 200, message: 'success', data: createAttachmentMock(file) }
}

export async function deleteAttachment(
  fileId: string,
): Promise<ApiResponse<void>> {
  await mockDelay(400)
  console.log('[Mock API] Delete attachment:', fileId)
  return { code: 200, message: 'success', data: undefined }
}

export async function sendNotification(
  params: SendNotificationParams,
): Promise<ApiResponse<SendNotificationResult>> {
  await mockDelay(600)
  console.log('[Mock API] Send notification:', params)
  return {
    code: 200,
    message: 'success',
    data: { messageId: `MSG${Date.now()}` },
  }
}

export async function getNotificationTemplates(): Promise<ApiResponse<NotificationTemplate[]>> {
  await mockDelay()
  return { code: 200, message: 'success', data: NOTIFICATION_TEMPLATES_MOCK }
}
