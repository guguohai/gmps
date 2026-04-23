import { DownOutlined, EditOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, Form, Input, Row, Select, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListPageToolbar } from '../components/ListPageToolbar'
import { useI18n } from '../i18n/context'
import { getPartsList } from '../services/partsApi'
import type { ModuleRow } from '../types/module'

const PAGE_SIZE = 10

type FilterValues = {
  partId?: string
  partName?: string
  color?: string
  spec?: string
  quantity?: string
  location?: string
}

export function PartsListPage() {
  const navigate = useNavigate()
  const { messages } = useI18n()
  const [form] = Form.useForm()
  const [sourceRows, setSourceRows] = useState<ModuleRow[]>([])
  const [filters, setFilters] = useState<FilterValues>({})
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [expand, setExpand] = useState(false)

  useEffect(() => {
    let cancelled = false
    getPartsList()
      .then((res) => {
        if (!cancelled && res.data) setSourceRows(res.data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const colorOptions = useMemo(() => {
    return Array.from(new Set(sourceRows.map((row) => String(row.color ?? '')).filter(Boolean)))
      .map((value) => ({ label: value, value }))
  }, [sourceRows])

  const filteredRows = useMemo(() => {
    return sourceRows.filter((row) => {
      if (filters.partId && !String(row.partId ?? '').includes(filters.partId.trim())) return false
      if (filters.partName && !String(row.partName ?? '').includes(filters.partName.trim())) return false
      if (filters.color && String(row.color ?? '') !== filters.color) return false
      if (filters.spec && !String(row.spec ?? '').includes(filters.spec.trim())) return false
      if (filters.quantity && !String(row.quantity ?? '').includes(filters.quantity.trim())) return false
      if (filters.location && !String(row.location ?? '').includes(filters.location.trim())) return false
      return true
    })
  }, [filters, sourceRows])

  const dataSource = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredRows.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredRows])

  const columns = useMemo<ColumnsType<ModuleRow>>(() => [
    {
      title: '小零件ID',
      dataIndex: 'partId',
      key: 'partId',
      width: 140,
    },
    { title: '小零件名称', dataIndex: 'partName', key: 'partName', width: 260 },
    { title: '总数量', dataIndex: 'quantity', key: 'quantity', width: 120 },
    { title: '颜色', dataIndex: 'color', key: 'color', width: 160 },
    { title: '规格', dataIndex: 'spec', key: 'spec', width: 140 },
    { title: '存放位置', dataIndex: 'location', key: 'location', width: 160 },
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
            navigate('/parts/list/' + String(row.id))
          }}
        />
      ),
    },
  ], [navigate])

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  }

  const handleFilter = (values: FilterValues) => {
    setFilters(values)
    setCurrentPage(1)
  }


  if (loading) return <Card loading style={{ margin: 16 }} />

  return (
    <div className="app-page-stack">
      <Row className="app-sticky-page-bar" justify="space-between" align="middle">
        <Col>
          <Breadcrumb items={[{ title: messages.navigation.parts }, { title: messages.navigation.parts_list }]} />
        </Col>
        <Col>
          <ListPageToolbar pathname="/parts/list" />
        </Col>
      </Row>

      <Card style={{ border: '1px solid #f1f5f9' }}>
        <Form form={form} layout="vertical" onFinish={handleFilter} className="app-filter-form">
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="小零件ID" name="partId">
                    <Input placeholder="请输入小零件ID" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="小零件名称" name="partName">
                    <Input placeholder="请输入小零件名称" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="颜色" name="color">
                    <Select allowClear options={colorOptions} placeholder="请选择颜色" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="规格" name="spec">
                    <Input placeholder="请输入规格" />
                  </Form.Item>
                </Col>
                {expand && (
                  <>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="总数量" name="quantity">
                        <Input placeholder="请输入数量" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="存放位置" name="location">
                        <Input placeholder="请输入存放位置" />
                      </Form.Item>
                    </Col>
                  </>
                )}
              </Row>
            </div>
            <div style={{ marginLeft: 16, marginTop: 30 }}>
              <Space>
                <Button icon={<SearchOutlined />} type="primary" htmlType="submit" />
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
          rowSelection={rowSelection}
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
