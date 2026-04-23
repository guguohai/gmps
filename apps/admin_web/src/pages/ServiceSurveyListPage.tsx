import { DownOutlined, EditOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Input, Row, Select, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListPageToolbar } from '../components/ListPageToolbar'
import { getServiceSurveyList } from '../services/serviceApi'
import type { ModuleRow } from '../types/module'

const PAGE_SIZE = 10
const STATUS_LABEL_MAP: Record<string, string> = { PENDING: '待填写', SUBMITTED: '已提交', EXPIRED: '已过期', INVALID: '已失效' }
const STATUS_TONE_MAP: Record<string, string> = { PENDING: 'default', SUBMITTED: 'success', EXPIRED: 'warning', INVALID: 'error' }

type FilterValues = {
  keyword?: string
  customerName?: string
  status?: string
  phone?: string
  productModel?: string
  purchasePlace?: string
  complaintReason?: string
  deadlineRange?: [Dayjs, Dayjs]
}

const getStatusCode = (status: string) => status
const getStatusLabel = (status: string) => STATUS_LABEL_MAP[getStatusCode(status)] ?? status

export function ServiceSurveyListPage() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const initialDateRange: [Dayjs, Dayjs] = useMemo(() => [dayjs().subtract(5, 'year'), dayjs()], [])
  const [sourceRows, setSourceRows] = useState<ModuleRow[]>([])
  const [filters, setFilters] = useState<FilterValues>({ deadlineRange: initialDateRange })
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [expand, setExpand] = useState(false)

  useEffect(() => {
    let cancelled = false
    getServiceSurveyList()
      .then((res) => { if (!cancelled && res.data) setSourceRows(res.data) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const statusOptions = useMemo(() => {
    return Array.from(new Set(sourceRows.map((row) => String(row.status ?? '')).filter(Boolean))).map((value) => ({
      label: getStatusLabel(value),
      value,
    }))
  }, [sourceRows])

  const purchasePlaceOptions = useMemo(() => [
    { label: '线上商城', value: '线上商城' },
    { label: '门店', value: '门店' },
    { label: '经销商', value: '经销商' },
  ], [])

  const complaintReasonOptions = useMemo(() => [
    { label: '镜片问题', value: '镜片问题' },
    { label: '镜框问题', value: '镜框问题' },
    { label: '配送问题', value: '配送问题' },
    { label: '服务态度', value: '服务态度' },
    { label: '其他', value: '其他' },
  ], [])

  const filteredRows = useMemo(() => sourceRows.filter((row) => {
    if (filters.keyword) {
      const kw = filters.keyword.trim().toLowerCase()
      const matchTicket = String(row.ticketNo ?? '').toLowerCase().includes(kw)
      const matchSurvey = String(row.surveyNo ?? '').toLowerCase().includes(kw)
      const matchTitle = String(row.title ?? '').toLowerCase().includes(kw)
      if (!matchTicket && !matchSurvey && !matchTitle) return false
    }
    if (filters.customerName && !String(row.customerName ?? '').includes(filters.customerName.trim())) return false
    if (filters.phone && !String(row.phone ?? '').includes(filters.phone.trim())) return false
    if (filters.productModel && !String(row.productModel ?? '').includes(filters.productModel.trim())) return false
    if (filters.purchasePlace && String(row.purchasePlace ?? '') !== filters.purchasePlace) return false
    if (filters.complaintReason && String(row.complaintReason ?? '') !== filters.complaintReason) return false
    if (filters.status && String(row.status ?? '') !== filters.status) return false
    if (filters.deadlineRange && filters.deadlineRange.length === 2) {
      const rowTime = dayjs(String(row.deadline ?? ''))
      const [start, end] = filters.deadlineRange
      if (!rowTime.isValid() || rowTime.isBefore(start.startOf('day')) || rowTime.isAfter(end.endOf('day'))) {
        return false
      }
    }
    return true
  }), [filters, sourceRows])

  const dataSource = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredRows.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredRows])

  const columns = useMemo<ColumnsType<ModuleRow>>(() => [
    { title: '工单编号', dataIndex: 'ticketNo', key: 'ticketNo', width: 140 },
    { title: '问卷编号', dataIndex: 'surveyNo', key: 'surveyNo', width: 160 },
    { title: '标题', dataIndex: 'title', key: 'title', width: 220 },
    { title: '客户姓名', dataIndex: 'customerName', key: 'customerName', width: 140 },
    { title: '电话', dataIndex: 'phone', key: 'phone', width: 160 },
    { title: '产品型号', dataIndex: 'productModel', key: 'productModel', width: 180 },
    { title: '购买地', dataIndex: 'purchasePlace', key: 'purchasePlace', width: 140 },
    { title: '投诉原因', dataIndex: 'complaintReason', key: 'complaintReason', width: 180 },
    { title: '截止时间', dataIndex: 'deadline', key: 'deadline', width: 180 },
    {
      title: '问卷状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (value: unknown) => {
        const code = String(value ?? '')
        return <Tag color={STATUS_TONE_MAP[code] ?? 'default'}>{getStatusLabel(code)}</Tag>
      },
    },
    {
      title: '操作',
      key: 'operation',
      width: 120,
      render: (_, row: ModuleRow) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={(event) => {
            event.stopPropagation()
            navigate('/service/survey/' + String(row.id))
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
        <Col><Breadcrumb items={[{ title: '服务管理' }, { title: '问卷列表' }]} /></Col>
        <Col><ListPageToolbar pathname="/service/survey" /></Col>
      </Row>

      <Card style={{ border: '1px solid #f1f5f9' }}>
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleFilter}
          initialValues={{ deadlineRange: initialDateRange }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="关键字" name="keyword">
                    <Input placeholder="编号/标题" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="客户姓名" name="customerName">
                    <Input placeholder="输入客户姓名" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="状态" name="status">
                    <Select allowClear placeholder="请选择状态" options={statusOptions} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="电话" name="phone">
                    <Input placeholder="输入电话" />
                  </Form.Item>
                </Col>
                
                {expand && (
                  <>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="产品型号" name="productModel">
                        <Input placeholder="输入产品型号" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="购买地" name="purchasePlace">
                        <Select allowClear placeholder="请选择" options={purchasePlaceOptions} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="投诉原因" name="complaintReason">
                        <Select allowClear placeholder="请选择" options={complaintReasonOptions} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="截止日期" name="deadlineRange">
                        <DatePicker.RangePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                  </>
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
          scroll={{ x: 1800 }}
          pagination={{ current: currentPage, total: filteredRows.length, pageSize: PAGE_SIZE, showSizeChanger: false, onChange: setCurrentPage }}
          onRow={() => ({ style: { cursor: 'pointer' } })}
        />
      </Card>
    </div>
  )
}
