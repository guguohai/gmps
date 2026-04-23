import { DownOutlined, EditOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Input, Row, Select, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListPageToolbar } from '../components/ListPageToolbar'
import { getConsultationList } from '../services/consultationApi'
import type { ConsultationRow } from '../types/consultation'

const PAGE_SIZE = 10

type ConsultationFilterValues = {
  itemType?: string
  status?: string
  handler?: string
  productBarcode?: string
  itemNo?: string
  consultDateRange?: [Dayjs, Dayjs]
}

const ITEM_TYPE_OPTIONS = ['一般咨询', '客户确认']
const STATUS_OPTIONS = ['等待中', '已发送', '待客户确认', '客户已回复', '已完成']
const HANDLER_OPTIONS = ['赵师傅', '张经理', '李工程师']

function ConsultationListPage() {
  const navigate = useNavigate()
  const [filterForm] = Form.useForm()
  const initialDateRange: [Dayjs, Dayjs] = useMemo(() => [dayjs().subtract(5, 'year'), dayjs()], [])
  const [sourceRows, setSourceRows] = useState<ConsultationRow[]>([])
  const [filters, setFilters] = useState<ConsultationFilterValues>({ consultDateRange: initialDateRange })
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [expand, setExpand] = useState(false)

  useEffect(() => {
    let cancelled = false
    getConsultationList()
      .then((rows) => {
        if (!cancelled) {
          setSourceRows(rows)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const filteredRows = useMemo(() => {
    return sourceRows.filter((row) => {
      if (filters.itemType && row.itemType !== filters.itemType) return false
      if (filters.status && row.status !== filters.status) return false
      if (filters.handler && row.handler !== filters.handler) return false
      if (filters.productBarcode && !String(row.productBarcode).includes(filters.productBarcode.trim())) return false
      if (filters.itemNo && !String(row.itemNo).includes(filters.itemNo.trim())) return false
      if (filters.consultDateRange && filters.consultDateRange.length === 2) {
        const consultDate = dayjs(row.consultDate)
        const [start, end] = filters.consultDateRange
        if (!consultDate.isValid() || consultDate.isBefore(start.startOf('day')) || consultDate.isAfter(end.endOf('day'))) {
          return false
        }
      }
      return true
    })
  }, [sourceRows, filters])

  const dataSource = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    return filteredRows.slice(start, end)
  }, [currentPage, filteredRows])

  const columns = useMemo<ColumnsType<ConsultationRow>>(() => {
    return [
      {
        title: '工单编号',
        dataIndex: 'ticketNo',
        key: 'ticketNo',
        width: 140,
        render: (value: unknown) => {
          const str = String(value ?? '').trim()
          return (
            <a onClick={(event) => { event.stopPropagation(); navigate(`/ticket/list/${str}`) }}>
              {str}
            </a>
          )
        },
      },
      { title: '事项编号', dataIndex: 'itemNo', key: 'itemNo', width: 160 },
      { title: '事项类型', dataIndex: 'itemType', key: 'itemType', width: 120 },
      { title: '事项主题', dataIndex: 'subject', key: 'subject', width: 220 },
      { title: '咨询渠道', dataIndex: 'channel', key: 'channel', width: 120 },
      { title: '咨询日期', dataIndex: 'consultDate', key: 'consultDate', width: 170 },
      { title: '负责人', dataIndex: 'handler', key: 'handler', width: 120 },
      { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
      { title: '客户确认结果', dataIndex: 'confirmResult', key: 'confirmResult', width: 140 },
      {
        title: '操作',
        key: 'action',
        width: 130,
        render: (_value: unknown, row: ConsultationRow) => (
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={(event) => {
              event.stopPropagation()
              navigate(`/service/consultation/${row.id}`)
            }}
          />
        ),
      },
    ]
  }, [navigate])

  const handleFilterSubmit = (values: ConsultationFilterValues) => {
    setFilters(values)
    setCurrentPage(1)
  }

  return (
    <div className="app-page-stack">
      <Row className="app-sticky-page-bar" justify="space-between" align="middle">
        <Col>
          <Breadcrumb items={[{ title: '服务管理' }, { title: '咨询列表' }]} />
        </Col>
        <Col>
          <ListPageToolbar pathname="/service/consultation" />
        </Col>
      </Row>

      <Card style={{ border: '1px solid #f1f5f9' }}>
        <Form 
          form={filterForm} 
          layout="vertical" 
          onFinish={handleFilterSubmit}
          initialValues={{ consultDateRange: initialDateRange }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="itemType" label="事项类型">
                    <Select
                      allowClear
                      placeholder="请选择事项类型"
                      options={ITEM_TYPE_OPTIONS.map((item) => ({ label: item, value: item }))}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="status" label="事项状态">
                    <Select
                      allowClear
                      placeholder="请选择事项状态"
                      options={STATUS_OPTIONS.map((item) => ({ label: item, value: item }))}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item name="handler" label="负责人">
                    <Select
                      allowClear
                      placeholder="请选择负责人"
                      options={HANDLER_OPTIONS.map((item) => ({ label: item, value: item }))}
                    />
                  </Form.Item>
                </Col>

                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item name="itemNo" label="事项编号">
                        <Input placeholder="请输入事项编号" />
                      </Form.Item>
                    </Col>
                
                {expand && (
                  <>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item name="productBarcode" label="产品条码">
                        <Input placeholder="请输入产品条码" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item name="consultDateRange" label="咨询日期">
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
          scroll={{ x: 1400 }}
          pagination={{
            current: currentPage,
            total: filteredRows.length,
            pageSize: PAGE_SIZE,
            showSizeChanger: false,
            onChange: setCurrentPage,
          }}
          onRow={() => ({
            style: { cursor: 'pointer' },
          })}
        />
      </Card>
    </div>
  )
}

export { ConsultationListPage }
export default ConsultationListPage
