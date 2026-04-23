import { useEffect, useMemo, useState } from 'react'
import { buildTicketStatusHelpers } from '../business/ticketStatus'
import type { TicketStatusNode } from '../types/ticket'
import { getTicketStatusTree } from '../services/ticketApi'

export function useTicketStatus() {
  const [groups, setGroups] = useState<TicketStatusNode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getTicketStatusTree()
      .then((res) => {
        if (!cancelled && res.code === 200 && res.data) {
          setGroups(res.data)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const helpers = useMemo(() => {
    if (groups.length === 0) return null
    return buildTicketStatusHelpers(groups)
  }, [groups])

  return { helpers, loading }
}
