export type TicketMainStatus =
  | 'REVIEW' | 'ACCEPT' | 'RECEIVE' | 'JUDGE'
  | 'PAY' | 'PROCESS' | 'FULFILL' | 'COMPLETE'

export type TicketProcessSubStatus =
  | 'WAITING_REPAIR' | 'REPAIRING' | 'WAITING_PARTS' | 'PARTNER_PROCESSING'
  | 'HQ_PROCESSING' | 'KOREA_REPAIRING' | '3PL_PROCESSING' | 'PRODUCT_EXCHANGE'
  | 'OTHER_EXCHANGE' | 'CANNOT_REPAIR_RETURN' | 'REPAIR_COMPLETED' | 'PROCESS_COMPLETED'

export type TicketSubStatus =
  | 'SUBMITTED' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED'
  | 'ACCEPTED' | 'WAITING_CUSTOMER_SHIP' | 'WAITING_SHIP_INFO' | 'STORE_RECEIVED' | 'WAITING_RECYCLE'
  | 'TRANSFER_TO_OFFICE' | 'EXPRESS_IN_TRANSIT' | 'RECEIVED' | 'HEAD_OFFICE_INBOUND'
  | 'WAITING_JUDGE' | 'TESTING' | 'JUDGING' | 'CONSULTATION_STANDBY' | 'CUSTOMER_CONFIRMING' | 'JUDGE_COMPLETED'
  | 'WAITING_PAY' | 'PAY_PROCESSING' | 'PAID' | 'PAY_OVERDUE' | 'REFUND_PROCESSING' | 'REFUNDED'
  | TicketProcessSubStatus
  | 'OUTBOUND_READY' | 'WAITING_OUTBOUND' | 'OUTBOUND_COMPLETED' | 'DELIVERY_STARTED' | 'STORE_ARRIVED' | 'DELIVERY_COMPLETED' | 'STORE_PICKUP' | 'STORE_RECEIPT_COMPLETED'
  | 'SERVICE_COMPLETED' | 'SERVICE_ENDED' | 'SURVEY_PENDING' | 'SURVEY_SUBMITTED' | 'SURVEY_EXPIRED' | 'CANCELLED' | 'UNPAID_CLOSED' | 'REPAIR_CANCELLED' | 'CLOSED'

export type TicketStatusNode = {
  code: TicketMainStatus
  label: string
  children: { code: TicketSubStatus; label: string }[]
}

export type TicketFlowView = {
  mainStatus: TicketMainStatus
  subStatus: TicketSubStatus
  specialDescription: string
  inventoryRequestNo: string
  inventoryRequestStatus: string
  inventoryRequestCompleted: boolean
  hasPendingInventoryRequest: boolean
}

export type TicketFlowStepRecord = {
  mainStatus: TicketMainStatus
  subStatus: TicketSubStatus | null
  completedAt: string | null
  operator: string | null
}

export type TicketFlowStepsResponse = {
  currentMainStatus: TicketMainStatus
  currentSubStatus: TicketSubStatus
  steps: TicketFlowStepRecord[]
}

export type InventoryItem = {
  key: string
  productName: string
  quantity: number
  reason?: string
  category?: string
  reasonCategory?: string
  reasonSubCategory?: string
}

export type AttachmentRow = {
  key: string
  title: string
  fileType: string
  modifyTime: string
  modifyBy: string
}

export type CustomerConfirmationRow = {
  key: string
  content: string
  imageUrls?: string[]
  status?: string
  confirmResult?: string
  confirmTime?: string
}

export type PriceItemRow = {
  key: string
  no: string
  productCode: string
  product: string
  planQty: string
  actualQty: string
  planTotal: string
  actualTotal: string
  repairType: string
}

export type PriceFactorRow = {
  key: string
  code: string
  name: string
  status: string
  manual: string
  amount: string
  target: string
  value: string
}

export type NoticeRow = {
  key: string
  sendTime: string
  noticeType: string
  receiver: string
  status: string
  summary: string
}

export type TicketLogRow = {
  key: string
  no: string
  opTime: string
  operator: string
  action: string
  detail: string
}

export type CustomerHistoryRow = {
  key: string
  ticketNo: string
  acceptDate: string
  status: string
  faultType: string
}
