import { DownOutlined, EditOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Input, Modal, Row, Select, Space, Table, Tag, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListPageToolbar } from '../components/ListPageToolbar'
import { useI18n } from '../i18n/context'
import { getInventoryRequestList } from '../services/inventoryApi'
import type { ModuleRow } from '../types/module'


const PAGE_SIZE = 10

type FilterValues = {
  ticketId?: string
  progressStatus?: string
  requester?: string
  productCode?: string
  productName?: string
  location?: string
  requestQty?: string
  processor?: string
  requestTimeRange?: [dayjs.Dayjs, dayjs.Dayjs]
}

export function InventoryRequestListPage() {
  const navigate = useNavigate()
  const { messages } = useI18n()
  const [form] = Form.useForm()
  const initialDateRange: [dayjs.Dayjs, dayjs.Dayjs] = useMemo(() => [dayjs().subtract(5, 'year'), dayjs()], [])
  const [sourceRows, setSourceRows] = useState<ModuleRow[]>([])
  const [filters, setFilters] = useState<FilterValues>({ requestTimeRange: initialDateRange })
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [expand, setExpand] = useState(false)

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editForm] = Form.useForm()

  useEffect(() => {
    let cancelled = false
    getInventoryRequestList()
      .then((res) => {
        if (!cancelled && res.data) setSourceRows(res.data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const statusOptions = useMemo(() => {
    return Array.from(new Set(sourceRows.map((row) => String(row.progressStatus ?? '')).filter(Boolean)))
      .map((value) => ({ label: value, value }))
  }, [sourceRows])

  const filteredRows = useMemo(() => {
    return sourceRows.filter((row) => {
      if (filters.ticketId && !String(row.ticketId ?? '').includes(filters.ticketId.trim())) return false
      if (filters.requester && !String(row.requester ?? '').includes(filters.requester.trim())) return false
      if (filters.progressStatus && String(row.progressStatus ?? '') !== filters.progressStatus) return false
      if (filters.productCode && !String(row.productCode ?? '').includes(filters.productCode.trim())) return false
      if (filters.productName && !String(row.productName ?? '').includes(filters.productName.trim())) return false
      if (filters.location && !String(row.location ?? '').includes(filters.location.trim())) return false
      if (filters.requestQty && !String(row.requestQty ?? '').includes(filters.requestQty.trim())) return false
      if (filters.processor && !String(row.processor ?? '').includes(filters.processor.trim())) return false
      
      if (filters.requestTimeRange && filters.requestTimeRange.length === 2) {
        const [start, end] = filters.requestTimeRange
        const rowTime = dayjs(String(row.requestTime ?? ''))
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
    {
      title: '工单ID',
      dataIndex: 'ticketId',
      key: 'ticketId',
      width: 140,
    },
    { title: '请求时间', dataIndex: 'requestTime', key: 'requestTime', width: 180 },
    {
      title: '进度状态',
      dataIndex: 'progressStatus',
      key: 'progressStatus',
      width: 120,
      render: (value: unknown) => <Tag>{String(value ?? '')}</Tag>,
    },
    { title: '请求负责人', dataIndex: 'requester', key: 'requester', width: 140 },
    { title: '产品编码', dataIndex: 'productCode', key: 'productCode', width: 160 },
    { title: '产品名称', dataIndex: 'productName', key: 'productName', width: 220 },
    { title: '存放位置', dataIndex: 'location', key: 'location', width: 140 },
    { title: '请求数量', dataIndex: 'requestQty', key: 'requestQty', width: 100 },
    { title: '处理人', dataIndex: 'processor', key: 'processor', width: 120 },
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
            navigate('/inventory/request/' + String(row.id))
          }}
        />
      ),
    },
  ], [navigate])

  const rowSelection = useMemo(() => ({
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys.map(String)),
  }), [selectedRowKeys])

  const handleFilter = (values: FilterValues) => {
    setFilters(values)
    setCurrentPage(1)
  }

  const handleToolbarAction = (key: string) => {
    if (key === 'edit') {
      const initialTicketIds = sourceRows
        .filter(r => selectedRowKeys.includes(String(r.id)))
        .map(r => String(r.ticketId ?? ''))
        .filter(Boolean)

      editForm.setFieldsValue({
        ticketIds: initialTicketIds,
        progressStatus: '待处理',
        processor: '当前用户',
        handleTime: dayjs()
      })
      setEditModalOpen(true)
    }
  }

  if (loading) return <Card loading style={{ margin: 16 }} />

  return (
    <div className="app-page-stack">
      <Row className="app-sticky-page-bar" justify="space-between" align="middle">
        <Col>
          <Breadcrumb items={[{ title: messages.navigation.inventory }, { title: messages.navigation.inventory_request }]} />
        </Col>
        <Col>
          <ListPageToolbar pathname="/inventory/request" onAction={handleToolbarAction} />
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
                  <Form.Item label="工单ID" name="ticketId">
                    <Input placeholder="请输入工单ID" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="进度状态" name="progressStatus">
                    <Select allowClear options={statusOptions} placeholder="请选择进度状态" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="请求负责人" name="requester">
                    <Input placeholder="请输入请求负责人" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="产品编码" name="productCode">
                    <Input placeholder="请输入产品编码" />
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
                      <Form.Item label="存放位置" name="location">
                        <Input placeholder="请输入存放位置" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="请求数量" name="requestQty">
                        <Input placeholder="请输入请求数量" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="处理人" name="processor">
                        <Input placeholder="请输入处理人" />
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
          scroll={{ x: 1400 }}
          pagination={{
            current: currentPage,
            total: filteredRows.length,
            pageSize: PAGE_SIZE,
            showSizeChanger: false,
            onChange: setCurrentPage,
          }}
        />
      </Card>

      <Modal
        title="批量编辑"
        open={editModalOpen}
        onOk={() => {
          editForm.validateFields().then((values) => {
            console.log('提交的数据:', values)
            message.success('保存成功')
            setEditModalOpen(false)
            setSelectedRowKeys([])
            editForm.resetFields()
          })
        }}
        onCancel={() => setEditModalOpen(false)}
        maskClosable={false}
        okText="保存"
        cancelText="取消"
        width={480}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="已选工单ID"
            name="ticketIds"
            rules={[{ required: true, message: '请至少选择或输入一个工单ID' }]}
          >
            <Select 
              mode="tags" 
              style={{ width: '100%' }} 
              placeholder="选择或输入工单ID"
              tokenSeparators={[',', ' ']}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="进度状态" name="progressStatus">
                <Select
                  options={['待处理', '处理中', '等待配件', '待出库', '服务完成', '已关闭'].map((v) => ({ value: v, label: v }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="处理人" name="processor">
                <Select
                  showSearch
                  options={['当前用户', '张敏', '王雪', '李晨', '马会安', '周晨曦', '宋逸凡'].map((v) => ({ value: v, label: v }))}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="处理时间" name="handleTime">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
