import type { CustomerConfirmationRow } from './ticket'

export type ConsultationConfirmationItemsProps = {
  showTitle?: boolean
  initialRows?: CustomerConfirmationRow[]
}

export type ConsultationConfirmationItemRow = {
  key: string
  content: string
  imageUrls: string
  confirmResult: string
  confirmTime: string
}

export type ConsultationHistoryRow = {
  key: string
  ticketNo: string
  acceptDate: string
  status: string
  faultType: string
}

export type ConsultationRow = {
  id: string
  ticketNo: string
  itemNo: string
  itemType: string
  subject: string
  channel: string
  consultDate: string
  handler: string
  status: string
  confirmResult: string
  confirmTime: string
  customerName: string
  phone: string
  email: string
  address: string
  country: string
  receiveDate: string
  receiveChannel: string
  purchaseDate: string
  purchaseChannel: string
  productName: string
  productBarcode: string
  hasStock: string
  repairFeasible: string
  stockInDate: string
  expectedOutDate: string
  repairContent: string
  repairFee: string
  paymentStatus: string
  outboundDoneDate: string
  customerHistory: ConsultationHistoryRow[]
  confirmationItems: ConsultationConfirmationItemRow[]
}
