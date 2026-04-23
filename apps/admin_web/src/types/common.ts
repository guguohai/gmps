import type { ColumnsType } from 'antd/es/table'

export type SearchableSelectOption = {
  value: string
  label: React.ReactNode
  searchText: string
  plainLabel?: string
}

export type ModuleTableMock = {
  title: string
  description: string
  columns: ColumnsType<Record<string, string | number>>
  data: Record<string, string | number>[]
}

export type RolePermissionItem = {
  key: string
  module: string
  parentName: string
  name: string
  checked: boolean
}
