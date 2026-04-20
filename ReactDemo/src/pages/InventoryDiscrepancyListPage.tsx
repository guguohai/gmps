import {
  DownOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { ListPageToolbar } from '../components/ListPageToolbar'
import {
  discrepancyListMock,
  type DiscrepancyRow,
  type DiscrepancyStatus,
} from '../mocks/discrepancyMock'

const { Text } = Typography

const statusTagMap: Record<DiscrepancyStatus, { color: string; bg: string; text: string }> = {
  待确认: { color: '#64748b', bg: '#f1f5f9', text: '待确认' },
  处理中: { color: '#1d4ed8', bg: '#dbeafe', text: '处理中' },
  已完成: { color: '#15803d', bg: '#dcfce7', text: '已完成' },
}

export function InventoryDiscrepancyListPage() {
  const navigate = useNavigate()

  const columns: ColumnsType<DiscrepancyRow> = [
    {
      title: '差异单编号',
      dataIndex: 'diffNo',
      key: 'diffNo',
      width: 180,
      render: (v) => <a>{v}</a>,
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
      render: (v) => <a>{v}</a>,
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
        <a
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/inventory/discrepancy/${row.diffNo}`)
          }}
        >
          查看
        </a>
      ),
    },
  ]

  return (
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Space size={8}>
            <Text style={{ color: '#94a3b8', fontWeight: 600 }}>库存管理</Text>
            <Text style={{ color: '#cbd5e1' }}>/</Text>
            <Text style={{ color: '#475569', fontWeight: 600 }}>差异处理</Text>
          </Space>
        </Col>
        <Col>
          <ListPageToolbar pathname="/inventory/discrepancy" />
        </Col>
      </Row>

      <Card style={{ border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Form layout="vertical">
              <Row gutter={16} align="bottom">
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item label="差异单编号" style={{ marginBottom: 0 }}>
                    <Input placeholder="输入编号" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item label="差异来源" style={{ marginBottom: 0 }}>
                    <Select
                      options={[
                        { value: '全部', label: '全部' },
                        { value: 'SAP同步', label: 'SAP同步' },
                        { value: '盘点', label: '盘点' },
                        { value: '出库复核', label: '出库复核' },
                        { value: '入库复核', label: '入库复核' },
                        { value: '冻结校验', label: '冻结校验' },
                        { value: '人工发现', label: '人工发现' },
                      ]}
                      defaultValue="全部"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item label="处理状态" style={{ marginBottom: 0 }}>
                    <Select
                      options={[
                        { value: '全部', label: '全部' },
                        { value: '待确认', label: '待确认' },
                        { value: '处理中', label: '处理中' },
                        { value: '已完成', label: '已完成' },
                      ]}
                      defaultValue="全部"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item label="发现时间" style={{ marginBottom: 0 }}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              flexShrink: 0,
              paddingBottom: 1,
            }}
          >
            <Space size={8}>
              <Button type="primary" icon={<SearchOutlined />} />
              <Button icon={<DownOutlined />} />
            </Space>
          </div>
        </div>
      </Card>

      <Card
        style={{ border: '1px solid #f1f5f9' }}
        styles={{ body: { padding: 0 } }}
      >
        <Table
          rowKey="diffNo"
          columns={columns}
          dataSource={discrepancyListMock}
          scroll={{ x: 1980 }}
          pagination={{ total: 128, pageSize: 10, showSizeChanger: false }}
          onRow={(record) => ({
            style: { cursor: 'pointer' },
            onClick: () => navigate(`/inventory/discrepancy/${record.diffNo}`),
          })}
        />
      </Card>
    </Space>
  )
}
