import { EditOutlined, SearchOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, Form, Input, Row, Select, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListPageToolbar } from '../components/ListPageToolbar'
import { useI18n } from '../i18n/context'
import { getPermissionRoleList } from '../services/permissionApi'
import type { ModuleRow } from '../types/module'

const PAGE_SIZE = 10

type FilterValues = {
  roleId?: string
  roleName?: string
  status?: string
}

export function PermissionRoleListPage() {
  const navigate = useNavigate()
  const { messages } = useI18n()
  const [form] = Form.useForm()
  const [sourceRows, setSourceRows] = useState<ModuleRow[]>([])
  const [filters, setFilters] = useState<FilterValues>({})
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let cancelled = false
    getPermissionRoleList()
      .then((res) => {
        if (!cancelled && res.data) setSourceRows(res.data)
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const statusOptions = useMemo(() => {
    return Array.from(new Set(sourceRows.map((row) => String(row.status ?? '')).filter(Boolean)))
      .map((value) => ({ label: value, value }))
  }, [sourceRows])

  const filteredRows = useMemo(() => sourceRows.filter((row) => {
    if (filters.roleId && !String(row.roleId ?? '').includes(filters.roleId.trim())) return false
    if (filters.roleName && !String(row.roleName ?? '').includes(filters.roleName.trim())) return false
    if (filters.status && String(row.status ?? '') !== filters.status) return false
    return true
  }), [filters, sourceRows])

  const dataSource = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredRows.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredRows])

  const columns = useMemo<ColumnsType<ModuleRow>>(() => [
    { title: '角色编码', dataIndex: 'roleId', key: 'roleId', width: 160 },
    { title: '角色名称', dataIndex: 'roleName', key: 'roleName', width: 180 },
    { title: '角色描述', dataIndex: 'roleDesc', key: 'roleDesc', width: 260 },
    { title: '用户数', dataIndex: 'userCount', key: 'userCount', width: 100 },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 140 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 120, render: (v: unknown) => <Tag color={String(v) === '启用' ? 'success' : 'default'}>{String(v ?? '')}</Tag> },
    {
      title: '操作',
      key: 'operation',
      width: 80,
      render: (_, row: ModuleRow) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={(event) => {
            event.stopPropagation()
            navigate('/permission/role/' + String(row.id))
          }}
        />
      ),
    },
  ], [navigate])

  const handleFilter = (values: FilterValues) => { setFilters(values); setCurrentPage(1) }
  if (loading) return <Card loading style={{ margin: 16 }} />

  return (
    <div className="app-page-stack">
      <Row className="app-sticky-page-bar" justify="space-between" align="middle">
        <Col><Breadcrumb items={[{ title: messages.navigation.permission }, { title: messages.navigation.role_list }]} /></Col>
        <Col><ListPageToolbar pathname="/permission/role" /></Col>
      </Row>
      <Card style={{ border: '1px solid #f1f5f9' }}>
        <Form form={form} layout="vertical" onFinish={handleFilter} className="app-filter-form">
          <Row gutter={16} align="bottom">
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="角色编码" name="roleId" style={{ marginBottom: 0 }}>
                <Input placeholder="输入编码" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="角色名称" name="roleName" style={{ marginBottom: 0 }}>
                <Input placeholder="输入名称" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item label="状态" name="status" style={{ marginBottom: 0 }}>
                <Select allowClear placeholder="选择状态" options={statusOptions} />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item style={{ marginBottom: 0 }}>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
      <Card style={{ border: '1px solid #f1f5f9' }} styles={{ body: { padding: 0 } }}>
        <Table
          rowKey={(row) => String(row.id)}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{ current: currentPage, total: filteredRows.length, pageSize: PAGE_SIZE, showSizeChanger: false, onChange: setCurrentPage }}
        />
      </Card>
    </div>
  )
}
