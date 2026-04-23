import { DownOutlined, EyeOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Input, Row, Select, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListPageToolbar } from '../components/ListPageToolbar'
import { useI18n } from '../i18n/context'
import { getInventoryRecordList } from '../services/inventoryApi'
import type { ModuleRow } from '../types/module'

const PAGE_SIZE = 10

type FilterValues = {
  recordNo?: string
  sourceNo?: string
  recordType?: string
  productName?: string
  operatorName?: string
  productCode?: string
  location?: string
  action?: string
  sourceType?: string
  operateTimeRange?: [Dayjs, Dayjs]
  remark?: string
}

export function InventoryRecordListPage() {
  const navigate = useNavigate()
  const { messages } = useI18n()
  const [form] = Form.useForm()
  const initialDateRange: [Dayjs, Dayjs] = useMemo(() => [dayjs().subtract(5, 'year'), dayjs()], [])
  const [sourceRows, setSourceRows] = useState<ModuleRow[]>([])
  const [filters, setFilters] = useState<FilterValues>({ operateTimeRange: initialDateRange })
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [expand, setExpand] = useState(false)

  useEffect(() => {
    let cancelled = false
    getInventoryRecordList()
      .then((res) => {
        if (!cancelled && res.data) setSourceRows(res.data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const recordTypeOptions = useMemo(() => {
    return Array.from(new Set(sourceRows.map((row) => String(row.recordTime ?? '')).filter(Boolean)))
      .map((value) => ({ label: value, value }))
  }, [sourceRows])

  const productNameOptions = useMemo(() => {
    return Array.from(new Set(sourceRows.map((row) => String(row.productName ?? '')).filter(Boolean)))
      .map((value) => ({ label: value, value }))
  }, [sourceRows])

  const filteredRows = useMemo(() => {
    return sourceRows.filter((row) => {
      if (filters.recordNo && !String(row.recordNo ?? '').includes(filters.recordNo.trim())) return false
      if (filters.sourceNo && !String(row.sourceNo ?? '').includes(filters.sourceNo.trim())) return false
      if (filters.recordType && String(row.recordTime ?? '') !== filters.recordType) return false
      if (filters.productName && String(row.productName ?? '') !== filters.productName) return false
      if (filters.operatorName && !String(row.operatorName ?? '').includes(filters.operatorName.trim())) return false
      if (filters.productCode && !String(row.quantity ?? '').includes(filters.productCode.trim())) return false
      if (filters.location && !String(row.recordType ?? '').includes(filters.location.trim())) return false
      if (filters.action && String(row.action ?? '') !== filters.action) return false
      if (filters.sourceType && String(row.sourceType ?? '') !== filters.sourceType) return false
      if (filters.remark && !String(row.remark ?? '').includes(filters.remark.trim())) return false
      
      if (filters.operateTimeRange && filters.operateTimeRange.length === 2) {
        const [start, end] = filters.operateTimeRange
        const rowTime = dayjs(String(row.operateTime ?? ''))
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
    { title: '记录编号', dataIndex: 'recordNo', key: 'recordNo', width: 140 },
    { title: '记录类型', dataIndex: 'recordTime', key: 'recordTime', width: 140 },
    { title: '产品编码', dataIndex: 'quantity', key: 'quantity', width: 160 },
    { title: '产品名称', dataIndex: 'productName', key: 'productName', width: 220 },
    { title: '仓库/库位', dataIndex: 'recordType', key: 'recordType', width: 200 },
    { title: '变动数量', dataIndex: 'operator', key: 'operator', width: 120 },
    { title: '变动方向', dataIndex: 'action', key: 'action', width: 120 },
    { title: '前数量', dataIndex: 'beforeQty', key: 'beforeQty', width: 100 },
    { title: '后数量', dataIndex: 'afterQty', key: 'afterQty', width: 100 },
    { title: '来源类型', dataIndex: 'sourceType', key: 'sourceType', width: 120 },
    { title: '来源单号', dataIndex: 'sourceNo', key: 'sourceNo', width: 160 },
    { title: '操作时间', dataIndex: 'operateTime', key: 'operateTime', width: 180 },
    { title: '操作人', dataIndex: 'operatorName', key: 'operatorName', width: 120 },
    { title: '备注', dataIndex: 'remark', key: 'remark', width: 200 },
    {
      title: '操作',
      key: 'operation',
      width: 80,
      render: (_, row: ModuleRow) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={(event) => {
            event.stopPropagation()
            navigate('/inventory/record/' + String(row.id))
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
          <Breadcrumb items={[{ title: messages.navigation.inventory }, { title: messages.navigation.inventory_record }]} />
        </Col>
        <Col>
          <ListPageToolbar pathname="/inventory/record" />
        </Col>
      </Row>

      <Card style={{ border: '1px solid #f1f5f9' }}>
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleFilter} 
          className="app-filter-form"
          initialValues={{ operateTimeRange: initialDateRange }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="记录编号" name="recordNo">
                    <Input placeholder="请输入记录编号" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="记录类型" name="recordType">
                    <Select allowClear options={recordTypeOptions} placeholder="请选择记录类型" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="产品名称" name="productName">
                    <Select allowClear options={productNameOptions} placeholder="请选择产品名称" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="来源单号" name="sourceNo">
                    <Input placeholder="请输入来源单号" />
                  </Form.Item>
                </Col>
                {expand && (
                  <>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="操作人" name="operatorName">
                        <Input placeholder="请输入操作人" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="产品编码" name="productCode">
                        <Input placeholder="请输入产品编码" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="仓库/库位" name="location">
                        <Input placeholder="请输入仓库/库位" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="变动方向" name="action">
                        <Select allowClear placeholder="请选择变动方向">
                          <Select.Option value="入库">入库</Select.Option>
                          <Select.Option value="出库">出库</Select.Option>
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="来源类型" name="sourceType">
                        <Input placeholder="请输入来源类型" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="操作时间" name="operateTimeRange">
                        <DatePicker.RangePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="备注" name="remark">
                        <Input placeholder="请输入备注" />
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
