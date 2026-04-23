import {
  REPAIR_TYPE_OPTIONS,
  ATTACHED_ITEM_TYPE_OPTIONS,
  HEADER_OWNER_OPTIONS,
  SMS_TEMPLATES,
  EMAIL_TEMPLATES,
  INVENTORY_REQUEST_CATEGORY_OPTIONS,
  INVENTORY_REQUEST_REASON_CATEGORY_OPTIONS,
  INVENTORY_REQUEST_REASON_SUB_CATEGORY_OPTIONS,
} from '../mocks/data/ticketDict'

const mockDelay = (ms: number = 100) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function getRepairTypeOptions() {
  await mockDelay()
  return REPAIR_TYPE_OPTIONS
}

export async function getAttachedItemTypeOptions() {
  await mockDelay()
  return ATTACHED_ITEM_TYPE_OPTIONS
}

export async function getHeaderOwnerOptions() {
  await mockDelay()
  return HEADER_OWNER_OPTIONS
}

export async function getNotificationTemplates() {
  await mockDelay()
  return { sms: SMS_TEMPLATES, email: EMAIL_TEMPLATES }
}

export async function getInventoryRequestCategoryOptions() {
  await mockDelay()
  return INVENTORY_REQUEST_CATEGORY_OPTIONS
}

export async function getInventoryRequestReasonCategoryOptions() {
  await mockDelay()
  return INVENTORY_REQUEST_REASON_CATEGORY_OPTIONS
}

export async function getInventoryRequestReasonSubCategoryOptions() {
  await mockDelay()
  return INVENTORY_REQUEST_REASON_SUB_CATEGORY_OPTIONS
}
