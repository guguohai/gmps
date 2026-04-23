import { consultationListMock } from '../mocks/data/consultation'
import type { ConsultationRow } from '../types/consultation'

const mockDelay = (ms: number = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function getConsultationList(): Promise<ConsultationRow[]> {
  await mockDelay()
  return consultationListMock
}

/**
 * 获取咨询详情
 * GET /api/service/consultation/:id
 */
export async function getConsultationDetail(id: string): Promise<ConsultationRow> {
  await mockDelay()
  return consultationListMock.find((item) => item.id === id) ?? consultationListMock[0]
}
