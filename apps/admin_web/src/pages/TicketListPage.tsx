import { DownOutlined, EditOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Input, Row, Select, Space, Table, Tag, Modal, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListPageToolbar } from '../components/ListPageToolbar'
import { useI18n } from '../i18n/context'
import { useTicketStatus } from '../hooks/useTicketStatus'
import { getTicketList } from '../services/ticketApi'
import type { ModuleRow } from '../types/module'

const PAGE_SIZE = 10

type TicketFilterValues = {
  ticketNo?: string
  customerName?: string
  phone?: string
  status?: string
  barcode?: string
  channel?: string
  repairExecutor?: string
  repairContent?: string
  receivedAtRange?: [Dayjs, Dayjs]
  headOfficeInboundDateRange?: [Dayjs, Dayjs]
  customerInboundTrackingNo?: string
  estimatedOutboundDateRange?: [Dayjs, Dayjs]
  email?: string
  productName?: string
  paymentDateRange?: [Dayjs, Dayjs]
  outboundMethod?: string
  outboundCompletedAtRange?: [Dayjs, Dayjs]
  customerReturnAddress?: string
  factory1?: string
  isFrozenTicket?: string
}

export function TicketListPage() {
  const navigate = useNavigate()
  const { messages } = useI18n()
  const [filterForm] = Form.useForm()
  const initialDateRange: [Dayjs, Dayjs] = useMemo(() => [dayjs().subtract(5, 'year'), dayjs()], [])
  const [sourceRows, setSourceRows] = useState<ModuleRow[]>([])
  const [filters, setFilters] = useState<TicketFilterValues>({ receivedAtRange: initialDateRange })
  const [loading, setLoading] = useState(true)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [expand, setExpand] = useState(false)
  const [batchEditVisible, setBatchEditVisible] = useState(false)
  const [batchEditForm] = Form.useForm()
  const ticketStatusFilterValue = Form.useWatch('status', filterForm) as string | undefined
  const { helpers: ticketStatusHelpers } = useTicketStatus()

  useEffect(() => {
    let cancelled = false
    getTicketList()
      .then((res) => {
        if (!cancelled && res.data) setSourceRows(res.data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const filteredRows = useMemo(() => {
    return sourceRows.filter((row) => {
      if (filters.ticketNo && !String(row.ticketNo ?? '').includes(filters.ticketNo.trim())) return false
      if (filters.customerName && !String(row.customerName ?? '').includes(filters.customerName.trim())) return false
      if (filters.phone && !String(row.phone ?? '').includes(filters.phone.trim())) return false
      if (filters.status && String(row.status ?? '') !== filters.status) return false
      if (filters.barcode && !String(row.barcode ?? '').includes(filters.barcode.trim())) return false
      if (filters.channel && !String(row.channel ?? '').includes(filters.channel.trim())) return false
      if (filters.repairExecutor && !String(row.repairExecutor ?? '').includes(filters.repairExecutor.trim())) return false
      if (filters.repairContent && !String(row.repairContent ?? '').includes(filters.repairContent.trim())) return false
      if (filters.customerInboundTrackingNo && !String(row.customerInboundTrackingNo ?? '').includes(filters.customerInboundTrackingNo.trim())) return false
      if (filters.email && !String(row.email ?? '').includes(filters.email.trim())) return false
      if (filters.productName && !String(row.productName ?? '').includes(filters.productName.trim())) return false
      if (filters.outboundMethod && !String(row.outboundMethod ?? '').includes(filters.outboundMethod.trim())) return false
      if (filters.customerReturnAddress && !String(row.customerReturnAddress ?? '').includes(filters.customerReturnAddress.trim())) return false
      if (filters.factory1 && String(row.factory1 ?? '') !== filters.factory1) return false
      if (filters.isFrozenTicket !== undefined && filters.isFrozenTicket !== '') {
        const isRowFrozen = row.isFrozenTicket === true || String(row.isFrozenTicket) === 'true' || String(row.isFrozenTicket) === '1' || String(row.isFrozenTicket) === '是'
        const filterFrozen = filters.isFrozenTicket === '1'
        if (isRowFrozen !== filterFrozen) return false
      }

      const checkDateRange = (dateStr: unknown, range?: [Dayjs, Dayjs]) => {
        if (!range || range.length !== 2) return true
        const rowTime = dayjs(String(dateStr ?? ''))
        const [start, end] = range
        if (!rowTime.isValid() || rowTime.isBefore(start.startOf('day')) || rowTime.isAfter(end.endOf('day'))) {
          return false
        }
        return true
      }

      if (!checkDateRange(row.receivedAt, filters.receivedAtRange)) return false
      if (!checkDateRange(row.headOfficeInboundDate, filters.headOfficeInboundDateRange)) return false
      if (!checkDateRange(row.estimatedOutboundDate, filters.estimatedOutboundDateRange)) return false
      if (!checkDateRange(row.paymentDate, filters.paymentDateRange)) return false
      if (!checkDateRange(row.outboundCompletedAt, filters.outboundCompletedAtRange)) return false

      return true
    })
  }, [sourceRows, filters])

  const dataSource = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return filteredRows.slice(start, end)
  }, [currentPage, filteredRows])

  const statusOptions = useMemo(() => {
    if (!ticketStatusHelpers) {
      const uniqueStatuses = Array.from(new Set(sourceRows.map((row) => String(row.status ?? '')).filter(Boolean)))
      return uniqueStatuses.map((status) => ({ label: status, value: status }))
    }

    return ticketStatusHelpers.TICKET_ALL_SUB_STATUSES.map((status) => ({
      label: ticketStatusHelpers.TICKET_STATUS_LABEL_MAP[status] ?? status,
      value: status,
    }))
  }, [sourceRows, ticketStatusHelpers])

  const factory1Options = useMemo(() => {
    return Array.from(new Set(sourceRows.map((row) => String(row.factory1 ?? '')).filter(Boolean)))
      .map((value) => ({ label: value, value }))
  }, [sourceRows])

  const engineerOptions = useMemo(() => {
    const names = ['张师傅', '李师傅', '王工程师', '赵师傅', '刘师傅']
    sourceRows.forEach((row) => {
      if (typeof row.repairEngineer === 'string' && row.repairEngineer) {
        names.push(row.repairEngineer)
      }
    })
    return Array.from(new Set(names)).map((value) => ({ label: value, value }))
  }, [sourceRows])

  const columns = useMemo<ColumnsType<ModuleRow>>(() => {
    return [
      {
        title: '工单编号',
        dataIndex: 'ticketNo',
        key: 'ticketNo',
        width: 180,
      },
      { title: '接收日期', dataIndex: 'receivedAt', key: 'receivedAt', width: 140 },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 140,
        render: (value: unknown) => {
          const str = String(value ?? '').trim()
          const label = ticketStatusHelpers?.TICKET_STATUS_LABEL_MAP?.[str] ?? str
          const tone =
            ticketStatusHelpers?.isTicketSubStatus(str)
              ? ticketStatusHelpers.TICKET_STATUS_TONE_MAP[str]
              : 'default'
          return <Tag color={tone}>{label}</Tag>
        },
      },
      { title: '本社入库日期', dataIndex: 'headOfficeInboundDate', key: 'headOfficeInboundDate', width: 140 },
      { title: '客户入库运单号', dataIndex: 'customerInboundTrackingNo', key: 'customerInboundTrackingNo', width: 160 },
      { title: '预计出库日期', dataIndex: 'estimatedOutboundDate', key: 'estimatedOutboundDate', width: 140 },
      { title: '受理渠道', dataIndex: 'channel', key: 'channel', width: 140 },
      { title: '客户', dataIndex: 'customerName', key: 'customerName', width: 140 },
      { title: '电话号码', dataIndex: 'phone', key: 'phone', width: 140 },
      { title: '邮箱', dataIndex: 'email', key: 'email', width: 140 },
      { title: '产品名称', dataIndex: 'productName', key: 'productName', width: 140 },
      { title: '维修执行方', dataIndex: 'repairExecutor', key: 'repairExecutor', width: 140 },
      { title: '维修内容', dataIndex: 'repairContent', key: 'repairContent', width: 140 },
      { title: '付款日期', dataIndex: 'paymentDate', key: 'paymentDate', width: 140 },
      { title: '出库方式', dataIndex: 'outboundMethod', key: 'outboundMethod', width: 140 },
      { title: '出库完成日期', dataIndex: 'outboundCompletedAt', key: 'outboundCompletedAt', width: 140 },
      { title: '客户产品寄回地址', dataIndex: 'customerReturnAddress', key: 'customerReturnAddress', width: 220 },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 80,
        render: (_, record) => (
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={(event) => {
              event.stopPropagation()
              navigate(`/ticket/list/${record.ticketNo}`)
            }}
          />
        ),
      },
    ]
  }, [navigate, ticketStatusHelpers])

  const rowSelection = useMemo(() => ({
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys.map(String)),
  }), [selectedRowKeys])

  const handleTicketStatusChange = (nextStatus: string) => {
    filterForm.setFieldsValue({ status: nextStatus })
    setFilters((prev) => ({ ...prev, status: nextStatus }))
    setCurrentPage(1)
  }

  const handleFilterSubmit = (values: TicketFilterValues) => {
    setFilters(values)
    setCurrentPage(1)
  }

  if (loading) {
    return <Card loading style={{ margin: 16 }} />
  }

  return (
    <div className="app-page-stack">
      <Row className="app-sticky-page-bar" justify="space-between" align="middle">
        <Col>
          <Breadcrumb items={[{ title: messages.navigation.ticket }, { title: messages.navigation.ticket_list }]} />
        </Col>
        <Col>
          <ListPageToolbar
            pathname="/ticket/list"
            ticketStatusValue={String(ticketStatusFilterValue ?? '')}
            onTicketStatusChange={handleTicketStatusChange}
            onAction={(key) => {
              if (key === 'edit') {
                if (selectedRowKeys.length === 0) {
                  message.warning('请先选择要编辑的工单')
                  return
                }
                setBatchEditVisible(true)
              }
            }}
          />
        </Col>
      </Row>

      <Card style={{ border: '1px solid #f1f5f9' }}>
        <Form 
          form={filterForm} 
          layout="vertical" 
          onFinish={handleFilterSubmit} 
          className="app-filter-form"
          initialValues={{ receivedAtRange: initialDateRange }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="ticketNo" label={messages.ticket.ticketNo}>
                    <Input placeholder={messages.ticket.ticketNo} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="phone" label={messages.ticket.phone}>
                    <Input placeholder={messages.ticket.phone} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="status" label={messages.ticket.currentStatus}>
                    <Select allowClear placeholder={messages.ticket.currentStatus} options={statusOptions} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="barcode" label={messages.ticket.barcode}>
                    <Input placeholder={messages.ticket.barcode} />
                  </Form.Item>
                </Col>
            {expand && (
              <>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="customerInboundTrackingNo" label={messages.ticket.trackingNo}>
                    <Input placeholder={messages.ticket.trackingNo} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="customerName" label={messages.ticket.customerName}>
                    <Input placeholder={messages.ticket.customerName} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="receivedAtRange" label={messages.ticket.createdAt}>
                    <DatePicker.RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="channel" label={messages.ticket.channel}>
                    <Input placeholder={messages.ticket.channel} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="estimatedOutboundDateRange" label={messages.ticket.estimatedOutboundDate}>
                    <DatePicker.RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="headOfficeInboundDateRange" label={messages.ticket.headOfficeInboundDate}>
                    <DatePicker.RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="email" label="邮箱">
                    <Input placeholder="输入邮箱" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="productName" label="产品名称">
                    <Input placeholder="输入产品名称" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="email" label={messages.ticket.email}>
                    <Input placeholder={messages.ticket.email} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="productName" label={messages.ticket.productName}>
                    <Input placeholder={messages.ticket.productName} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="paymentDateRange" label={messages.ticket.paymentDate}>
                    <DatePicker.RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="outboundMethod" label={messages.ticket.outboundMethod}>
                    <Input placeholder={messages.ticket.outboundMethod} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="outboundCompletedAtRange" label={messages.ticket.outboundCompletedAt}>
                    <DatePicker.RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="customerReturnAddress" label={messages.ticket.customerReturnAddress}>
                    <Input placeholder={messages.ticket.customerReturnAddress} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="factory1" label={messages.ticket.factory1}>
                    <Select allowClear options={factory1Options} placeholder={messages.ticket.factory1} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="isFrozenTicket" label={messages.ticket.isFrozenTicket}>
                    <Select allowClear placeholder={messages.ticket.isFrozenTicket}>
                      <Select.Option value="1">是</Select.Option>
                      <Select.Option value="0">否</Select.Option>
                    </Select>
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
        title="批量修改工单"
        open={batchEditVisible}
        onCancel={() => setBatchEditVisible(false)}
        onOk={() => {
          batchEditForm.validateFields().then((values) => {
            setSourceRows((prev) =>
              prev.map((row) => {
                if (selectedRowKeys.includes(String(row.id))) {
                  return {
                    ...row,
                    ...(values.status ? { status: values.status } : {}),
                    ...(values.repairEngineer ? { repairEngineer: values.repairEngineer } : {}),
                  }
                }
                return row
              })
            )
            setBatchEditVisible(false)
            setSelectedRowKeys([])
            batchEditForm.resetFields()
            message.success('批量修改成功')
          })
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <div style={{ color: '#64748B', marginBottom: 8, fontSize: 14 }}>
            已选工单ID（共 {selectedRowKeys.length} 个）
          </div>
          <div style={{ 
            border: '1px solid #E2E8F0', 
            backgroundColor: '#F8FAFC', 
            padding: '8px 12px', 
            borderRadius: 6,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            maxHeight: 120,
            overflowY: 'auto'
          }}>
            {sourceRows.filter(r => selectedRowKeys.includes(String(r.id))).map(ticket => (
              <Tag 
                key={String(ticket.id)} 
                closable 
                onClose={(e) => {
                  e.preventDefault();
                  const newKeys = selectedRowKeys.filter(k => k !== String(ticket.id));
                  setSelectedRowKeys(newKeys);
                  if (newKeys.length === 0) {
                    setBatchEditVisible(false);
                  }
                }}
                style={{ 
                  margin: 0, 
                  padding: '2px 8px', 
                  fontSize: 14, 
                  background: '#e0f2fe', 
                  color: '#0284c7', 
                  border: 'none', 
                  borderRadius: 4 
                }}
              >
                {String(ticket.ticketNo ?? '')}
              </Tag>
            ))}
          </div>
        </div>
        <Form form={batchEditForm} layout="vertical">
          <Form.Item name="status" label="状态">
            <Select allowClear placeholder="请选择状态" options={statusOptions} />
          </Form.Item>
          <Form.Item name="repairEngineer" label="服务工程师">
            <Select
              showSearch
              allowClear
              placeholder="请选择服务工程师"
              options={engineerOptions}
              filterOption={(input, option) => String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
