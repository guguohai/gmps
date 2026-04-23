import type { TicketMainStatus, TicketSubStatus, TicketStatusNode } from '../types/ticket'

// 业务规则：主状态默认颜色
const defaultToneByMain: Record<TicketMainStatus, string> = {
  REVIEW: 'processing',
  ACCEPT: 'processing',
  RECEIVE: 'processing',
  JUDGE: 'warning',
  PAY: 'warning',
  PROCESS: 'processing',
  FULFILL: 'processing',
  COMPLETE: 'success',
}

// 业务规则：快捷筛选状态（前端决定展示哪些）
export const TICKET_LIST_SHORTCUT_STATUSES: readonly string[] = [
  'RECEIVED',
  'WAITING_JUDGE',
  'WAITING_PAY',
  'REPAIRING',
  'WAITING_OUTBOUND',
]

/**
 * 根据 API 返回的状态树构建所有派生数据和工具函数
 */
export function buildTicketStatusHelpers(groups: readonly TicketStatusNode[]) {
  const TICKET_MAIN_STATUS_ORDER: TicketMainStatus[] = groups.map((g) => g.code)

  const TICKET_STATUS_GROUP_MAP = Object.fromEntries(
    groups.map((g) => [g.code, g.children.map((c) => c.code)]),
  ) as unknown as Record<TicketMainStatus, readonly TicketSubStatus[]>

  const TICKET_ALL_SUB_STATUSES: TicketSubStatus[] = groups.flatMap((g) =>
    g.children.map((c) => c.code),
  ) as TicketSubStatus[]

  const ticketSubStatusSet = new Set<string>(TICKET_ALL_SUB_STATUSES)

  const isTicketSubStatus = (value: string): value is TicketSubStatus =>
    ticketSubStatusSet.has(value)

  const normalizeTicketSubStatus = (value: string, fallback: TicketSubStatus = 'WAITING_REPAIR'): TicketSubStatus =>
    isTicketSubStatus(value) ? value : fallback

  const getTicketMainStatusBySubStatus = (subStatus: string): TicketMainStatus => {
    const found = groups.find((g) => g.children.some((c) => c.code === subStatus))
    return found?.code ?? 'PROCESS'
  }

  const TICKET_STATUS_LABEL_MAP: Record<string, string> = Object.fromEntries(
    groups.flatMap((g) => [
      [g.code, g.label],
      ...g.children.map((c) => [c.code, c.label]),
    ]),
  )

  const TICKET_STATUS_TONE_MAP: Record<TicketSubStatus, string> = Object.fromEntries(
    groups.flatMap((g) =>
      g.children.map((c) => [c.code, defaultToneByMain[g.code]] as const),
    ),
  ) as Record<TicketSubStatus, string>

  // 特殊状态颜色覆盖
  TICKET_STATUS_TONE_MAP.REJECTED = 'error'
  TICKET_STATUS_TONE_MAP.PAY_OVERDUE = 'error'
  TICKET_STATUS_TONE_MAP.SURVEY_EXPIRED = 'default'
  TICKET_STATUS_TONE_MAP.CANCELLED = 'default'
  TICKET_STATUS_TONE_MAP.UNPAID_CLOSED = 'default'
  TICKET_STATUS_TONE_MAP.REPAIR_CANCELLED = 'default'
  TICKET_STATUS_TONE_MAP.CLOSED = 'default'
  TICKET_STATUS_TONE_MAP.REFUNDED = 'success'
  TICKET_STATUS_TONE_MAP.WAITING_PARTS = 'purple'
  TICKET_STATUS_TONE_MAP.STORE_PICKUP = 'cyan'

  return {
    TICKET_MAIN_STATUS_ORDER,
    TICKET_STATUS_GROUP_MAP,
    TICKET_ALL_SUB_STATUSES,
    isTicketSubStatus,
    normalizeTicketSubStatus,
    getTicketMainStatusBySubStatus,
    TICKET_STATUS_LABEL_MAP,
    TICKET_STATUS_TONE_MAP,
  }
}
