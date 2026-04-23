import type { ApiResponse } from '../types/api'
import type { ModuleRow, ModuleSection } from '../types/module'
import { PARTS_LIST_ROWS, PARTS_LIST_SECTIONS, PARTS_REQUEST_ROWS, PARTS_REQUEST_SECTIONS } from '../mocks/data/parts'

const mockDelay = (ms: number = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function getPartsList(): Promise<ApiResponse<ModuleRow[]>> {
  await mockDelay()
  return { code: 200, message: 'success', data: PARTS_LIST_ROWS }
}

export async function getPartsRequestList(): Promise<ApiResponse<ModuleRow[]>> {
  await mockDelay()
  return { code: 200, message: 'success', data: PARTS_REQUEST_ROWS }
}

export async function getPartsDetail(id: string): Promise<ApiResponse<ModuleRow | null>> {
  await mockDelay()
  const row = PARTS_LIST_ROWS.find((item) => String(item.id) === id) ?? null
  return { code: 200, message: 'success', data: row }
}

export async function getPartsSections(): Promise<ApiResponse<ModuleSection[]>> {
  await mockDelay(120)
  return { code: 200, message: 'success', data: PARTS_LIST_SECTIONS }
}

export async function getPartsRequestDetail(id: string): Promise<ApiResponse<ModuleRow | null>> {
  await mockDelay()
  const row = PARTS_REQUEST_ROWS.find((item) => String(item.id) === id) ?? null
  return { code: 200, message: 'success', data: row }
}

export async function getPartsRequestSections(): Promise<ApiResponse<ModuleSection[]>> {
  await mockDelay(120)
  return { code: 200, message: 'success', data: PARTS_REQUEST_SECTIONS }
}
