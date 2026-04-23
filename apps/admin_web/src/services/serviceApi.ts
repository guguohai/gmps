import type { ApiResponse } from '../types/api'
import type { ModuleRow, ModuleSection } from '../types/module'
import {
  SERVICE_SURVEY_ROWS,
  SERVICE_SURVEY_TEMPLATE_ROWS,
  SERVICE_SURVEY_SECTIONS,
  SERVICE_SURVEY_TEMPLATE_SECTIONS,
} from '../mocks/data/service'

const mockDelay = (ms: number = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function getServiceSurveyList(): Promise<ApiResponse<ModuleRow[]>> {
  await mockDelay()
  return { code: 200, message: 'success', data: SERVICE_SURVEY_ROWS }
}

export async function getServiceSurveyTemplateList(): Promise<ApiResponse<ModuleRow[]>> {
  await mockDelay()
  return { code: 200, message: 'success', data: SERVICE_SURVEY_TEMPLATE_ROWS }
}

export async function getServiceSurveyDetail(id: string): Promise<ApiResponse<ModuleRow | null>> {
  await mockDelay()
  const row = SERVICE_SURVEY_ROWS.find((item) => String(item.id) === id) ?? null
  return { code: 200, message: 'success', data: row }
}

export async function getServiceSurveySections(): Promise<ApiResponse<ModuleSection[]>> {
  await mockDelay(120)
  return { code: 200, message: 'success', data: SERVICE_SURVEY_SECTIONS }
}

export async function getServiceSurveyTemplateDetail(id: string): Promise<ApiResponse<ModuleRow | null>> {
  await mockDelay()
  const row = SERVICE_SURVEY_TEMPLATE_ROWS.find((item) => String(item.id) === id) ?? null
  return { code: 200, message: 'success', data: row }
}

export async function getServiceSurveyTemplateSections(): Promise<ApiResponse<ModuleSection[]>> {
  await mockDelay(120)
  return { code: 200, message: 'success', data: SERVICE_SURVEY_TEMPLATE_SECTIONS }
}
