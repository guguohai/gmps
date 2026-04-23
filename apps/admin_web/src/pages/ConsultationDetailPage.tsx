import { PlusOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Image, Input, Modal, Row, Select, Space, Table, Tag, Upload } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useI18n } from '../i18n/context'
import { getNavigationBreadcrumbLabels } from '../utils/navigationI18n'
import { getConsultationDetail } from '../services/consultationApi'
import type { ConsultationRow } from '../types/consultation'
import type { CustomerConfirmationRow, CustomerHistoryRow } from '../types/ticket'
import type { ConsultationConfirmationItemsProps } from '../types/consultation'

const { TextArea } = Input

const parseDateValue = (value: string) => {
  if (!value) return undefined
  const normalized = value.includes('T') ? value : value.replace(' ', 'T')
  const parsed = dayjs(normalized)
  return parsed.isValid() ? parsed : undefined
}

const splitImageUrls = (value: string) => {
  if (!value) return []
  return value.split('|').map((part) => part.trim()).filter(Boolean)
}

// ============================================
// 客户确认事项子组件
// ============================================

function ConsultationConfirmationItems({ showTitle = true, initialRows = [] }: ConsultationConfirmationItemsProps) {
  const [confirmationRows, setConfirmationRows] = useState<CustomerConfirmationRow[]>(initialRows)
  const [editingConfirmationRow, setEditingConfirmationRow] = useState<CustomerConfirmationRow>()

  useEffect(() => {
    setConfirmationRows(initialRows)
  }, [initialRows])

  const updateConfirmationRow = (key: string, data: Partial<CustomerConfirmationRow>) => {
    setConfirmationRows((rows) => rows.map((row) => (row.key === key ? { ...row, ...data } : row)))
  }

  const openAddConfirmationRow = () => {
    setEditingConfirmationRow({ key: '', content: '', imageUrls: [], confirmResult: '待确认', confirmTime: '-' })
  }

  const saveEditingConfirmationRow = () => {
    if (!editingConfirmationRow) return
    if (editingConfirmationRow.key) {
      updateConfirmationRow(editingConfirmationRow.key, editingConfirmationRow)
    } else {
      setConfirmationRows((rows) => [...rows, { ...editingConfirmationRow, key: Date.now().toString() }])
    }
    setEditingConfirmationRow(undefined)
  }

  const confirmationColumns: ColumnsType<CustomerConfirmationRow> = [
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      render: (value: string) => <span>{value || '-'}</span>,
    },
    {
      title: '确认图片',
      key: 'image',
      width: 160,
      render: (_, record) => {
        const imageUrls = record.imageUrls ?? []
        return imageUrls.length > 0 ? (
          <Image.PreviewGroup>
            <Space size={8} wrap>
              {imageUrls.map((imageUrl, index) => (
                <Image
                  key={`${record.key}-${imageUrl}-${index}`}
                  width={48}
                  height={48}
                  src={imageUrl}
                  style={{ objectFit: 'cover' }}
                />
              ))}
            </Space>
          </Image.PreviewGroup>
        ) : (
          <span style={{ color: '#94a3b8' }}>暂无图片</span>
        )
      },
    },
    {
      title: '确认结果',
      dataIndex: 'confirmResult',
      key: 'confirmResult',
      width: 150,
      render: (value: string) => <Tag color={value === '已确认' ? 'success' : value === '已拒绝' ? 'error' : 'orange'}>{value}</Tag>,
    },
    {
      title: '确认时间',
      dataIndex: 'confirmTime',
      key: 'confirmTime',
      width: 180,
      render: (value: string) => <span>{value || '-'}</span>,
    },
  ]

  return (
    <>
      {showTitle ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="ticket-confirmation-title">客户确认信息</span>
          <Button type="link" icon={<PlusOutlined />} onClick={openAddConfirmationRow}>
            添加
          </Button>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <Button type="link" icon={<PlusOutlined />} onClick={openAddConfirmationRow}>
            添加
          </Button>
        </div>
      )}

      <div className="consultation-confirmation-table-wrap">
        <Table
          className="consultation-confirmation-table"
          rowKey="key"
          columns={confirmationColumns}
          dataSource={confirmationRows}
          pagination={false}
          size="small"
          scroll={{ x: '100%' }}
        />
      </div>

      <Modal
        open={Boolean(editingConfirmationRow)}
        title={editingConfirmationRow?.key ? '编辑客户确认事项' : '添加客户确认事项'}
        onCancel={() => setEditingConfirmationRow(undefined)}
        onOk={saveEditingConfirmationRow}
        closable={false}
        okText="发送"
        cancelText="取消"
      >
        <Form layout="vertical" className="v2-form-labels">
          <Form.Item label="内容">
            <TextArea
              rows={4}
              value={editingConfirmationRow?.content}
              placeholder="请输入客户确认内容"
              onChange={(event) => setEditingConfirmationRow((row) => (row ? { ...row, content: event.target.value } : row))}
            />
          </Form.Item>
          <Form.Item label="图片选择">
            <Upload
              className="ticket-confirmation-image-upload"
              accept="image/*"
              multiple
              maxCount={6}
              beforeUpload={(file) => {
                const imageUrl = URL.createObjectURL(file)
                setEditingConfirmationRow((row) => (row ? { ...row, imageUrls: [...(row.imageUrls ?? []), imageUrl] } : row))
                return false
              }}
              fileList={(editingConfirmationRow?.imageUrls ?? []).map((imageUrl, index) => ({
                uid: `${index}`,
                name: `图片${index + 1}`,
                status: 'done',
                url: imageUrl,
              }))}
              listType="picture-card"
              onRemove={(file) => {
                const index = Number(file.uid)
                setEditingConfirmationRow((row) =>
                  row
                    ? {
                      ...row,
                      imageUrls: (row.imageUrls ?? []).filter((_, imageIndex) => imageIndex !== index),
                    }
                    : row,
                )
              }}
            >
              {(editingConfirmationRow?.imageUrls?.length ?? 0) < 6 ? (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>选择图片</div>
                </div>
              ) : null}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

