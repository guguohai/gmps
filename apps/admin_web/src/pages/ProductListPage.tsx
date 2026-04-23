import { DownOutlined, EditOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Input, Modal, Row, Select, Space, Table, Tag, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListPageToolbar } from '../components/ListPageToolbar'
import { useI18n } from '../i18n/context'
import { getProductList } from '../services/productApi'
import type { ModuleNestedRow, ModuleRow } from '../types/module'


const PAGE_SIZE = 10
const STOCKOUT_LABEL = '缺货'

type FilterValues = {
  productId?: string
  productName?: string
  category?: string
  factory1?: string
  launchDateRange?: [Dayjs, Dayjs]
  partWarranty?: string
  inventoryDist?: string
  available?: string
  barcode?: string
}

const toNumber = (value: string | number | undefined) => {
  if (typeof value === 'number') return value
  const normalized = String(value ?? '').replace(/,/g, '').trim()
  return Number(normalized) || 0
}

const getInventoryStatus = (value: string | number | undefined) =>
  toNumber(value) < 5 ? STOCKOUT_LABEL : '-'

function buildProductTreeRows(rows: ModuleRow[]): ModuleRow[] {
  return rows.map((row) => {
    const details = Array.isArray(row.warehouseDetails)
      ? (row.warehouseDetails as ModuleNestedRow[])
      : []

    const children: ModuleRow[] = details.map((detail) => ({
      id: String(detail.key ?? detail.warehouse ?? row.id),
      isWarehouseDetail: true,
      warehouseName: String(detail.warehouse ?? ''),
      warehouseLocation: String(detail.location ?? ''),
      productId: '',
      productName: '',
      category: '',
      factory1: '',
      factory2: '',
      factory3: '',
      launchDate: '',
      partWarranty: '',
      inventoryDist: String(detail.warehouse ?? ''),
      localTotal: String(detail.localTotal ?? ''),
      frozen: String(detail.frozen ?? ''),
      transfer: String(detail.transfer ?? ''),
      available: String(detail.available ?? ''),
      stockStatus: getInventoryStatus(detail.available as string | number | undefined),
    }))

    return {
      ...row,
      children,
    }
  })
}

