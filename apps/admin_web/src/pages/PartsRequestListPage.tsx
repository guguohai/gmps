import { DownOutlined, EditOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Input, Row, Select, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListPageToolbar } from '../components/ListPageToolbar'
import { useI18n } from '../i18n/context'
import { getPartsRequestList } from '../services/partsApi'
import type { ModuleRow } from '../types/module'

const PAGE_SIZE = 10

type FilterValues = {
  requester?: string
  status?: string
  storeName?: string
  storeType?: string
  requestTimeRange?: [Dayjs, Dayjs]
  productName?: string
  partName?: string
  partLocation?: string
  color?: string
  quantity?: string
}

export function PartsRequestListPage() {
  const navigate = useNavigate()
  const { messages } = useI18n()
  const [form] = Form.useForm()
  const initialDateRange: [Dayjs, Dayjs] = useMemo(() => [dayjs().subtract(1, 'month'), dayjs()], [])
  const [sourceRows, setSourceRows] = useState<ModuleRow[]>([])
  const [filters, setFilters] = useState<FilterValues>({ requestTimeRange: initialDateRange })
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [expand, setExpand] = useState(false)

  useEffect(() => {
    let cancelled = false
    getPartsRequestList()
      .then((res) => {
        if (!cancelled && res.data) setSourceRows(res.data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const statusOptions = useMemo(() => {
    return Array.from(new Set(sourceRows.map((row) => String(row.status ?? '')).filter(Boolean)))
      .map((value) => ({ label: value, value }))
  }, [sourceRows])

  const storeTypeOptions = useMemo(() => {
    return Array.from(new Set(sourceRows.map((row) => String(row.storeType ?? '')).filter(Boolean)))
      .map((value) => ({ label: value, value }))
  }, [sourceRows])

  const filteredRows = useMemo(() => {
    return sourceRows.filter((row) => {
      if (filters.requester && !String(row.requester ?? '').includes(filters.requester.trim())) return false
      if (filters.status && String(row.status ?? '') !== filters.status) return false
      if (filters.storeName && !String(row.storeName ?? '').includes(filters.storeName.trim())) return false
      if (filters.storeType && String(row.storeType ?? '') !== filters.storeType) return false
      if (filters.productName && !String(row.productName ?? '').includes(filters.productName.trim())) return false
      if (filters.partName && !String(row.partName ?? '').includes(filters.partName.trim())) return false
      if (filters.partLocation && !String(row.partLocation ?? '').includes(filters.partLocation.trim())) return false
      if (filters.color && !String(row.color ?? '').includes(filters.color.trim())) return false
      if (filters.quantity && !String(row.quantity ?? '').includes(filters.quantity.trim())) return false

      if (filters.requestTimeRange && filters.requestTimeRange.length === 2) {
        const rowTime = dayjs(String(row.requestTime ?? ''))
        const [start, end] = filters.requestTimeRange
        if (!rowTime.isValid() || rowTime.isBefore(start.startOf('day')) || rowTime.isAfter(end.endOf('day'))) {
          return false
        }
      }
      return true
    })
  }, [filters, sourceRows])

  const dataSource = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredRows.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredRows])

  const columns = useMemo<ColumnsType<ModuleRow>>(() => [
    { title: '请求时间', dataIndex: 'requestTime', key: 'requestTime', width: 180 },
    { title: '请求负责人', dataIndex: 'requester', key: 'requester', width: 140 },
    { title: '门店类型', dataIndex: 'storeType', key: 'storeType', width: 140 },
    { title: '门店名称', dataIndex: 'storeName', key: 'storeName', width: 200 },
    { title: '产品名称', dataIndex: 'productName', key: 'productName', width: 200 },
    { title: '小零件名称', dataIndex: 'partName', key: 'partName', width: 200 },
    { title: '小零件存放位置', dataIndex: 'partLocation', key: 'partLocation', width: 180 },
    { title: '颜色', dataIndex: 'color', key: 'color', width: 140 },
    { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 100 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (value: unknown) => <Tag>{String(value ?? '')}</Tag>,
    },
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
            navigate('/parts/request/' + String(row.id))
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
          <Breadcrumb items={[{ title: messages.navigation.parts }, { title: messages.navigation.parts_request }]} />
        </Col>
        <Col>
          <ListPageToolbar pathname="/parts/request" />
        </Col>
      </Row>

      <Card style={{ border: '1px solid #f1f5f9' }}>
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleFilter} 
          className="app-filter-form"
          initialValues={{ requestTimeRange: initialDateRange }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="请求负责人" name="requester">
                    <Input placeholder="请输入负责人" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="状态" name="status">
                    <Select allowClear options={statusOptions} placeholder="请选择状态" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="门店名称" name="storeName">
                    <Input placeholder="请输入门店名称" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="门店类型" name="storeType">
                    <Select allowClear options={storeTypeOptions} placeholder="请选择门店类型" />
                  </Form.Item>
                </Col>
                {expand && (
                  <>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="请求时间" name="requestTimeRange">
                        <DatePicker.RangePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="产品名称" name="productName">
                        <Input placeholder="请输入产品名称" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="小零件名称" name="partName">
                        <Input placeholder="请输入小零件名称" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="存放位置" name="partLocation">
                        <Input placeholder="请输入存放位置" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="颜色" name="color">
                        <Input placeholder="请输入颜色" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="数量" name="quantity">
                        <Input placeholder="请输入数量" />
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
          scroll={{ x: 1800 }}
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
