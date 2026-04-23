import { DownOutlined, EditOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Input, Row, Select, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListPageToolbar } from '../components/ListPageToolbar'
import { useI18n } from '../i18n/context'
import { getDiscrepancyList } from '../services/inventoryApi'
import type { DiscrepancyRow, DiscrepancyStatus } from '../types/discrepancy'

const { Text } = Typography

const statusTagMap: Record<DiscrepancyStatus, { color: string; bg: string; text: string }> = {
  待确认: { color: '#64748b', bg: '#f1f5f9', text: '待确认' },
  处理中: { color: '#1d4ed8', bg: '#dbeafe', text: '处理中' },
  已完成: { color: '#15803d', bg: '#dcfce7', text: '已完成' },
}

type FilterValues = {
  diffNo?: string
  source?: string
  status?: string
  productCode?: string
  productName?: string
  location?: string
  foundAtRange?: [dayjs.Dayjs, dayjs.Dayjs]
}

export function InventoryDiscrepancyListPage() {
  const navigate = useNavigate()
  const { messages } = useI18n()
  const [form] = Form.useForm()
  const initialDateRange: [dayjs.Dayjs, dayjs.Dayjs] = useMemo(() => [dayjs().subtract(5, 'year'), dayjs()], [])
  const [sourceRows, setSourceRows] = useState<DiscrepancyRow[]>([])
  const [filters, setFilters] = useState<FilterValues>({ foundAtRange: initialDateRange })
  const [expand, setExpand] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  useEffect(() => {
    getDiscrepancyList()
      .then((res) => {
        if (res.data) setSourceRows(res.data as DiscrepancyRow[])
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredRows = useMemo(() => {
    return sourceRows.filter((row) => {
      if (filters.diffNo && !String(row.diffNo ?? '').includes(filters.diffNo.trim())) return false
      if (filters.source && filters.source !== '全部' && String(row.source ?? '') !== filters.source) return false
      if (filters.status && filters.status !== '全部' && String(row.status ?? '') !== filters.status) return false
      if (filters.productCode && !String(row.productCode ?? '').includes(filters.productCode.trim())) return false
      if (filters.productName && !String(row.productName ?? '').includes(filters.productName.trim())) return false
      if (filters.location && !String(row.location ?? '').includes(filters.location.trim())) return false
      
      if (filters.foundAtRange && filters.foundAtRange.length === 2) {
        const [start, end] = filters.foundAtRange
        const rowTime = dayjs(String(row.foundAt ?? ''))
        if (!rowTime.isValid() || rowTime.isBefore(start.startOf('day')) || rowTime.isAfter(end.endOf('day'))) {
          return false
        }
      }
      
      return true
    })
  }, [filters, sourceRows])

  const handleFilter = (values: FilterValues) => {
    setFilters(values)
  }

  const columns: ColumnsType<DiscrepancyRow> = [
    {
      title: '差异单编号',
      dataIndex: 'diffNo',
      key: 'diffNo',
      width: 180,
    },
    { title: '差异来源', dataIndex: 'source', key: 'source', width: 120 },
    { title: '产品编码', dataIndex: 'productCode', key: 'productCode', width: 140 },
    { title: '产品名称', dataIndex: 'productName', key: 'productName', width: 220 },
    { title: '仓库/位置', dataIndex: 'location', key: 'location', width: 150 },
    { title: 'SAP数量', dataIndex: 'sapQty', key: 'sapQty', width: 100, align: 'center' },
    { title: 'PS数量', dataIndex: 'psQty', key: 'psQty', width: 100, align: 'center' },
    {
      title: '差异数量',
      dataIndex: 'diffQty',
      key: 'diffQty',
      width: 110,
      align: 'center',
      render: (v) => <Text style={{ color: '#dc2626', fontWeight: 600 }}>{v}</Text>,
    },
    { title: '差异原因', dataIndex: 'reason', key: 'reason', width: 120 },
    { title: '处理方式', dataIndex: 'handling', key: 'handling', width: 140 },
    {
      title: '结果单号',
      dataIndex: 'resultNo',
      key: 'resultNo',
      width: 160,
    },
    {
      title: '处理状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (v: DiscrepancyStatus) => {
        const tag = statusTagMap[v]
        return <Tag style={{ border: 'none', background: tag.bg, color: tag.color }}>{tag.text}</Tag>
      },
    },
    { title: '发现时间', dataIndex: 'foundAt', key: 'foundAt', width: 180 },
    { title: '处理人', dataIndex: 'handler', key: 'handler', width: 100 },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      align: 'center',
      render: (_, row) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/inventory/discrepancy/${row.diffNo}`)
          }}
        />
      ),
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  }

  return (
    <div className="app-page-stack">
      <Row className="app-sticky-page-bar" justify="space-between" align="middle">
        <Col>
          <Breadcrumb items={[{ title: messages.navigation.inventory }, { title: messages.navigation.inventory_diff }]} />
        </Col>
        <Col>
          <ListPageToolbar pathname="/inventory/discrepancy" />
        </Col>
      </Row>

      <Card style={{ border: '1px solid #f1f5f9' }}>
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleFilter} 
          className="app-filter-form"
          initialValues={{ foundAtRange: initialDateRange }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="差异单编号" name="diffNo">
                    <Input placeholder="请输入编号" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="差异来源" name="source">
                    <Select
                      allowClear
                      placeholder="请选择来源"
                      options={[
                        { value: '全部', label: '全部' },
                        { value: 'SAP同步', label: 'SAP同步' },
                        { value: '盘点', label: '盘点' },
                        { value: '出库复核', label: '出库复核' },
                        { value: '入库复核', label: '入库复核' },
                        { value: '冻结校验', label: '冻结校验' },
                        { value: '人工发现', label: '人工发现' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="处理状态" name="status">
                    <Select
                      allowClear
                      placeholder="请选择状态"
                      options={[
                        { value: '全部', label: '全部' },
                        { value: '待确认', label: '待确认' },
                        { value: '处理中', label: '处理中' },
                        { value: '已完成', label: '已完成' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="发现时间" name="foundAtRange">
                    <DatePicker.RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                {expand && (
                  <>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="产品编码" name="productCode">
                        <Input placeholder="请输入产品编码" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="产品名称" name="productName">
                        <Input placeholder="请输入产品名称" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="仓库/位置" name="location">
                        <Input placeholder="请输入仓库/位置" />
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

      <Card
        style={{ border: '1px solid #f1f5f9' }}
        styles={{ body: { padding: 0 } }}
      >
        <Table
          rowKey="diffNo"
          columns={columns}
          dataSource={filteredRows}
          loading={loading}
          rowSelection={rowSelection}
          scroll={{ x: 1980 }}
          pagination={{ total: filteredRows.length, pageSize: 10, showSizeChanger: false }}
        />
      </Card>
    </div>
  )
}
