import { EditOutlined, SearchOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, Form, Input, Row, Select, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListPageToolbar } from '../components/ListPageToolbar'
import { useI18n } from '../i18n/context'
import { getPermissionList } from '../services/permissionApi'
import type { ModuleRow } from '../types/module'

const PAGE_SIZE = 10

type FilterValues = {
  permCode?: string
  permName?: string
  permType?: string
  status?: string
}

export function PermissionListPage() {
  const navigate = useNavigate()
  const { messages } = useI18n()
  const [form] = Form.useForm()
  const [sourceRows, setSourceRows] = useState<ModuleRow[]>([])
  const [filters, setFilters] = useState<FilterValues>({})
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let cancelled = false
    getPermissionList()
      .then((res) => { if (!cancelled && res.data) setSourceRows(res.data) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const typeOptions = useMemo(() =>
    Array.from(new Set(sourceRows.map((row) => String(row.permType ?? '')).filter(Boolean))).map((value) => ({ label: value, value })),
  [sourceRows])
  const statusOptions = useMemo(() =>
    Array.from(new Set(sourceRows.map((row) => String(row.status ?? '')).filter(Boolean))).map((value) => ({ label: value, value })),
  [sourceRows])

  const filteredRows = useMemo(() => sourceRows.filter((row) => {
    if (filters.permCode && !String(row.permCode ?? '').includes(filters.permCode.trim())) return false
    if (filters.permName && !String(row.permName ?? '').includes(filters.permName.trim())) return false
    if (filters.permType && String(row.permType ?? '') !== filters.permType) return false
    if (filters.status && String(row.status ?? '') !== filters.status) return false
    return true
  }), [filters, sourceRows])

  const dataSource = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredRows.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredRows])

  const columns = useMemo<ColumnsType<ModuleRow>>(() => [
    { title: '权限编码', dataIndex: 'permCode', key: 'permCode', width: 180 },
    { title: '权限名称', dataIndex: 'permName', key: 'permName', width: 180 },
    { title: '权限类型', dataIndex: 'permType', key: 'permType', width: 140 },
    { title: '父级权限', dataIndex: 'parentPerm', key: 'parentPerm', width: 160 },
    { title: '可见', dataIndex: 'visible', key: 'visible', width: 100, render: (v: unknown) => <Tag>{String(v ?? '')}</Tag> },
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
            navigate('/permission/list/' + String(row.id))
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
        <Col><Breadcrumb items={[{ title: messages.navigation.permission }, { title: messages.navigation.permission_list }]} /></Col>
        <Col><ListPageToolbar pathname="/permission/list" /></Col>
      </Row>
      <Card style={{ border: '1px solid #f1f5f9' }}>
        <Form form={form} layout="vertical" onFinish={handleFilter} className="app-filter-form">
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="权限编码" name="permCode">
                    <Input placeholder="输入编码" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="权限名称" name="permName">
                    <Input placeholder="输入名称" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="权限类型" name="permType">
                    <Select allowClear placeholder="选择类型" options={typeOptions} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="状态" name="status">
                    <Select allowClear placeholder="选择状态" options={statusOptions} />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div style={{ marginLeft: 16, marginTop: 30 }}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />} />
              </Space>
            </div>
          </div>
        </Form>
      </Card>
      <Card style={{ border: '1px solid #f1f5f9' }} styles={{ body: { padding: 0 } }}>
        <Table
          rowKey={(row) => String(row.id)}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            current: currentPage,
            pageSize: PAGE_SIZE,
            total: filteredRows.length,
            onChange: setCurrentPage,
            showSizeChanger: false,
          }}
        />
      </Card>
    </div>
  )
}
