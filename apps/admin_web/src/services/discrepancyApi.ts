import { DISCREPANCY_LOGS_MOCK } from '../mocks/data/discrepancy'
import type { DiscrepancyLogRow } from '../types/discrepancy'

const mockDelay = (ms: number = 200) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export async function getDiscrepancyLogs(): Promise<DiscrepancyLogRow[]> {
  await mockDelay()
  return DISCREPANCY_LOGS_MOCK
}
