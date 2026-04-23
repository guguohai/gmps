import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DetailPageBase } from '../components/DetailPageBase'
import { getConfigStatusDetail, getConfigStatusSections } from '../services/configApi'
import type { ModuleRow, ModuleSchema, ModuleSection } from '../types/module'

const CONFIG_STATUS_SCHEMA: ModuleSchema = {
  path: '/config/status',
  title: '状态配置',
  breadcrumb: ['系统配置', '状态配置'],
  filters: [],
  columns: [],
}

export function ConfigStatusDetailPage() {
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
    Promise.all([getConfigStatusDetail(id), getConfigStatusSections()])
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
      schema={CONFIG_STATUS_SCHEMA}
      sections={mappedSections}
      basePath="/config/status"
      loading={loading}
    />
  )
}

