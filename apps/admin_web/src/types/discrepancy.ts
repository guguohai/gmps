export type DiscrepancyStatus = '待确认' | '处理中' | '已完成'
export type ResultStatus = '待执行' | '执行失败' | '已完成'

export type DiscrepancyRow = {
  key: string
  diffNo: string
  diffType: string
  source: string
  sourceNo: string
  productCode: string
  productName: string
  location: string
  sapQty: number
  psQty: number
  diffQty: number
  reason: string
  handling: string
  resultNo: string
  resultStatus: ResultStatus
  status: DiscrepancyStatus
  foundAt: string
  handler: string
  updatedAt: string
}

export type DiscrepancyLogRow = {
  key: string
  time: string
  operator: string
  action: string
  from: string
  to: string
  desc: string
}
