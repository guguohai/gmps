import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DetailPageBase } from '../components/DetailPageBase'
import { getPermissionRolePermissionDetail, getPermissionRolePermissionSections } from '../services/permissionApi'
import type { ModuleRow, ModuleSchema, ModuleSection } from '../types/module'

export function PermissionRolePermissionDetailPage() {
  const { id } = useParams()
  const [sections, setSections] = useState<ModuleSection[]>([])
  const [detailData, setDetailData] = useState<ModuleRow | null>(null)
  const [loading, setLoading] = useState(true)
  const schema: ModuleSchema = {
    path: '/permission/role-permission',
    title: '角色权限详情',
    breadcrumb: ['权限管理', '角色权限'],
    filters: [],
    columns: [],
  }
  const basePath = '/permission/role-permission'

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    Promise.all([getPermissionRolePermissionDetail(id), getPermissionRolePermissionSections()])
      .then(([detailRes, sectionRes]) => {
        if (cancelled) return
        setDetailData(detailRes.data ?? null)
        setSections(sectionRes.data ?? [])
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  const mappedSections = useMemo(() => {
    if (!detailData) return sections
    return sections.map((section) => ({
      ...section,
      fields: section.fields.map((field) => {
        const value = detailData[field.key]
        if (typeof value === 'string' || typeof value === 'number') {
          return { ...field, value: String(value) }
        }
        return field
      }),
    }))
  }, [detailData, sections])

  return (
    <DetailPageBase
      schema={schema}
      sections={mappedSections}
      basePath={basePath}
      loading={loading}
    />
  )
}
