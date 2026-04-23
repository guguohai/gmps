import { useMemo, useState } from 'react'
import { Checkbox, Col, Collapse, Row, Card } from 'antd'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DetailPageBase } from '../components/DetailPageBase'
import { PERMISSION_LIST_ROWS } from '../mocks/data/user'
import type { ModuleRow, ModuleSchema, ModuleSection } from '../types/module'
import type { RolePermissionItem } from '../types/common'
import { getPermissionRoleDetail, getPermissionRoleSections } from '../services/permissionApi'

const isSwitchOn = (value: string) => {
  const normalized = value.trim().toLowerCase()
  return normalized === 'on' || normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === '是'
}

export function PermissionRoleDetailPage() {
  const { id } = useParams()
  const [sections, setSections] = useState<ModuleSection[]>([])
  const [detailData, setDetailData] = useState<ModuleRow | null>(null)
  const [loading, setLoading] = useState(true)
  const schema: ModuleSchema = {
    path: '/permission/role',
    title: '角色详情',
    breadcrumb: ['权限管理', '角色管理'],
    filters: [],
    columns: [],
  }
  const basePath = '/permission/role'

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    Promise.all([getPermissionRoleDetail(id), getPermissionRoleSections()])
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
  const [userEditedRolePermissionKeys, setUserEditedRolePermissionKeys] = useState<string[] | null>(null)
  const [userEditedActiveCollapseKeys, setUserEditedActiveCollapseKeys] = useState<string[] | null>(null)

  const permissionListAllRows = useMemo(() => {
    return permissionListData.filter((row) => {
      const type = String(row.permType ?? '').trim()
      return type === '按钮权限' || type === '接口权限'
    })
  }, [permissionListData])

  const assignedRolePermissionKeys = useMemo(() => {
    if (!Array.isArray(currentRow?.permissionItems)) return new Set<string>()
    return new Set(
      (currentRow.permissionItems as ModuleRow[])
        .filter((item) => Boolean(item.checked))
        .map((item) => String(item.key ?? ''))
        .filter(Boolean)
    )
  }, [currentRow])

  const rolePermissionItems = useMemo<RolePermissionItem[]>(() => {
    const itemsFromPermissionList = permissionListAllRows
      .map((row, index) => {
        const key = String(row.permCode ?? row.id ?? `perm-${index + 1}`)
        const parentPermission = String(row.parentPerm ?? row.parentPermission ?? '').trim()
        const parentName = parentPermission && parentPermission !== '无' ? parentPermission : String(row.permName ?? '')
        const name = String(row.permName ?? '')
        const module = String(row.parentPerm ?? '')
        const checked = assignedRolePermissionKeys.has(key)
        return { key, module, parentName, name, checked }
      })
      .filter((item) => item.key && item.parentName && item.name)

    if (itemsFromPermissionList.length > 0) return itemsFromPermissionList

    if (!Array.isArray(currentRow?.permissionItems)) return []

    return (currentRow.permissionItems as ModuleRow[])
      .map((item, index) => {
        const key = String(item.key ?? `perm-${index + 1}`)
        const module = String(item.module ?? '')
        const parentName = String(item.parentPermission ?? item.module ?? '').trim()
        const name = String(item.name ?? '')
        const category = String(item.category ?? '')
        const checked = Boolean(item.checked)
        return { key, module, parentName, name, category, checked }
      })
      .filter((item) => item.module && item.parentName && item.name && item.category === '菜单权限')
      .map(({ key, module, parentName, name, checked }) => ({ key, module, parentName, name, checked }))
  }, [assignedRolePermissionKeys, currentRow, permissionListAllRows])

  const groupedRolePermissions = useMemo(() => {
    const grouped = new Map<string, RolePermissionItem[]>()
    rolePermissionItems.forEach((item) => {
      if (!grouped.has(item.parentName)) {
        grouped.set(item.parentName, [])
      }
      grouped.get(item.parentName)!.push(item)
    })
    return Array.from(grouped.entries()).map(([parentName, items]) => ({ parentName, items }))
  }, [rolePermissionItems])

  const defaultSelectedRolePermissionKeys = useMemo(
    () => rolePermissionItems.filter((item) => item.checked).map((item) => item.key),
    [rolePermissionItems]
  )

  const selectedRolePermissionKeys = userEditedRolePermissionKeys ?? defaultSelectedRolePermissionKeys

  const defaultActiveCollapseKeys = useMemo(
    () => [...new Set(rolePermissionItems.map((item) => item.parentName))],
    [rolePermissionItems]
  )

  const activeCollapseKeys = userEditedActiveCollapseKeys ?? defaultActiveCollapseKeys

  const mappedSections = useMemo(() => {
    return sections.map((section) => ({
      ...section,
      fields: section.fields
        .filter((field) => field.label !== '权限类型')
        .map((field) => {
          if (field.label === '角色编码') {
            return { ...field, value: String(currentRow?.roleId ?? field.value ?? '') }
          }
          if (field.label === '角色名称') {
            return { ...field, value: String(currentRow?.roleName ?? field.value ?? '') }
          }
          if (field.label === '角色状态') {
            const statusText = String(currentRow?.status ?? field.value ?? '')
            const enabled = statusText === '启用' || isSwitchOn(statusText)
            return { ...field, type: 'switch' as const, value: enabled ? 'on' : 'off' }
          }
          if (field.label === '角色说明') {
            return { ...field, value: String(currentRow?.roleDesc ?? field.value ?? '') }
          }
          return field
        }),
    }))
  }, [sections, currentRow])

  return (
    <DetailPageBase
      schema={schema}
      sections={mappedSections}
      basePath={basePath}
      loading={loading}
    >
      <Card title="权限列表">
        <Checkbox.Group
          value={selectedRolePermissionKeys}
          onChange={(values) => setUserEditedRolePermissionKeys(values.map(String))}
          style={{ width: '100%' }}
        >
          <Collapse
            activeKey={activeCollapseKeys}
            onChange={(keys) => setUserEditedActiveCollapseKeys(typeof keys === 'string' ? [keys] : keys)}
            style={{ width: '100%' }}
            items={groupedRolePermissions.map((group) => ({
              key: group.parentName,
              label: <span style={{ fontWeight: 600, color: '#334155' }}>{group.parentName}</span>,
              styles: { body: { minHeight: 80 } },
              children: (
                <Row gutter={[12, 12]}>
                  {group.items.map((item) => (
                    <Col key={item.key} xs={24} sm={12} md={8}>
                      <Checkbox value={item.key}>{item.name}</Checkbox>
                    </Col>
                  ))}
                </Row>
              ),
            }))}
          />
        </Checkbox.Group>
      </Card>
    </DetailPageBase>
  )
}
