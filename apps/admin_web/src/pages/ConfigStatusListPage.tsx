import { DownOutlined, EditOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, Form, Input, Row, Select, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListPageToolbar } from '../components/ListPageToolbar'
import { useI18n } from '../i18n/context'
import { getConfigStatusList } from '../services/configApi'
import type { ModuleRow } from '../types/module'

const PAGE_SIZE = 10

type FilterValues = {
  bizObject?: string
  recordStatus?: string
  statusCode?: string
  statusName?: string
  status?: string
}

export function ConfigStatusListPage() {
  const navigate = useNavigate()
  const { messages } = useI18n()
  const [form] = Form.useForm()
  const [sourceRows, setSourceRows] = useState<ModuleRow[]>([])
  const [filters, setFilters] = useState<FilterValues>({})
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [expand, setExpand] = useState(false)

  useEffect(() => {
    let cancelled = false
    getConfigStatusList()
      .then((res) => {
        if (!cancelled && res.data) setSourceRows(res.data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const bizOptions = useMemo(() => {
    return Array.from(new Set(sourceRows.map((row) => String(row.bizObject ?? '')).filter(Boolean)))
      .map((value) => ({ label: value, value }))
  }, [sourceRows])

  const statusNameOptions = useMemo(() => {
    return Array.from(new Set(sourceRows.map((row) => String(row.statusName ?? '')).filter(Boolean)))
      .map((value) => ({ label: value, value }))
  }, [sourceRows])

  const statusOptions = useMemo(() => {
    return Array.from(new Set(sourceRows.map((row) => String(row.status ?? '')).filter(Boolean)))
      .map((value) => ({ label: value, value }))
  }, [sourceRows])

  const filteredRows = useMemo(() => {
    return sourceRows.filter((row) => {
      if (filters.bizObject && String(row.bizObject ?? '') !== filters.bizObject) return false
      if (filters.recordStatus && String(row.recordStatus ?? '') !== filters.recordStatus) return false
      if (filters.statusCode && !String(row.statusCode ?? '').includes(filters.statusCode.trim())) return false
      if (filters.statusName && String(row.statusName ?? '') !== filters.statusName) return false
      if (filters.status && String(row.status ?? '') !== filters.status) return false
      return true
    })
  }, [filters, sourceRows])

  const dataSource = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredRows.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredRows])

  const columns = useMemo<ColumnsType<ModuleRow>>(() => [
    {
      title: '状态编码',
      dataIndex: 'statusCode',
      key: 'statusCode',
      width: 180,
    },
    { title: '业务对象', dataIndex: 'bizObject', key: 'bizObject', width: 180 },
    { title: '状态名称', dataIndex: 'statusName', key: 'statusName', width: 180 },
    { title: '描述', dataIndex: 'description', key: 'description', width: 180 },
    {
      title: '状态色',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (value: unknown) => <Tag>{String(value ?? '')}</Tag>,
    },
    {
      title: '记录状态',
      dataIndex: 'recordStatus',
      key: 'recordStatus',
      width: 120,
      render: (value: unknown) => {
        const status = String(value ?? '')
        return <Tag color={status === '启用' ? 'success' : 'default'}>{status}</Tag>
      },
    },
    { title: '更新人', dataIndex: 'updatedBy', key: 'updatedBy', width: 120 },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_, row: ModuleRow) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={(event) => {
            event.stopPropagation()
            navigate('/config/status/' + String(row.id))
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
        <Col>
          <Breadcrumb items={[{ title: messages.navigation.config }, { title: messages.navigation.config_status }]} />
        </Col>
        <Col>
          <ListPageToolbar pathname="/config/status" />
        </Col>
      </Row>

      <Card style={{ border: '1px solid #f1f5f9' }}>
        <Form form={form} layout="vertical" onFinish={handleFilter} className="app-filter-form">
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="业务对象" name="bizObject">
                    <Select allowClear options={bizOptions} placeholder="请选择业务对象" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="记录状态" name="recordStatus">
                    <Select
                      allowClear
                      placeholder="请选择记录状态"
                      options={[
                        { label: '启用', value: '启用' },
                        { label: '停用', value: '停用' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="状态编码" name="statusCode">
                    <Input placeholder="请输入状态编码" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="状态名称" name="statusName">
                    <Select allowClear options={statusNameOptions} placeholder="请选择状态名称" />
                  </Form.Item>
                </Col>
                {expand && (
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item label="状态分类" name="status">
                      <Select allowClear options={statusOptions} placeholder="请选择状态分类" />
                    </Form.Item>
                  </Col>
                )}
              </Row>
            </div>
            <div style={{ marginLeft: 16, marginTop: 30 }}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />} />
                <Button icon={expand ? <UpOutlined /> : <DownOutlined />} onClick={() => setExpand(!expand)} />
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
            total: filteredRows.length,
            pageSize: PAGE_SIZE,
            showSizeChanger: false,
            onChange: setCurrentPage,
          }}
        />
      </Card>
    </div>
  )
}
