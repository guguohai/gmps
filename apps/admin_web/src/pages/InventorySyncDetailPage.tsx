import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DetailPageBase } from '../components/DetailPageBase'
import { getInventorySyncDetail, getInventorySyncSections } from '../services/inventoryApi'
import type { ModuleRow, ModuleSchema, ModuleSection } from '../types/module'

const INVENTORY_SYNC_SCHEMA: ModuleSchema = {
  path: '/inventory/sync',
  title: '库存同步',
  breadcrumb: ['库存管理', '库存同步'],
  filters: [],
  columns: [],
}

export function InventorySyncDetailPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [sections, setSections] = useState<ModuleSection[]>([])
  const [detail, setDetail] = useState<ModuleRow | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    Promise.all([getInventorySyncDetail(id), getInventorySyncSections()])
      .then(([detailRes, sectionRes]) => {
        if (cancelled) return
        setDetail(detailRes.data ?? null)
        setSections(sectionRes.data ?? [])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id])

  const mappedSections = useMemo(() => {
    if (!detail) return sections
    return sections.map((section) => ({
      ...section,
      fields: section.fields.map((field) => {
        const value = detail[field.key]
        if (typeof value === 'string' || typeof value === 'number') {
          return { ...field, value: String(value) }
        }
        return field
      }),
    }))
  }, [detail, sections])

  return (
    <DetailPageBase
      schema={INVENTORY_SYNC_SCHEMA}
      sections={mappedSections}
      basePath="/inventory/sync"
      loading={loading}
    />
  )
}

