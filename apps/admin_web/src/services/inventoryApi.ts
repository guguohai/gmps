import type { ApiResponse } from '../types/api'
import type { ModuleRow, ModuleSection } from '../types/module'
import {
  INVENTORY_RECORD_ROWS,
  INVENTORY_REQUEST_ROWS,
  INVENTORY_SYNC_ROWS,
  INVENTORY_RECORD_SECTIONS,
  INVENTORY_REQUEST_SECTIONS,
  INVENTORY_SYNC_SECTIONS,
} from '../mocks/data/inventory'
import { discrepancyListMock } from '../mocks/data/discrepancy'

const mockDelay = (ms: number = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function getInventoryRecordList(): Promise<ApiResponse<ModuleRow[]>> {
  await mockDelay()
  return { code: 200, message: 'success', data: INVENTORY_RECORD_ROWS }
}

export async function getInventoryRequestList(): Promise<ApiResponse<ModuleRow[]>> {
  await mockDelay()
  return { code: 200, message: 'success', data: INVENTORY_REQUEST_ROWS }
}

export async function getInventorySyncList(): Promise<ApiResponse<ModuleRow[]>> {
  await mockDelay()
  return { code: 200, message: 'success', data: INVENTORY_SYNC_ROWS }
}

export async function getDiscrepancyList(): Promise<ApiResponse<ModuleRow[]>> {
  await mockDelay()
  return { code: 200, message: 'success', data: discrepancyListMock }
}

export async function getInventoryRequestDetail(id: string): Promise<ApiResponse<ModuleRow | null>> {
  await mockDelay()
  const row = INVENTORY_REQUEST_ROWS.find((item) => String(item.id) === id) ?? null
  return { code: 200, message: 'success', data: row }
}

export async function getInventoryRequestSections(): Promise<ApiResponse<ModuleSection[]>> {
  await mockDelay(120)
  return { code: 200, message: 'success', data: INVENTORY_REQUEST_SECTIONS }
}

export async function getInventorySyncDetail(id: string): Promise<ApiResponse<ModuleRow | null>> {
  await mockDelay()
  const row = INVENTORY_SYNC_ROWS.find((item) => String(item.id) === id) ?? null
  return { code: 200, message: 'success', data: row }
}

export async function getInventorySyncSections(): Promise<ApiResponse<ModuleSection[]>> {
  await mockDelay(120)
  return { code: 200, message: 'success', data: INVENTORY_SYNC_SECTIONS }
}

export async function getInventoryRecordDetail(id: string): Promise<ApiResponse<ModuleRow | null>> {
  await mockDelay()
  const row = INVENTORY_RECORD_ROWS.find((item) => String(item.id) === id) ?? null
  return { code: 200, message: 'success', data: row }
}

export async function getInventoryRecordSections(): Promise<ApiResponse<ModuleSection[]>> {
  await mockDelay(120)
  return { code: 200, message: 'success', data: INVENTORY_RECORD_SECTIONS }
}
