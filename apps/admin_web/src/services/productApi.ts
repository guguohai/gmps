import type { ApiResponse } from '../types/api'
import type { ModuleRow, ModuleSection } from '../types/module'
import { PRODUCT_LIST_ROWS, PRODUCT_LIST_SECTIONS } from '../mocks/data/product'

const mockDelay = (ms: number = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function getProductList(): Promise<ApiResponse<ModuleRow[]>> {
  await mockDelay()
  return { code: 200, message: 'success', data: PRODUCT_LIST_ROWS }
}

export async function getProductDetail(id: string): Promise<ApiResponse<ModuleRow | null>> {
  await mockDelay()
  const row = PRODUCT_LIST_ROWS.find((item) => String(item.id) === id) ?? null
  return { code: 200, message: 'success', data: row }
}

export async function getProductSections(): Promise<ApiResponse<ModuleSection[]>> {
  await mockDelay(120)
  return { code: 200, message: 'success', data: PRODUCT_LIST_SECTIONS }
}
