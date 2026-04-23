import {
  Breadcrumb,
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Table,
} from 'antd'
import dayjs from 'dayjs'
import type { ColumnsType } from 'antd/es/table'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { discrepancyDetailMock, discrepancyListMock } from '../mocks/data/discrepancy'
import { getDiscrepancyLogs } from '../services/discrepancyApi'
import { useI18n } from '../i18n/context'
import { getNavigationBreadcrumbLabels } from '../utils/navigationI18n'
import type { DiscrepancyLogRow } from '../types/discrepancy'
import { useEffect, useState } from 'react'

const { TextArea } = Input

const parseDateValue = (value: string) => {
  if (!value) return undefined

  const normalized = value.includes('T') ? value : value.replace(' ', 'T')
  const parsed = dayjs(normalized)
  return parsed.isValid() ? parsed : undefined
}

export function InventoryDiscrepancyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { messages } = useI18n()
  const [parentBreadcrumbLabel, currentBreadcrumbLabel] = getNavigationBreadcrumbLabels(messages, '/inventory/discrepancy', [
    '库存管理',
    '差异处理',
  ])
  const current = discrepancyListMock.find((item) => item.diffNo === id) ?? discrepancyListMock[0]
  const detail = current?.diffNo === discrepancyDetailMock.diffNo
    ? discrepancyDetailMock
    : {
      ...discrepancyDetailMock,
      diffNo: current.diffNo,
      source: current.source,
      sourceNo: current.sourceNo,
      productCode: current.productCode,
      productName: current.productName,
      location: current.location,
      sapQty: current.sapQty,
      psQty: current.psQty,
      diffQty: current.diffQty,
      reason: current.reason,
      handling: current.handling,
      resultNo: current.resultNo,
      resultStatus: current.resultStatus,
      status: current.status,
      foundAt: current.foundAt.slice(0, 16).replace(' ', 'T'),
      handler: current.handler,
      handleAt: current.updatedAt.slice(0, 16).replace(' ', 'T'),
    }

  const [logData, setLogData] = useState<DiscrepancyLogRow[]>([])

  useEffect(() => {
    getDiscrepancyLogs().then(setLogData)
  }, [])

  const logColumns: ColumnsType<DiscrepancyLogRow> = [
    { title: '操作时间', dataIndex: 'time', key: 'time', width: 180 },
    { title: '操作人', dataIndex: 'operator', key: 'operator', width: 100 },
    { title: '操作类型', dataIndex: 'action', key: 'action', width: 120 },
    { title: '操作前状态', dataIndex: 'from', key: 'from', width: 120 },
    { title: '操作后状态', dataIndex: 'to', key: 'to', width: 120 },
    { title: '操作说明', dataIndex: 'desc', key: 'desc' },
  ]

  return (
    <div className="app-page-stack">
      <Row className="app-sticky-page-bar" justify="space-between" align="middle">
        <Col>
          <Breadcrumb
            items={[
              { title: parentBreadcrumbLabel },
              { title: <Link to="/inventory/discrepancy">{currentBreadcrumbLabel}</Link> },
              { title: messages.inventoryDiscrepancy.detail },
            ]}
          />
        </Col>
        <Col>
          <Space>
            <Button onClick={() => navigate('/inventory/discrepancy')}>返回</Button>
            <Button type="primary">保存</Button>
          </Space>
        </Col>
      </Row>

      <Card title="差异信息">
        <Form layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="差异单编号">
                <span>{detail.diffNo}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="差异来源">
                <span>{detail.source}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="产品名称">
                <span>{detail.productName}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="产品编码">
                <span>{detail.productCode}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="仓库/位置">
                <span>{detail.location}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="发现时间">
                <span>{detail.foundAt}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="SAP数量">
                <span>{detail.sapQty}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="PS数量">
                <span>{detail.psQty}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="差异数量">
                <span style={{ color: detail.diffQty > 0 ? '#ff4d4f' : undefined, fontWeight: detail.diffQty > 0 ? 600 : undefined }}>
                  {detail.diffQty}
                </span>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card title="处理信息">
        <Form layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="处理状态">
                <Select defaultValue={detail.status} options={['待确认', '处理中', '已完成', '已关闭'].map((v) => ({ value: v, label: v }))} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="差异原因">
                <Select defaultValue={detail.reason} options={['少记入库', '少记出库', '冻结未释放', '盘点差异', '其他'].map((v) => ({ value: v, label: v }))} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="处理方式">
                <Select
                  defaultValue={detail.handling}
                  options={['补录入库记录', '补录出库记录', '补录释放记录', '冻结调整记录', '库存调整记录', '人工确认无差异'].map((v) => ({ value: v, label: v }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="修正数量">
                <InputNumber defaultValue={detail.fixQty} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="处理人">
                <Select
                  showSearch
                  defaultValue={detail.handler}
                  options={['张敏', '王雪', '李晨', '马会宁', '周晨曦', '宋逸凡'].map((v) => ({ value: v, label: v }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="处理时间">
                <DatePicker defaultValue={parseDateValue(detail.handleAt)} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="处理说明">
                <TextArea rows={3} defaultValue={detail.handleDesc} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card title="操作日志">
        <Table<DiscrepancyLogRow>
          rowKey="key"
          columns={logColumns}
          dataSource={logData}
          pagination={false}
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  )
}
