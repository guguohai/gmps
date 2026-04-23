export type FilterType = 'input' | 'select' | 'date'

export type ModuleFilter = {
  key: string
  label: string
  type: FilterType
  placeholder?: string
  options?: Array<string | { value: string; label: string }>
}

export type ModuleColumn = {
  key: string
  title: string
  width?: number
  align?: 'left' | 'center' | 'right'
}

export type ModuleField = {
  key: string
  label: string
  type?: 'input' | 'select' | 'number' | 'date' | 'textarea' | 'switch' | 'radio' | 'text' | 'searchSelect' | 'multiSelect'
  options?: string[]
  value?: string | string[]
  editable?: boolean
  showWhen?: 'outbound' | 'transfer'
}

export type ModuleSection = {
  title: string
  fields: ModuleField[]
}

export type ModuleNestedRow = Record<string, string | number>

export type ModuleRow = Record<string, string | number | boolean | ModuleNestedRow[] | ModuleRow[]>

export type ModuleSchema = {
  path: string
  title: string
  breadcrumb: [string, string]
  filters: ModuleFilter[]
  columns: ModuleColumn[]
  rows?: ModuleRow[]
  sections?: ModuleSection[]
}