export function ProductListPage() {
  const navigate = useNavigate()
  const { messages } = useI18n()
  const initialDateRange: [Dayjs, Dayjs] = useMemo(() => [dayjs().subtract(5, 'year'), dayjs()], [])
  const [form] = Form.useForm()
  const [sourceRows, setSourceRows] = useState<ModuleRow[]>([])
  const [filters, setFilters] = useState<FilterValues>({ launchDateRange: initialDateRange })
  const [loading, setLoading] = useState(true)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [expand, setExpand] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editForm] = Form.useForm()

  useEffect(() => {
    let cancelled = false
    getProductList()
      .then((res) => {
        if (!cancelled && res.data) setSourceRows(res.data)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const categoryOptions = useMemo(() => {
    return Array.from(new Set(sourceRows.map((row) => String(row.category ?? '')).filter(Boolean)))
      .map((value) => ({ label: value, value }))
  }, [sourceRows])

  const factory1Options = useMemo(() => {
    return Array.from(new Set(sourceRows.map((row) => String(row.factory1 ?? '')).filter(Boolean)))
      .map((value) => ({ label: value, value }))
  }, [sourceRows])

  const inventoryDistOptions = useMemo(() => {
    return Array.from(new Set(sourceRows.map((row) => String(row.inventoryDist ?? '')).filter(Boolean)))
      .map((value) => ({ label: value, value }))
  }, [sourceRows])

  const filteredRows = useMemo(() => {
    return sourceRows.filter((row) => {
      if (filters.productId && !String(row.productId ?? '').includes(filters.productId.trim())) return false
      if (filters.productName && !String(row.productName ?? '').includes(filters.productName.trim())) return false
      if (filters.category && String(row.category ?? '') !== filters.category) return false
      if (filters.factory1 && String(row.factory1 ?? '') !== filters.factory1) return false
      if (filters.barcode && !String(row.barcode ?? '').includes(filters.barcode.trim())) return false
      if (filters.partWarranty && !String(row.partWarranty ?? '').includes(filters.partWarranty.trim())) return false
      if (filters.inventoryDist && String(row.inventoryDist ?? '') !== filters.inventoryDist) return false
      if (filters.available && !String(row.available ?? '').includes(filters.available.trim())) return false
      if (filters.launchDateRange && filters.launchDateRange.length === 2) {
        const rowTime = dayjs(String(row.launchDate ?? ''))
        const [start, end] = filters.launchDateRange
        if (!rowTime.isValid() || rowTime.isBefore(start.startOf('day')) || rowTime.isAfter(end.endOf('day'))) {
          return false
        }
      }
      return true
    })
  }, [filters, sourceRows])

  const dataSource = useMemo(() => {
    const treeRows = buildProductTreeRows(filteredRows)
    const start = (currentPage - 1) * PAGE_SIZE
    return treeRows.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredRows])

  const columns = useMemo<ColumnsType<ModuleRow>>(() => [
    {
      title: '产品ID',
      dataIndex: 'productId',
      key: 'productId',
      width: 140,
    },
    { title: '产品名称', dataIndex: 'productName', key: 'productName', width: 220 },
    { title: '类别', dataIndex: 'category', key: 'category', width: 180 },
    { title: '工厂1', dataIndex: 'factory1', key: 'factory1', width: 140 },
    { title: '工厂2', dataIndex: 'factory2', key: 'factory2', width: 140 },
    { title: '工厂3', dataIndex: 'factory3', key: 'factory3', width: 140 },
    { title: '上市日期', dataIndex: 'launchDate', key: 'launchDate', width: 140 },
    { title: '零件保有年限', dataIndex: 'partWarranty', key: 'partWarranty', width: 160 },
    {
      title: '库存分布',
      dataIndex: 'inventoryDist',
      key: 'inventoryDist',
      width: 180,
      render: (value: unknown, row: ModuleRow) => {
        if (row.isWarehouseDetail === true) {
          const warehouseName = String(row.warehouseName ?? '')
          const warehouseLocation = String(row.warehouseLocation ?? '')
          return `${warehouseName}，${warehouseLocation}`
        }
        return String(value ?? '')
      },
    },
    { title: '本地总库存', dataIndex: 'localTotal', key: 'localTotal', width: 130 },
    { title: '冻结库存', dataIndex: 'frozen', key: 'frozen', width: 120 },
    { title: '调拨中', dataIndex: 'transfer', key: 'transfer', width: 100 },
    { title: '可用库存', dataIndex: 'available', key: 'available', width: 120 },
    {
      title: '安全库存状态',
      dataIndex: 'stockStatus',
      key: 'stockStatus',
      width: 120,
      render: (_: unknown, row: ModuleRow) => {
        const inventoryStatus = getInventoryStatus(row.available as string | number | undefined)
        return inventoryStatus === STOCKOUT_LABEL ? <Tag color="error">{inventoryStatus}</Tag> : inventoryStatus
      },
    },
    {
      title: '操作',
      key: 'operation',
      width: 88,
      render: (_, row: ModuleRow) =>
        row.isWarehouseDetail === true ? null : (
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={(event) => {
              event.stopPropagation()
              navigate('/product/list/' + String(row.id))
            }}
          />
        ),
    },
  ], [navigate])

  const rowSelection = useMemo(() => ({
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys.map(String)),
    getCheckboxProps: (record: ModuleRow) => ({
      disabled: record.isWarehouseDetail === true,
    }),
    renderCell: (_checked: boolean, record: ModuleRow, _index: number, originNode: React.ReactNode) =>
      record.isWarehouseDetail ? null : originNode,
  }), [selectedRowKeys])

  const handleFilter = (values: FilterValues) => {
    setFilters(values)
    setCurrentPage(1)
  }

  const handleToolbarAction = (key: string) => {
    if (key === 'edit') {
      const initialProductIds = sourceRows
        .filter(r => selectedRowKeys.includes(String(r.id)))
        .map(r => String(r.productId ?? ''))
        .filter(Boolean)

      editForm.setFieldsValue({
        productIds: initialProductIds,
        outboundPurpose: undefined
      })
      setEditModalVisible(true)
    }
  }

  if (loading) return <Card loading style={{ margin: 16 }} />

  return (
    <div className="app-page-stack">
      <Row className="app-sticky-page-bar" justify="space-between" align="middle">
        <Col>
          <Breadcrumb items={[{ title: messages.navigation.product }, { title: messages.navigation.product_list }]} />
        </Col>
        <Col>
          <ListPageToolbar pathname="/product/list" onAction={handleToolbarAction} />
        </Col>
      </Row>

      <Card style={{ border: '1px solid #f1f5f9' }}>
        <Form 
          form={form} 
          layout="vertical" 
          onFinish={handleFilter}
          initialValues={{ launchDateRange: initialDateRange }}
          className="app-filter-form"
        >
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <Row gutter={16}>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="产品ID" name="productId">
                    <Input placeholder="输入产品ID" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="产品名称" name="productName">
                    <Input placeholder="输入产品名称" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="类别" name="category">
                    <Select allowClear options={categoryOptions} placeholder="请选择类别" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={6}>
                  <Form.Item label="条形码" name="barcode">
                    <Input placeholder="输入条形码" />
                  </Form.Item>
                </Col>

                {expand && (
                  <>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="生产工厂" name="factory1">
                        <Select allowClear options={factory1Options} placeholder="请选择生产工厂" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="上市日期" name="launchDateRange">
                        <DatePicker.RangePicker style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="零件保有期限" name="partWarranty">
                        <Input placeholder="输入期限" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="库存仓" name="inventoryDist">
                        <Select allowClear options={inventoryDistOptions} placeholder="请选择库存仓" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={8} lg={6}>
                      <Form.Item label="可用库存" name="available">
                        <Input placeholder="输入可用库存" />
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
          expandable={{
            rowExpandable: (record) => Array.isArray(record.children) && record.children.length > 0,
          }}
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

      <Modal
        title="产品出库处理"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => {
          editForm.validateFields().then((values) => {
            console.log('提交的数据:', values)
            message.success('出库处理成功')
            setEditModalVisible(false)
            setSelectedRowKeys([])
            editForm.resetFields()
          })
        }}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item
            label="已选产品"
            name="productIds"
            rules={[{ required: true, message: '请至少选择或输入一个产品' }]}
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="选择或输入产品"
              tokenSeparators={[',', ' ']}
            />
          </Form.Item>
          <Form.Item
            label="出库目的"
            name="outboundPurpose"
            rules={[{ required: true, message: '请选择出库目的' }]}
          >
            <Select placeholder="请选择出库目的">
              <option value="维修更换">维修更换</option>
              <option value="产品交换">产品交换</option>
              <option value="更换其他产品">更换其他产品</option>
              <option value="3PL处理">3PL处理</option>
              <option value="合作厂家处理">合作厂家处理</option>
              <option value="其他">其他</option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div >
  )
}
