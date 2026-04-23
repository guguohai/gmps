import type { ApiResponse } from '../types/api'
import type { ModuleRow, ModuleSection } from '../types/module'
import {
  CONFIG_DICT_ROWS,
  CONFIG_STATUS_ROWS,
  CONFIG_TEMPLATE_ROWS,
  CONFIG_DICT_SECTIONS,
  CONFIG_STATUS_SECTIONS,
  CONFIG_TEMPLATE_SECTIONS,
} from '../mocks/data/config'

const mockDelay = (ms: number = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function getConfigDictList(): Promise<ApiResponse<ModuleRow[]>> {
  await mockDelay()
  return { code: 200, message: 'success', data: CONFIG_DICT_ROWS }
}

export async function getConfigStatusList(): Promise<ApiResponse<ModuleRow[]>> {
  await mockDelay()
  return { code: 200, message: 'success', data: CONFIG_STATUS_ROWS }
}

export async function getConfigTemplateList(): Promise<ApiResponse<ModuleRow[]>> {
  await mockDelay()
  return { code: 200, message: 'success', data: CONFIG_TEMPLATE_ROWS }
}

export async function getConfigDictDetail(id: string): Promise<ApiResponse<ModuleRow | null>> {
  await mockDelay()
  const row = CONFIG_DICT_ROWS.find((item) => String(item.id) === id) ?? null
  return { code: 200, message: 'success', data: row }
}

export async function getConfigDictSections(): Promise<ApiResponse<ModuleSection[]>> {
  await mockDelay(120)
  return { code: 200, message: 'success', data: CONFIG_DICT_SECTIONS }
}

export async function getConfigTemplateDetail(id: string): Promise<ApiResponse<ModuleRow | null>> {
  await mockDelay()
  const row = CONFIG_TEMPLATE_ROWS.find((item) => String(item.id) === id) ?? null
  return { code: 200, message: 'success', data: row }
}

export async function getConfigTemplateSections(): Promise<ApiResponse<ModuleSection[]>> {
  await mockDelay(120)
  return { code: 200, message: 'success', data: CONFIG_TEMPLATE_SECTIONS }
}

export async function getConfigStatusDetail(id: string): Promise<ApiResponse<ModuleRow | null>> {
  await mockDelay()
  const row = CONFIG_STATUS_ROWS.find((item) => String(item.id) === id) ?? null
  return { code: 200, message: 'success', data: row }
}

export async function getConfigStatusSections(): Promise<ApiResponse<ModuleSection[]>> {
  await mockDelay(120)
  return { code: 200, message: 'success', data: CONFIG_STATUS_SECTIONS }
}
