import { useMemo, useState } from 'react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DetailPageBase } from '../components/DetailPageBase'
import { PERMISSION_LIST_ROWS } from '../mocks/data/user'
import type { ModuleRow, ModuleSchema, ModuleSection } from '../types/module'
import { getPermissionListDetail, getPermissionListSections } from '../services/permissionApi'

const isSwitchOn = (value: string) => {
  const normalized = value.trim().toLowerCase()
  return normalized === 'on' || normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === '是'
}

export function PermissionListDetailPage() {
  const { id } = useParams()
  const [sections, setSections] = useState<ModuleSection[]>([])
  const [detailData, setDetailData] = useState<ModuleRow | null>(null)
  const [loading, setLoading] = useState(true)
  const schema: ModuleSchema = {
    path: '/permission/list',
    title: '权限详情',
    breadcrumb: ['权限管理', '权限列表'],
    filters: [],
    columns: [],
  }
  const basePath = '/permission/list'

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    Promise.all([getPermissionListDetail(id), getPermissionListSections()])
      .then(([detailRes, sectionRes]) => {
        if (cancelled) return
        setDetailData(detailRes.data ?? null)
        setSections(sectionRes.data ?? [])
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  const currentRow = useMemo(() => detailData as ModuleRow | undefined, [detailData])

  const [permissionListData] = useState<ModuleRow[]>(PERMISSION_LIST_ROWS)

  const permissionParentOptions = useMemo(() => {
    return Array.from(
      new Set(
        ['无', ...permissionListData.map((row) => String(row.permName ?? '')).filter(Boolean)],
      ),
    )
  }, [permissionListData])

  const mappedSections = useMemo(() => {
    return sections.map((section) => ({
      ...section,
      fields: section.fields.map((field) => {
        if (field.label === '权限编码') {
          return { ...field, value: String(currentRow?.permCode ?? field.value ?? '') }
        }
        if (field.label === '权限名称') {
          return { ...field, value: String(currentRow?.permName ?? field.value ?? '') }
        }
        if (field.label === '权限类型') {
          const currentType = String(currentRow?.permType ?? field.value ?? '菜单权限')
          return {
            ...field,
            type: 'select' as const,
            value: currentType,
            options: Array.from(new Set(['目录权限', '菜单权限', '按钮权限', '接口权限', currentType].filter(Boolean))),
          }
        }
        if (field.label === '父级权限') {
          const currentParent = String(currentRow?.parentPermission ?? field.value ?? '无')
          return {
            ...field,
            type: 'select' as const,
            value: currentParent,
            options: Array.from(new Set([...permissionParentOptions, currentParent].filter(Boolean))),
          }
        }
        if (field.label === '页面路由') {
          return { ...field, value: String(currentRow?.pageRoute ?? field.value ?? '') }
        }
        if (field.label === '组件路径') {
          return { ...field, value: String(currentRow?.componentPath ?? field.value ?? '') }
        }
        if (field.label === '接口地址') {
          return { ...field, value: String(currentRow?.apiPath ?? field.value ?? '') }
        }
        if (field.label === '请求方式') {
          const currentMethod = String(currentRow?.httpMethod ?? field.value ?? '')
          return {
            ...field,
            type: 'select' as const,
            value: currentMethod,
            options: ['', 'GET', 'POST', 'PUT', 'DELETE'],
          }
        }
        if (field.label === '排序号') {
          return { ...field, type: 'number' as const, value: String(currentRow?.sortNo ?? field.value ?? '0') }
        }
        if (field.label === '是否可见') {
          const visibleText = String(currentRow?.visible ?? field.value ?? '是')
          const visibleOn = visibleText === '是' || isSwitchOn(visibleText)
          return { ...field, type: 'switch' as const, value: visibleOn ? 'on' : 'off' }
        }
        if (field.label === '状态') {
          const statusVal = String(currentRow?.status ?? field.value ?? '启用')
          return {
            ...field,
            type: 'select' as const,
            value: statusVal === '启用' || statusVal === '停用' ? statusVal : '启用',
            options: ['启用', '停用'],
          }
        }
        if (field.label === '权限说明') {
          return { ...field, value: String(currentRow?.permissionDesc ?? field.value ?? '') }
        }
        return field
      }),
    }))
  }, [sections, currentRow, permissionParentOptions])

  return (
    <DetailPageBase
      schema={schema}
      sections={mappedSections}
      basePath={basePath}
      loading={loading}
    />
  )
}
