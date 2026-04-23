import { EditOutlined, SearchOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, Form, Input, Row, Select, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListPageToolbar } from '../components/ListPageToolbar'
import { useI18n } from '../i18n/context'
import { getConfigDictList } from '../services/configApi'
import type { ModuleRow } from '../types/module'

const PAGE_SIZE = 10

type FilterValues = {
  dictType?: string
  status?: string
  code?: string
  name?: string
}

export function ConfigDictListPage() {
  const navigate = useNavigate()
  const { messages } = useI18n()
  const [form] = Form.useForm()
  const [sourceRows, setSourceRows] = useState<ModuleRow[]>([])
  const [filters, setFilters] = useState<FilterValues>({})
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let cancelled = false
    getConfigDictList()
      .then((res) => {
        if (!cancelled && res.data) setSourceRows(res.data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const typeOptions = useMemo(() => {
    return Array.from(new Set(sourceRows.map((row) => String(row.dictType ?? '')).filter(Boolean)))
      .map((value) => ({ label: value, value }))
  }, [sourceRows])

  const nameOptions = useMemo(() => {
    return Array.from(new Set(sourceRows.map((row) => String(row.name ?? '')).filter(Boolean)))
      .map((value) => ({ label: value, value }))
  }, [sourceRows])

  const filteredRows = useMemo(() => {
    return sourceRows.filter((row) => {
      if (filters.dictType && String(row.dictType ?? '') !== filters.dictType) return false
      if (filters.status && String(row.status ?? '') !== filters.status) return false
      if (filters.code && !String(row.code ?? '').includes(filters.code.trim())) return false
      if (filters.name && String(row.name ?? '') !== filters.name) return false
      return true
    })
  }, [filters, sourceRows])

  const dataSource = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredRows.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredRows])

  const columns = useMemo<ColumnsType<ModuleRow>>(() => [
    {
      title: '字典编码',
      dataIndex: 'code',
      key: 'code',
      width: 180,
    },
    { title: '字典类型', dataIndex: 'dictType', key: 'dictType', width: 180 },
    { title: '名称', dataIndex: 'name', key: 'name', width: 180 },
    { title: '父级编码', dataIndex: 'parentCode', key: 'parentCode', width: 160 },
    { title: '排序号', dataIndex: 'sortNo', key: 'sortNo', width: 100 },
    { title: '默认', dataIndex: 'isDefault', key: 'isDefault', width: 100 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (value: unknown) => {
        const status = String(value ?? '')
        return <Tag color={status === '启用' ? 'success' : 'default'}>{status}</Tag>
      },
    },
    { title: '更新人', dataIndex: 'updater', key: 'updater', width: 120 },
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
            navigate('/config/dict/' + String(row.id))
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
          <Breadcrumb items={[{ title: messages.navigation.config }, { title: messages.navigation.config_dict }]} />
        </Col>
        <Col>
          <ListPageToolbar pathname="/config/dict" />
        </Col>
      </Row>

      <Card style={{ border: '1px solid #f1f5f9' }}>
        <Form form={form} layout="vertical" onFinish={handleFilter} className="app-filter-form">
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="字典类型" name="dictType">
                    <Select allowClear options={typeOptions} placeholder="请选择字典类型" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="状态" name="status">
                    <Select
                      allowClear
                      placeholder="请选择状态"
                      options={[
                        { label: '启用', value: '启用' },
                        { label: '停用', value: '停用' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="字典编码" name="code">
                    <Input placeholder="请输入字典编码" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="名称" name="name">
                    <Select allowClear options={nameOptions} placeholder="请选择名称" />
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
