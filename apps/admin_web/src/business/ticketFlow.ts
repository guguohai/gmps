import type { ModuleRow } from '../types/module'
import type { TicketMainStatus, TicketFlowView } from '../types/ticket'
import { buildTicketStatusHelpers } from '../business/ticketStatus'

type Helpers = ReturnType<typeof buildTicketStatusHelpers>

type Primitive = string | number | boolean | undefined | null

const DONE_INVENTORY_REQUEST_STATUSES = new Set([
  '已完成',
  '完成',
  'DONE',
  'done',
  'COMPLETED',
  'completed',
  'CLOSED',
  'closed',
])

const isTicketMainStatus = (value: string, helpers: Helpers): value is TicketMainStatus =>
  helpers.TICKET_MAIN_STATUS_ORDER.includes(value as TicketMainStatus)

const readPrimitive = (row: ModuleRow | null | undefined, keys: string[]): Primitive => {
  if (!row) return undefined
  for (const key of keys) {
    const value = row[key]
    if (value !== undefined && value !== null) return value as Primitive
  }
  return undefined
}

const readString = (row: ModuleRow | null | undefined, keys: string[]): string => {
  const value = readPrimitive(row, keys)
  if (value === undefined || value === null) return ''
  return String(value).trim()
}

const readBoolean = (row: ModuleRow | null | undefined, keys: string[]): boolean | null => {
  const value = readPrimitive(row, keys)
  if (typeof value === 'boolean') return value
  if (value === undefined || value === null) return null
  const normalized = String(value).trim().toLowerCase()
  if (['true', '1', 'yes', 'y', 'on', '是'].includes(normalized)) return true
  if (['false', '0', 'no', 'n', 'off', '否'].includes(normalized)) return false
  return null
}

export const resolveTicketFlowView = (row: ModuleRow | null | undefined, helpers: Helpers | null): TicketFlowView => {
  if (!helpers) {
    return {
      mainStatus: 'REVIEW',
      subStatus: 'SUBMITTED',
      specialDescription: '',
      inventoryRequestNo: '',
      inventoryRequestStatus: '',
      inventoryRequestCompleted: false,
      hasPendingInventoryRequest: false,
    }
  }

  const subStatus = helpers.normalizeTicketSubStatus(
    readString(row, ['subStatus', 'ticketSubStatus', 'statusSub', 'flowSub', 'status']) || 'WAITING_REPAIR',
  )

  const mainStatusRaw = readString(row, ['mainStatus', 'ticketMainStatus', 'statusMain', 'flowMain'])
  const mainStatus = isTicketMainStatus(mainStatusRaw, helpers)
    ? mainStatusRaw
    : helpers.getTicketMainStatusBySubStatus(subStatus)

  const specialDescription = readString(row, [
    'flowSpecialDescription',
    'specialDescription',
    'statusSpecialDescription',
    'inventoryRequestDescription',
  ])

  const inventoryRequestNo = readString(row, [
    'inventoryRequestNo',
    'inventoryApplyNo',
    'inventory_request_no',
  ])

  const inventoryRequestStatus = readString(row, [
    'inventoryRequestStatus',
    'inventoryApplyStatus',
    'inventory_request_status',
  ])

  const inventoryRequestCompletedFlag = readBoolean(row, [
    'inventoryRequestCompleted',
    'inventoryApplyCompleted',
    'inventory_request_completed',
  ])

  const inventoryRequestCompleted =
    inventoryRequestCompletedFlag ?? DONE_INVENTORY_REQUEST_STATUSES.has(inventoryRequestStatus)

  return {
    mainStatus,
    subStatus,
    specialDescription,
    inventoryRequestNo,
    inventoryRequestStatus,
    inventoryRequestCompleted,
    hasPendingInventoryRequest: Boolean(inventoryRequestNo) && !inventoryRequestCompleted,
  }
}