// ============================================
// 咨询详情页
// ============================================

export function ConsultationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { messages } = useI18n()
  const [parentBreadcrumbLabel, currentBreadcrumbLabel] = getNavigationBreadcrumbLabels(messages, '/service/consultation', ['服务管理', '咨询列表'])

  const [detail, setDetail] = useState<ConsultationRow | null>(null)
  const [consultationType, setConsultationType] = useState('')
  const [outboundType, setOutboundType] = useState('')
  const [customerModalOpen, setCustomerModalOpen] = useState(false)

  useEffect(() => {
    if (!id) return
    getConsultationDetail(id).then((data) => {
      setDetail(data)
      setConsultationType(data.itemType)
      setOutboundType(data.channel)
    })
  }, [id])

  const isCustomerConfirmation = consultationType === '客户确认'

  // 客户确认事项数据
  const confirmationItemsData = useMemo<CustomerConfirmationRow[]>(() => {
    if (!detail) return []
    return detail.confirmationItems.map((row) => ({
      key: row.key,
      content: row.content,
      imageUrls: splitImageUrls(row.imageUrls),
      confirmResult: row.confirmResult || '待确认',
      confirmTime: row.confirmTime || '-',
    }))
  }, [detail])

  // 客户受理历史
  const customerHistoryColumns: ColumnsType<CustomerHistoryRow> = [
    { title: '工单编号', dataIndex: 'ticketNo', key: 'ticketNo', render: (value: string) => <Link to={`/ticket/list/${value}`}>{value}</Link> },
    { title: '受理日期', dataIndex: 'acceptDate', key: 'acceptDate', width: 140 },
    { title: '工单状态', dataIndex: 'status', key: 'status', width: 140, render: (value: string) => <Tag color={value === '已完成' ? 'green' : 'blue'}>{value}</Tag> },
    { title: '故障分类', dataIndex: 'faultType', key: 'faultType' },
  ]
  const customerHistoryData = useMemo<CustomerHistoryRow[]>(() => {
    if (!detail) return []
    return detail.customerHistory.map((row) => ({
      key: row.key,
      ticketNo: row.ticketNo,
      acceptDate: row.acceptDate,
      status: row.status,
      faultType: row.faultType,
    }))
  }, [detail])

  if (!detail) {
    return <Card loading style={{ margin: 16 }} />
  }

  return (
    <div className="app-page-stack">
      <Row className="app-sticky-page-bar" justify="space-between" align="middle">
        <Col>
          <Breadcrumb
            items={[
              { title: parentBreadcrumbLabel },
              { title: <Link to="/service/consultation">{currentBreadcrumbLabel}</Link> },
              { title: messages.common.detail },
            ]}
          />
        </Col>
        <Col>
          <Space>
            <Button onClick={() => navigate('/service/consultation')}>返回</Button>
            <Button type="primary">保存</Button>
          </Space>
        </Col>
      </Row>

      {/* ============ 基础信息 ============ */}
      <Card title="基础信息">
        <Form layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="事项编号">
                {detail.itemNo ? <Link to={`/service/consultation/${detail.itemNo}`}>{detail.itemNo}</Link> : <span>-</span>}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="工单编号">
                {detail.ticketNo ? <Link to={`/ticket/list/${detail.ticketNo}`}>{detail.ticketNo}</Link> : <span>-</span>}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="事项类型">
                <Select
                  value={consultationType}
                  options={['一般咨询', '客户确认'].map((v) => ({ value: v, label: v }))}
                  onChange={(value) => setConsultationType(String(value))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="事项主题">
                <Input defaultValue={detail.subject} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="外呼类型">
                <Select
                  value={outboundType}
                  options={['电话', 'email', '小程序'].map((v) => ({ value: v, label: v }))}
                  onChange={(value) => setOutboundType(String(value ?? ''))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="咨询需求分类">
                <Select
                  defaultValue="维修费用"
                  options={['维修费用', '调整沟通', '配件停产', '配送周期', '同款产品更换', '更换其他产品', '镜片补偿', '产品退款', '其他'].map((v) => ({ value: v, label: v }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="负责人">
                <Select
                  showSearch
                  optionFilterProp="label"
                  defaultValue={detail.handler}
                  options={['赵师傅', '张经理', '李工程师'].map((v) => ({ value: v, label: v }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="咨询日期">
                <DatePicker style={{ width: '100%' }} defaultValue={parseDateValue(detail.consultDate)} />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="客户反应">
                <Select
                  defaultValue="客户反应"
                  options={['客户感动', '客户满意', '中立', '不满', '强烈不满'].map((v) => ({ value: v, label: v }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="咨询状态">
                <Select
                  defaultValue={detail.status}
                  options={['等待中', '已发送', '待客户确认', '客户已回复', '已完成'].map((v) => ({ value: v, label: v }))}
                />
              </Form.Item>
            </Col>
            {isCustomerConfirmation ? (
              <>
                <Col xs={24} md={12}>
                  <Form.Item label="客户确认结果">
                    {detail.confirmResult && detail.confirmResult !== '-' ? (
                      <Tag color={detail.confirmResult === '已确认' ? 'success' : detail.confirmResult === '已拒绝' ? 'error' : 'orange'}>{detail.confirmResult}</Tag>
                    ) : (
                      <span>-</span>
                    )}
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item label="确认时间">
                    <span>{detail.confirmTime || '-'}</span>
                  </Form.Item>
                </Col>
              </>
            ) : null}
            <Col xs={24}>
              <Form.Item label="咨询内容">
                <TextArea rows={3} defaultValue="客户咨询当前维修方案及预计处理周期。" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item label="事项内容">
                <TextArea rows={3} defaultValue="" />
              </Form.Item>
            </Col>
            {isCustomerConfirmation ? (
              <Col xs={24}>
                <ConsultationConfirmationItems initialRows={confirmationItemsData} />
              </Col>
            ) : null}
          </Row>
        </Form>
      </Card>

      {/* ============ 关联信息 ============ */}
      <Card title="关联信息">
        <Form layout="vertical">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="客户姓名">
                <Button type="link" style={{ padding: 0 }} onClick={() => setCustomerModalOpen(true)}>
                  {detail.customerName || '-'}
                </Button>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="电话号码">
                <span>{detail.phone || '-'}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="国家">
                <span>{detail.country || '-'}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="电子邮箱">
                <span>{detail.email || '-'}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="接收日期">
                <span>{detail.receiveDate || '-'}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="接收渠道">
                <span>{detail.receiveChannel || '-'}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="购买日期">
                <span>{detail.purchaseDate || '-'}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="购买渠道">
                <span>{detail.purchaseChannel || '-'}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="产品名称">
                <span>{detail.productName || '-'}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="产品条码">
                {detail.productBarcode ? <Link to="/product/list">{detail.productBarcode}</Link> : <span>-</span>}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="是否有库存">
                {detail.hasStock ? (
                  <Tag color={/有/.test(detail.hasStock) ? 'success' : 'error'}>{detail.hasStock}</Tag>
                ) : (
                  <span>-</span>
                )}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="电镀 / 焊接维修是否可行">
                <span>{detail.repairFeasible || '-'}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="入库日期">
                <span>{detail.stockInDate || '-'}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="预计出库日期">
                <span>{detail.expectedOutDate || '-'}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="维修内容">
                <span>{detail.repairContent || '-'}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="维修费用">
                <span>{detail.repairFee || '-'}</span>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="是否完成付款">
                {detail.paymentStatus ? (
                  <Tag color={/已|是|完成/.test(detail.paymentStatus) ? 'success' : 'warning'}>{detail.paymentStatus}</Tag>
                ) : (
                  <span>-</span>
                )}
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="出库完成日期">
                <span>{detail.outboundDoneDate || '-'}</span>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

      {/* ============ 客户资料弹窗 ============ */}
      <Modal
        open={customerModalOpen}
        title="客户资料"
        onCancel={() => setCustomerModalOpen(false)}
        mask={{ closable: false }}
        footer={<Button onClick={() => setCustomerModalOpen(false)}>关闭</Button>}
        width={800}
      >
        <Row gutter={[16, 8]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <div style={{ padding: 16 }}>
              <div style={{ color: '#94a3b8', marginBottom: 8 }}>电话号码</div>
              <span>{detail.phone || '-'}</span>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div style={{ padding: 16 }}>
              <div style={{ color: '#94a3b8', marginBottom: 8 }}>电子邮件</div>
              <span>{detail.email || '-'}</span>
            </div>
          </Col>
          <Col xs={24}>
            <div style={{ padding: 16 }}>
              <div style={{ color: '#94a3b8', marginBottom: 8 }}>地址</div>
              <span>{detail.address || '-'}</span>
            </div>
          </Col>
        </Row>
        <Card size="small" title="受理历史记录">
          <Table rowKey="key" columns={customerHistoryColumns} dataSource={customerHistoryData} pagination={false} scroll={{ x: '100%' }} />
        </Card>
      </Modal>
    </div>
  )
}
