export type ApiResponse<T> = {
  code: number
  message: string
  data: T
}

export type ListQueryParams = {
  page?: number
  pageSize?: number
  filters?: Record<string, string>
  sort?: { field: string; order: 'asc' | 'desc' }
}

export type ListResponse<T> = {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export type DictItem = { code: string; label: string }

export type DictType = 'ticket-status' | 'channel' | 'repair-executor' | 'outbound-method' | 'product-category'
