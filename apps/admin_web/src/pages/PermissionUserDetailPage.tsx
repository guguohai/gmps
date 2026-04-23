import { Select } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DetailPageBase } from '../components/DetailPageBase'
import type { ModuleField } from '../types/module'
import { renderEditableField, renderReadOnlyField } from '../utils/detailRender'
import type { ModuleRow, ModuleSchema, ModuleSection } from '../types/module'
import { getPermissionUserDetail, getPermissionUserSections } from '../services/permissionApi'

export function PermissionUserDetailPage() {
  const { id } = useParams()
  const [sections, setSections] = useState<ModuleSection[]>([])
  const [detailData, setDetailData] = useState<ModuleRow | null>(null)
  const [loading, setLoading] = useState(true)
  const schema: ModuleSchema = {
    path: '/permission/user',
    title: '用户详情',
    breadcrumb: ['权限管理', '用户管理'],
    filters: [],
    columns: [],
  }
  const basePath = '/permission/user'

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    Promise.all([getPermissionUserDetail(id), getPermissionUserSections()])
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

  const renderField = (field: ModuleField) => {
    const strValue = Array.isArray(field.value) ? field.value.join(',') : (field.value ?? '')

    if (field.label === '部门') {
      const options = (field.options && field.options.length ? field.options : [strValue || '']).filter(Boolean)
      return (
        <Select
          defaultValue={strValue || options[0]}
          options={options.map((option) => ({ value: option, label: option }))}
          showSearch
          optionFilterProp="label"
        />
      )
    }

    return field.editable === false ? renderReadOnlyField(field) : renderEditableField(field)
  }

  return (
    <DetailPageBase
      schema={schema}
      sections={mappedSections}
      basePath={basePath}
      loading={loading}
      renderField={renderField}
    />
  )
}
