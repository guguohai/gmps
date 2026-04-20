import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
} from 'antd'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useModuleData } from '../hooks/useModuleData'
import { defaultProductOptions, ProductSearchSelect } from '../components/ProductSearchSelect'
import { useI18n } from '../i18n/context'
import { getNavigationBreadcrumbLabels } from '../utils/navigationI18n'

const { TextArea } = Input

// ── 状态枚举 ────────────────────────────────────────────────────────────────

type ProgressStatus = '待处理' | '处理中' | '已完成' | '已关闭'

const PROGRESS_STATUS_OPTIONS: ProgressStatus[] = ['待处理', '处理中', '已完成', '已关闭']

const HANDLER_OPTIONS = ['马会宁', '周晨曦', '宋逸凡', '苏芮', '张经理', '李经理', '王经理']

// ── 工具函数 ─────────────────────────────────────────────────────────────────

type SectionList = ReturnType<typeof useModuleData>['sections']

const fv = (sections: SectionList, sectionTitle: string, key: string): string => {
  const section = sections.find((s) => s.title === sectionTitle)
  const field = section?.fields.find((f) => f.key === key)
  const val = field?.value
  return Array.isArray(val) ? val.join(',') : (val ?? '')
}

// ── 主组件 ────────────────────────────────────────────────────────────────────

export function InventoryRequestDetailPage() {
  const navigate = useNavigate()
  const { messages } = useI18n()
  const { schema, sections, basePath, loading } = useModuleData()

  // 申请信息：可编辑字段覆盖
  const [productCode, setProductCode] = useState<string | null>(null)
  const [productName, setProductName] = useState<string | null>(null)
  const [storageLocation, setStorageLocation] = useState<string | null>(null)
  const [requestQty, setRequestQty] = useState<number | null>(null)
  const [requestReason, setRequestReason] = useState<string | null>(null)

  // 处理信息：可编辑字段覆盖
  const [progressStatus, setProgressStatus] = useState<ProgressStatus | null>(null)
  const [handler, setHandler] = useState<string | null>(null)

  // 从 sections 读取初始值（null 时使用 sections 值）
  const rawStatus = fv(sections, '处理信息', 'progressStatus') as ProgressStatus
  const initialStatus: ProgressStatus = PROGRESS_STATUS_OPTIONS.includes(rawStatus) ? rawStatus : '待处理'
  const effectiveStatus = progressStatus ?? initialStatus

  const effectiveProductCode = productCode ?? fv(sections, '申请信息', 'productCode')
  const effectiveProductName = productName ?? fv(sections, '申请信息', 'productName')
  const effectiveStorageLocation = storageLocation ?? fv(sections, '申请信息', 'storageLocation')
  const rawQty = Number(fv(sections, '申请信息', 'requestQty')) || 1
  const effectiveQty = requestQty ?? rawQty
  const effectiveReason = requestReason ?? fv(sections, '申请信息', 'requestReason')
  const effectiveHandler = handler ?? fv(sections, '处理信息', 'handler')
  const productOptions = [
    {
      value: effectiveProductName,
      label: effectiveProductName,
      code: effectiveProductCode,
      category: '申请产品',
      stock: 10,
    },
    ...defaultProductOptions.filter((item) => item.value !== effectiveProductName),
  ].filter((item) => item.value)

  if (loading || !schema) {
    return <Card loading style={{ margin: 16 }} />
  }

  const breadcrumb = schema.breadcrumb ?? ['库存管理', '申请单']
  const [parentBreadcrumbLabel, currentBreadcrumbLabel] = getNavigationBreadcrumbLabels(messages, basePath, breadcrumb)

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      {/* 顶部面包屑 + 操作按钮 */}
      <Row justify="space-between" align="middle">
        <Col>
          <Breadcrumb
            items={[
              { title: parentBreadcrumbLabel },
              { title: <Link to={basePath}>{currentBreadcrumbLabel}</Link> },
              { title: messages.inventoryRequest.detail },
            ]}
          />
        </Col>
        <Col>
          <Space>
            <Button onClick={() => navigate(basePath)}>返回</Button>
            <Button type="primary">保存</Button>
          </Space>
        </Col>
      </Row>

      {/* 申请信息 */}
      <Card title="申请信息">
        <Form layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="工单ID">
                <span style={{ lineHeight: '32px' }}>
                  <Link to={`/ticket/list/${fv(sections, '申请信息', 'ticketId')}`}>
                    {fv(sections, '申请信息', 'ticketId') || '-'}
                  </Link>
                </span>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="请求时间">
                <span style={{ lineHeight: '32px' }}>{fv(sections, '申请信息', 'requestTime') || '-'}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="请求负责人">
                <span style={{ lineHeight: '32px' }}>{fv(sections, '申请信息', 'requestOwner') || '-'}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="产品名称" required>
                <ProductSearchSelect
                  value={effectiveProductName}
                  onChange={(val) => {
                    const selected = productOptions.find((item) => item.value === val)
                    setProductName(val)
                    setProductCode(selected?.code ?? val)
                    setStorageLocation('仓库 C001 - 1117')
                  }}
                  options={productOptions}
                  placeholder="输入产品名称搜索"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="产品编码">
                <Input value={effectiveProductCode} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="存放位置">
                <Input value={effectiveStorageLocation} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="请求数量" required>
                <InputNumber
                  style={{ width: '100%' }}
                  min={1}
                  precision={0}
                  value={effectiveQty}
                  onChange={(val) => setRequestQty(val ?? 1)}
                />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item label="申请原因" required>
                <TextArea
                  rows={3}
                  value={effectiveReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                  placeholder="请填写申请原因"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* 处理信息 */}
      <Card title="处理信息">
        <Form layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="进度状态">
                <Select
                  value={effectiveStatus}
                  options={PROGRESS_STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
                  onChange={(val) => setProgressStatus(val)}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="处理时间">
                <span style={{ lineHeight: '32px' }}>{fv(sections, '处理信息', 'handleTime') || '-'}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="处理人">
                <Select
                  value={effectiveHandler || undefined}
                  placeholder="请选择处理人"
                  showSearch
                  options={HANDLER_OPTIONS.map((h) => ({ value: h, label: h }))}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={(val) => setHandler(val)}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </Space>
  )
}
