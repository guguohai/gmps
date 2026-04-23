import type { TicketStatusNode } from '../../types/ticket'

const TICKET_STATUS_GROUPS: TicketStatusNode[] = [
  {
    code: 'REVIEW',
    label: '审核',
    children: [
      { code: 'SUBMITTED', label: '申请已提交' },
      { code: 'IN_PROGRESS', label: '审核中' },
      { code: 'APPROVED', label: '审核通过' },
      { code: 'REJECTED', label: '审核不通过' },
    ],
  },
  {
    code: 'ACCEPT',
    label: '受理',
    children: [
      { code: 'ACCEPTED', label: '受理完成' },
      { code: 'WAITING_CUSTOMER_SHIP', label: '等待客户寄件' },
      { code: 'WAITING_SHIP_INFO', label: '待补充寄件信息' },
      { code: 'STORE_RECEIVED', label: '门店接收完成' },
      { code: 'WAITING_RECYCLE', label: '等待回收中' },
    ],
  },
  {
    code: 'RECEIVE',
    label: '接收',
    children: [
      { code: 'TRANSFER_TO_OFFICE', label: '移送至Office中' },
      { code: 'EXPRESS_IN_TRANSIT', label: '快件运送中' },
      { code: 'RECEIVED', label: '已接收' },
      { code: 'HEAD_OFFICE_INBOUND', label: '本社入库完成' },
    ],
  },
  {
    code: 'JUDGE',
    label: '判定',
    children: [
      { code: 'WAITING_JUDGE', label: '待判定' },
      { code: 'TESTING', label: '检测中' },
      { code: 'JUDGING', label: '判定中' },
      { code: 'CONSULTATION_STANDBY', label: '咨询待机' },
      { code: 'CUSTOMER_CONFIRMING', label: '客户确认中' },
      { code: 'JUDGE_COMPLETED', label: '服务判定完成' },
    ],
  },
  {
    code: 'PAY',
    label: '支付',
    children: [
      { code: 'WAITING_PAY', label: '待支付' },
      { code: 'PAY_PROCESSING', label: '支付处理中' },
      { code: 'PAID', label: '支付完成' },
      { code: 'PAY_OVERDUE', label: '支付逾期' },
      { code: 'REFUND_PROCESSING', label: '退款处理中' },
      { code: 'REFUNDED', label: '退款完成' },
    ],
  },
  {
    code: 'PROCESS',
    label: '处理',
    children: [
      { code: 'WAITING_REPAIR', label: '待维修' },
      { code: 'REPAIRING', label: '维修进行中' },
      { code: 'WAITING_PARTS', label: '等待配件' },
      { code: 'PARTNER_PROCESSING', label: '合作厂家处理中' },
      { code: 'HQ_PROCESSING', label: '韩国总部处理中' },
      { code: 'KOREA_REPAIRING', label: '韩国维修处理中' },
      { code: '3PL_PROCESSING', label: '3PL处理中' },
      { code: 'PRODUCT_EXCHANGE', label: '产品交换处理中' },
      { code: 'OTHER_EXCHANGE', label: '他品交换处理中' },
      { code: 'CANNOT_REPAIR_RETURN', label: '无法维修待返还' },
      { code: 'REPAIR_COMPLETED', label: '维修完成' },
      { code: 'PROCESS_COMPLETED', label: '处理完成' },
    ],
  },
  {
    code: 'FULFILL',
    label: '履约',
    children: [
      { code: 'OUTBOUND_READY', label: '出库准备完成' },
      { code: 'WAITING_OUTBOUND', label: '待出库' },
      { code: 'OUTBOUND_COMPLETED', label: '出库完成' },
      { code: 'DELIVERY_STARTED', label: '配送开始' },
      { code: 'STORE_ARRIVED', label: '门店到达' },
      { code: 'DELIVERY_COMPLETED', label: '配送完成' },
      { code: 'STORE_PICKUP', label: '门店可取' },
      { code: 'STORE_RECEIPT_COMPLETED', label: '门店收货完成' },
    ],
  },
  {
    code: 'COMPLETE',
    label: '完成',
    children: [
      { code: 'SERVICE_COMPLETED', label: '服务完成' },
      { code: 'SERVICE_ENDED', label: '服务结束' },
      { code: 'SURVEY_PENDING', label: '问卷待回复' },
      { code: 'SURVEY_SUBMITTED', label: '问卷已提交' },
      { code: 'SURVEY_EXPIRED', label: '问卷已过期' },
      { code: 'CANCELLED', label: '已取消' },
      { code: 'UNPAID_CLOSED', label: '未付款关闭' },
      { code: 'REPAIR_CANCELLED', label: '维修取消' },
      { code: 'CLOSED', label: '已关闭' },
    ],
  },
]

export const DICT_DATA = {
  'ticket-status': TICKET_STATUS_GROUPS.flatMap((group) =>
    group.children.map((c) => ({ code: c.code, label: c.label })),
  ),
  'channel': [
    { code: 'ONLINE', label: '线上商城' },
    { code: 'STORE', label: '实体店' },
    { code: 'HOTLINE', label: '客服热线' },
  ],
  'repair-executor': [
    { code: 'HEADQUARTERS', label: '本社维修中心' },
    { code: 'PARTNER', label: '授权服务商' },
  ],
  'outbound-method': [
    { code: 'EXPRESS', label: '快递配送' },
    { code: 'SELF_PICKUP', label: '自提' },
  ],
  'product-category': [
    { code: 'LENS', label: '镜片' },
    { code: 'FRAME', label: '镜框' },
    { code: 'ACCESSORY', label: '配件' },
    { code: 'SCREW', label: '螺丝' },
    { code: 'NOSE_PAD', label: '鼻托' },
  ],
} as const

export { TICKET_STATUS_GROUPS }
