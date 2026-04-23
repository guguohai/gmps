import type { ApiResponse } from '../types/api'
import type { ModuleRow, ModuleSection } from '../types/module'
import type { TicketStatusNode, TicketFlowStepsResponse } from '../types/ticket'
import { getTicketDetailRowById, TICKET_FLOW_STEPS_MOCK, ticketListRows, TICKET_LIST_SECTIONS } from '../mocks/data/ticket'
import { TICKET_STATUS_GROUPS } from '../mocks/data/dict'

const mockDelay = (ms: number = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function getTicketList(): Promise<ApiResponse<ModuleRow[]>> {
  await mockDelay()
  return { code: 200, message: 'success', data: ticketListRows }
}

export async function getTicketDetail(ticketId: string): Promise<ApiResponse<ModuleRow | null>> {
  await mockDelay()
  return {
    code: 200,
    message: 'success',
    data: getTicketDetailRowById(ticketId) ?? null,
  }
}

export async function getTicketDetailSections(): Promise<ApiResponse<ModuleSection[]>> {
  await mockDelay(120)
  return {
    code: 200,
    message: 'success',
    data: TICKET_LIST_SECTIONS,
  }
}

export async function getTicketStatusTree(): Promise<ApiResponse<TicketStatusNode[]>> {
  await mockDelay(200)
  return { code: 200, message: 'success', data: TICKET_STATUS_GROUPS }
}

export async function getTicketFlowSteps(ticketId: string): Promise<ApiResponse<TicketFlowStepsResponse>> {
  await mockDelay(200)
  console.log('[Mock API] Get ticket flow steps:', ticketId)
  const ticketRow = ticketListRows.find(
    (row) => String(row.id) === ticketId || String(row.ticketNo) === ticketId,
  )

  const fallbackMainStatus = TICKET_FLOW_STEPS_MOCK.currentMainStatus
  const fallbackSubStatus = TICKET_FLOW_STEPS_MOCK.currentSubStatus

  const currentMainStatus = typeof ticketRow?.mainStatus === 'string'
    ? ticketRow.mainStatus as TicketFlowStepsResponse['currentMainStatus']
    : fallbackMainStatus
  const currentSubStatus = typeof ticketRow?.subStatus === 'string'
    ? ticketRow.subStatus as TicketFlowStepsResponse['currentSubStatus']
    : fallbackSubStatus

  const steps = TICKET_FLOW_STEPS_MOCK.steps.map((step) =>
    step.mainStatus === currentMainStatus
      ? { ...step, subStatus: currentSubStatus, completedAt: null, operator: null }
      : step,
  )

  if (!steps.some((step) => step.mainStatus === currentMainStatus)) {
    steps.push({
      mainStatus: currentMainStatus,
      subStatus: currentSubStatus,
      completedAt: null,
      operator: null,
    })
  }

  return {
    code: 200,
    message: 'success',
    data: {
      currentMainStatus,
      currentSubStatus,
      steps,
    },
  }
}
