import type { ApiResponse } from '../types/api'
import type { ModuleRow, ModuleSection } from '../types/module'
import {
  PERMISSION_LIST_ROWS,
  PERMISSION_ROLE_ROWS,
  PERMISSION_ROLE_PERMISSION_ROWS,
  PERMISSION_USER_ROWS,
  PERMISSION_LIST_SECTIONS,
  PERMISSION_ROLE_SECTIONS,
  PERMISSION_ROLE_PERMISSION_SECTIONS,
  PERMISSION_USER_SECTIONS,
} from '../mocks/data/user'

const mockDelay = (ms: number = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function getPermissionList(): Promise<ApiResponse<ModuleRow[]>> {
  await mockDelay()
  return { code: 200, message: 'success', data: PERMISSION_LIST_ROWS }
}

export async function getPermissionRoleList(): Promise<ApiResponse<ModuleRow[]>> {
  await mockDelay()
  return { code: 200, message: 'success', data: PERMISSION_ROLE_ROWS }
}

export async function getPermissionRolePermissionList(): Promise<ApiResponse<ModuleRow[]>> {
  await mockDelay()
  return { code: 200, message: 'success', data: PERMISSION_ROLE_PERMISSION_ROWS }
}

export async function getPermissionUserList(): Promise<ApiResponse<ModuleRow[]>> {
  await mockDelay()
  return { code: 200, message: 'success', data: PERMISSION_USER_ROWS }
}

export async function getPermissionUserDetail(id: string): Promise<ApiResponse<ModuleRow | null>> {
  await mockDelay()
  const row = PERMISSION_USER_ROWS.find((item) => String(item.id) === id) ?? null
  return { code: 200, message: 'success', data: row }
}

export async function getPermissionUserSections(): Promise<ApiResponse<ModuleSection[]>> {
  await mockDelay(120)
  return { code: 200, message: 'success', data: PERMISSION_USER_SECTIONS }
}

export async function getPermissionRoleDetail(id: string): Promise<ApiResponse<ModuleRow | null>> {
  await mockDelay()
  const row = PERMISSION_ROLE_ROWS.find((item) => String(item.id) === id) ?? null
  return { code: 200, message: 'success', data: row }
}

export async function getPermissionRoleSections(): Promise<ApiResponse<ModuleSection[]>> {
  await mockDelay(120)
  return { code: 200, message: 'success', data: PERMISSION_ROLE_SECTIONS }
}

export async function getPermissionRolePermissionDetail(id: string): Promise<ApiResponse<ModuleRow | null>> {
  await mockDelay()
  const row = PERMISSION_ROLE_PERMISSION_ROWS.find((item) => String(item.id) === id) ?? null
  return { code: 200, message: 'success', data: row }
}

export async function getPermissionRolePermissionSections(): Promise<ApiResponse<ModuleSection[]>> {
  await mockDelay(120)
  return { code: 200, message: 'success', data: PERMISSION_ROLE_PERMISSION_SECTIONS }
}

export async function getPermissionListDetail(id: string): Promise<ApiResponse<ModuleRow | null>> {
  await mockDelay()
  const row = PERMISSION_LIST_ROWS.find((item) => String(item.id) === id) ?? null
  return { code: 200, message: 'success', data: row }
}

export async function getPermissionListSections(): Promise<ApiResponse<ModuleSection[]>> {
  await mockDelay(120)
  return { code: 200, message: 'success', data: PERMISSION_LIST_SECTIONS }
}
