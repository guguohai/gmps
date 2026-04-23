import { EyeOutlined, SearchOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Row, Select, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListPageToolbar } from '../components/ListPageToolbar'
import { useI18n } from '../i18n/context'
import { getInventorySyncList } from '../services/inventoryApi'
import type { ModuleRow } from '../types/module'

const PAGE_SIZE = 10

type FilterValues = {
  status?: string
  syncType?: string
  syncTarget?: string
  startTimeRange?: [Dayjs, Dayjs]
}

export function InventorySyncListPage() {
  const navigate = useNavigate()
  const { messages } = useI18n()
  const [form] = Form.useForm()
  const initialDateRange: [Dayjs, Dayjs] = useMemo(() => [dayjs().subtract(5, 'year'), dayjs()], [])
  const [sourceRows, setSourceRows] = useState<ModuleRow[]>([])
  const [filters, setFilters] = useState<FilterValues>({ startTimeRange: initialDateRange })
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let cancelled = false
    getInventorySyncList()
      .then((res) => {
        if (!cancelled && res.data) setSourceRows(res.data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const syncTypeOptions = useMemo(() => {
    return Array.from(new Set(sourceRows.map((row) => String(row.syncType ?? '')).filter(Boolean)))
      .map((value) => ({ label: value, value }))
  }, [sourceRows])

  const statusOptions = useMemo(() => {
    return Array.from(new Set(sourceRows.map((row) => String(row.status ?? '')).filter(Boolean)))
      .map((value) => ({ label: value, value }))
  }, [sourceRows])

  const syncTargetOptions = useMemo(() => {
    return Array.from(new Set(sourceRows.map((row) => String(row.syncTarget ?? '')).filter(Boolean)))
      .map((value) => ({ label: value, value }))
  }, [sourceRows])

  const filteredRows = useMemo(() => {
    return sourceRows.filter((row) => {
      if (filters.status && String(row.status ?? '') !== filters.status) return false
      if (filters.syncType && String(row.syncType ?? '') !== filters.syncType) return false
      if (filters.syncTarget && String(row.syncTarget ?? '') !== filters.syncTarget) return false
      if (filters.startTimeRange && filters.startTimeRange.length === 2) {
        const rowTime = dayjs(String(row.startTime ?? ''))
        const [start, end] = filters.startTimeRange
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
      title: '批次号',
      dataIndex: 'batchNo',
      key: 'batchNo',
      width: 140,
    },
    { title: '同步对象', dataIndex: 'syncTarget', key: 'syncTarget', width: 180 },
    { title: '同步类型', dataIndex: 'syncType', key: 'syncType', width: 140 },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime', width: 180 },
    { title: '结束时间', dataIndex: 'endTime', key: 'endTime', width: 180 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (value: unknown) => <Tag>{String(value ?? '')}</Tag>,
    },
    { title: '成功数', dataIndex: 'successCount', key: 'successCount', width: 100 },
    { title: '失败数', dataIndex: 'failCount', key: 'failCount', width: 100 },
    { title: '差异数', dataIndex: 'diffCount', key: 'diffCount', width: 100 },
    { title: '触发方式', dataIndex: 'triggerMethod', key: 'triggerMethod', width: 140 },
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
            navigate('/inventory/sync/' + String(row.id))
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
          <Breadcrumb items={[{ title: messages.navigation.inventory }, { title: messages.navigation.inventory_sync }]} />
        </Col>
        <Col>
          <ListPageToolbar pathname="/inventory/sync" />
        </Col>
      </Row>

      <Card style={{ border: '1px solid #f1f5f9' }}>
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleFilter} 
          className="app-filter-form"
          initialValues={{ startTimeRange: initialDateRange }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="状态" name="status">
                    <Select allowClear options={statusOptions} placeholder="请选择状态" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="同步类型" name="syncType">
                    <Select allowClear options={syncTypeOptions} placeholder="请选择同步类型" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="同步对象" name="syncTarget">
                    <Select allowClear options={syncTargetOptions} placeholder="请选择同步对象" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="开始时间" name="startTimeRange">
                    <DatePicker.RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            </div>
            <div style={{ marginLeft: 16, marginTop: 30 }}>
              <Space>
                <Button icon={<SearchOutlined />} type="primary" htmlType="submit" />
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
        />
      </Card>
    </div>
  )
}
