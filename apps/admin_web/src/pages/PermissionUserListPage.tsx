import { EditOutlined, SearchOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, Form, Input, Row, Select, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListPageToolbar } from '../components/ListPageToolbar'
import { useI18n } from '../i18n/context'
import { getPermissionUserList } from '../services/permissionApi'
import type { ModuleRow } from '../types/module'

const PAGE_SIZE = 10

type FilterValues = {
  username?: string
  name?: string
  department?: string
  role?: string
}

export function PermissionUserListPage() {
  const navigate = useNavigate()
  const { messages } = useI18n()
  const [form] = Form.useForm()
  const [sourceRows, setSourceRows] = useState<ModuleRow[]>([])
  const [filters, setFilters] = useState<FilterValues>({})
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let cancelled = false
    getPermissionUserList()
      .then((res) => {
        if (!cancelled && res.data) setSourceRows(res.data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const departmentOptions = useMemo(() => {
    return Array.from(new Set(sourceRows.map((row) => String(row.department ?? '')).filter(Boolean)))
      .map((value) => ({ label: value, value }))
  }, [sourceRows])

  const roleOptions = useMemo(() => {
    return Array.from(new Set(sourceRows.map((row) => String(row.role ?? '')).filter(Boolean)))
      .map((value) => ({ label: value, value }))
  }, [sourceRows])

  const filteredRows = useMemo(() => sourceRows.filter((row) => {
    if (filters.username && !String(row.username ?? '').includes(filters.username.trim())) return false
    if (filters.name && !String(row.name ?? '').includes(filters.name.trim())) return false
    if (filters.department && String(row.department ?? '') !== filters.department) return false
    if (filters.role && String(row.role ?? '') !== filters.role) return false
    return true
  }), [filters, sourceRows])

  const dataSource = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredRows.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredRows])

  const columns = useMemo<ColumnsType<ModuleRow>>(() => [
    { title: '登录账号', dataIndex: 'username', key: 'username', width: 180 },
    { title: '姓名', dataIndex: 'name', key: 'name', width: 140 },
    { title: '职位', dataIndex: 'position', key: 'position', width: 160 },
    { title: '部门', dataIndex: 'department', key: 'department', width: 140 },
    { title: '角色', dataIndex: 'role', key: 'role', width: 140 },
    { title: '编号', dataIndex: 'employeeNo', key: 'employeeNo', width: 140 },
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
            navigate('/permission/user/' + String(row.id))
          }}
        />
      ),
    },
  ], [navigate])

  const handleFilter = (values: FilterValues) => {
    setFilters(values)
    setCurrentPage(1)
  }

  if (loading) return <Card loading style={{ margin: 16 }} />

  return (
    <div className="app-page-stack">
      <Row className="app-sticky-page-bar" justify="space-between" align="middle">
        <Col><Breadcrumb items={[{ title: messages.navigation.permission }, { title: messages.navigation.user_list }]} /></Col>
        <Col><ListPageToolbar pathname="/permission/user" /></Col>
      </Row>
      <Card style={{ border: '1px solid #f1f5f9' }}>
        <Form form={form} layout="vertical" onFinish={handleFilter} className="app-filter-form">
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="登录账号" name="username">
                    <Input placeholder="输入账号" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="姓名" name="name">
                    <Input placeholder="输入姓名" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="部门" name="department">
                    <Select allowClear placeholder="选择部门" options={departmentOptions} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="角色" name="role">
                    <Select allowClear placeholder="选择角色" options={roleOptions} />
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
          scroll={{ x: 1100 }}
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
