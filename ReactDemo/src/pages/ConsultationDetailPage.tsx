import { PlusOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Image, Input, Modal, Row, Select, Space, Switch, Table, Tag, Upload } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useModuleData } from '../hooks/useModuleData'
import { useI18n } from '../i18n/context'
import type { ModuleField, ModuleRow } from '../services/api'
import { getNavigationBreadcrumbLabels } from '../utils/navigationI18n'

const { TextArea } = Input

type CustomerConfirmationRow = {
  key: string
  content: string
  imageUrls?: string[]
  confirmResult: string
  confirmTime: string
}

type CustomerHistoryRow = {
  key: string
  ticketNo: string
  acceptDate: string
  status: string
  faultType: string
}

type ConsultationConfirmationItemsProps = {
  showTitle?: boolean
}

const parseDateValue = (value: string) => {
  if (!value) return undefined
  const normalized = value.includes('T') ? value : value.replace(' ', 'T')
  const parsed = dayjs(normalized)
  return parsed.isValid() ? parsed : undefined
}

const isSwitchOn = (value: string) => {
  const normalized = value.trim().toLowerCase()
  return normalized === 'on' || normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === '是'
}

const isSwitchLike = (value: string) => {
  const normalized = value.trim().toLowerCase()
  return normalized === 'on' || normalized === 'off' || normalized === 'true' || normalized === 'false' || normalized === '1' || normalized === '0'
}

const normalizeFields = (fields: ModuleField[]): ModuleField[] =>
  fields.map((field) => ({
    ...field,
    type: field.type ?? 'input',
  }))

const renderEditableField = (field: ModuleField) => {
  const type = field.type ?? 'input'
  const strValue = Array.isArray(field.value) ? field.value.join(',') : (field.value ?? '')

  if (type === 'switch') return <Switch defaultChecked={isSwitchOn(strValue)} />
  if (type === 'input' && isSwitchLike(strValue)) return <Switch defaultChecked={isSwitchOn(strValue)} />
  if (type === 'date') return <DatePicker showTime style={{ width: '100%' }} defaultValue={parseDateValue(strValue)} />
  if (type === 'select') {
    const options = (field.options && field.options.length ? field.options : [strValue || '']).filter(Boolean)
    return <Select defaultValue={strValue || options[0]} options={options.map((option) => ({ value: option, label: option }))} />
  }
  if (type === 'textarea') return <TextArea rows={3} defaultValue={strValue} />
  return <Input defaultValue={strValue} />
}

const renderReadOnlyField = (field: ModuleField) => {
  const strValue = Array.isArray(field.value) ? field.value.join(',') : (field.value ?? '')

  if (field.label === '事项编号') {
    return strValue ? <Link to={`/service/consultation/${strValue}`}>{strValue}</Link> : <span>-</span>
  }
  if (field.label === '工单编号') {
    return strValue ? <Link to={`/ticket/list/${strValue}`}>{strValue}</Link> : <span>-</span>
  }
  if (field.label === '产品条码') {
    return strValue ? <Link to="/product/list">{strValue}</Link> : <span>-</span>
  }
  if (field.label === '是否有库存') {
    const tone = /有/.test(strValue) ? 'success' : 'error'
    return strValue ? <Tag color={tone}>{strValue}</Tag> : <span>-</span>
  }
  if (field.label === '是否完成付款') {
    const tone = /已|是|完成/.test(strValue) ? 'success' : 'warning'
    return strValue ? <Tag color={tone}>{strValue}</Tag> : <span>-</span>
  }
  if (field.label === '客户确认结果') {
    const color = strValue === '已确认' ? 'success' : strValue === '已拒绝' ? 'error' : 'orange'
    return strValue && strValue !== '-' ? <Tag color={color}>{strValue}</Tag> : <span>-</span>
  }
  return <span>{strValue || '-'}</span>
}

function ConsultationConfirmationItems({ showTitle = true }: ConsultationConfirmationItemsProps) {
  const [confirmationRows, setConfirmationRows] = useState<CustomerConfirmationRow[]>([
    { key: '1', content: '请客户确认更换镜片及对应费用。', confirmResult: '待确认', confirmTime: '-' },
    { key: '2', content: '请客户确认维修周期延长 3 个工作日。', confirmResult: '待确认', confirmTime: '-' },
  ])
  const [editingConfirmationRow, setEditingConfirmationRow] = useState<CustomerConfirmationRow>()

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

export function ConsultationDetailPage() {
  const navigate = useNavigate()
  const { messages } = useI18n()
  const { schema, sections: apiSections, basePath, detailId } = useModuleData()

  const currentRow = useMemo(() => {
    if (!schema) return undefined
    return (schema.rows.find((row) => String(row.id) === detailId) ?? schema.rows[0]) as ModuleRow | undefined
  }, [schema, detailId])

  const [consultationType, setConsultationType] = useState('')
  const [outboundType, setOutboundType] = useState('')
  const [customerModalOpen, setCustomerModalOpen] = useState(false)
  const isCustomerConfirmation = consultationType === '客户确认'

  useEffect(() => {
    const nextType = String(currentRow?.c3 ?? '一般咨询')
    const nextOutboundType = String(currentRow?.c5 ?? '')

    setConsultationType(nextType)
    setOutboundType(nextOutboundType)
  }, [currentRow])

  const sections = useMemo(() => {
    const hiddenConfirmationLabels = new Set(['确认图片', '确认说明'])
    const confirmationOnlyLabels = new Set(['客户确认结果', '确认时间'])
    const rowValueMap: Record<string, string> = {
      工单编号: String(currentRow?.c1 ?? ''),
      事项编号: String(currentRow?.c2 ?? detailId),
      事项类型: String(consultationType || currentRow?.c3 || ''),
      事项主题: String(currentRow?.c4 ?? ''),
      外呼类型: String(outboundType || currentRow?.c5 || ''),
      咨询渠道: String(currentRow?.c5 ?? ''),
      咨询日期: String(currentRow?.c6 ?? ''),
      负责人: String(currentRow?.c7 ?? ''),
      咨询状态: String(currentRow?.c8 ?? ''),
      状态: String(currentRow?.c8 ?? ''),
      客户确认结果: String(currentRow?.c9 ?? ''),
    }

    const mappedSections = apiSections.map((section) => ({
      ...section,
      fields: section.fields
        .filter((field) => !hiddenConfirmationLabels.has(field.label))
        .filter((field) => field.label !== '例外处理分类')
        .filter((field) => isCustomerConfirmation || !confirmationOnlyLabels.has(field.label))
        .map((field) => ({
          ...field,
          value: rowValueMap[field.label] ?? field.value,
        })),
    }))

    const baseSection = mappedSections.find((section) => section.title === '基础信息')
    const processingSection = mappedSections.find((section) => section.title === '咨询处理信息')
    const baseFields = baseSection?.fields ?? []
    const processingFields = processingSection?.fields ?? []
    const insertAfterIndex = baseFields.findIndex((field) => field.label === '外呼类型')
    const rawMergedBaseFields =
      insertAfterIndex >= 0
        ? [...baseFields.slice(0, insertAfterIndex + 1), ...processingFields, ...baseFields.slice(insertAfterIndex + 1)]
        : [...baseFields, ...processingFields]
    const bottomFieldOrder = ['客户反应', '咨询状态', '状态', '咨询内容', '事项内容']
    const bottomFields = bottomFieldOrder.reduce<typeof rawMergedBaseFields>((acc, label) => {
      const found = rawMergedBaseFields.find((field) => field.label === label)
      if (found) acc.push(found)
      return acc
    }, [])
    const bottomFieldSet = new Set(bottomFieldOrder)
    const mergedBaseFields = [
      ...rawMergedBaseFields.filter((field) => !bottomFieldSet.has(field.label)),
      ...bottomFields,
    ]

    const mergedBaseSection = {
      ...(baseSection ?? { title: '基础信息', fields: [] }),
      fields: mergedBaseFields,
    }

    const restSections = mappedSections.filter((section) => section.title !== '基础信息' && section.title !== '咨询处理信息')
    const sectionOrder: Record<string, number> = { 基础信息: 1, 关联信息: 2, 处理信息: 3 }
    return [mergedBaseSection, ...restSections].sort((a, b) => (sectionOrder[a.title] ?? 99) - (sectionOrder[b.title] ?? 99))
  }, [apiSections, currentRow, detailId, consultationType, isCustomerConfirmation, outboundType])

  const customerHistoryColumns: ColumnsType<CustomerHistoryRow> = [
    { title: '工单编号', dataIndex: 'ticketNo', key: 'ticketNo', render: (value: string) => <Link to={`/ticket/list/${value}`}>{value}</Link> },
    { title: '受理日期', dataIndex: 'acceptDate', key: 'acceptDate', width: 140 },
    { title: '工单状态', dataIndex: 'status', key: 'status', width: 140, render: (value: string) => <Tag color={value === '已完成' ? 'green' : 'blue'}>{value}</Tag> },
    { title: '故障分类', dataIndex: 'faultType', key: 'faultType' },
  ]
  const customerHistoryData: CustomerHistoryRow[] = [
    { key: '1', ticketNo: '115001', acceptDate: '2023-10-27', status: '维修进行中', faultType: '镜框损坏' },
    { key: '2', ticketNo: '114982', acceptDate: '2023-08-15', status: '已完成', faultType: '螺丝松动' },
    { key: '3', ticketNo: '113205', acceptDate: '2023-03-02', status: '已完成', faultType: '抛光服务' },
  ]

  if (!schema) {
    return <Card loading style={{ margin: 16 }} />
  }

  const [parentBreadcrumbLabel, currentBreadcrumbLabel] = getNavigationBreadcrumbLabels(messages, basePath, schema.breadcrumb)

  return (
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Breadcrumb
            items={[
              { title: parentBreadcrumbLabel },
              { title: <Link to={basePath}>{currentBreadcrumbLabel}</Link> },
              { title: messages.common.detail },
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

      {sections.map((section) => (
        <Card key={section.title} title={section.title}>
          <Form layout="vertical">
            <Row gutter={16}>
              {normalizeFields(section.fields).map((field) => {
                const isReadOnlyField = field.editable === false
                const isFullWidthField = field.type === 'textarea'
                const isConsultationCustomerName = field.label === '客户名称' || field.label === '客户姓名'
                const isConsultationTypeField = field.label === '事项类型'
                const isOutboundTypeField = field.label === '外呼类型'
                const isOwnerField = field.label === '负责人'
                const strValue = Array.isArray(field.value) ? field.value.join(',') : (field.value ?? '')
                return (
                  <Col key={`${section.title}-${field.key}-${field.label}`} xs={24} md={isFullWidthField ? 24 : 12}>
                    <Form.Item label={field.label}>
                      {isConsultationTypeField ? (
                        <Select
                          value={consultationType || strValue}
                          options={(field.options ?? []).map((option) => ({ value: option, label: option }))}
                          onChange={(value) => setConsultationType(String(value))}
                        />
                      ) : isOutboundTypeField ? (
                        <Select
                          value={outboundType || strValue}
                          options={(field.options ?? []).map((option) => ({ value: option, label: option }))}
                          onChange={(value) => setOutboundType(String(value ?? ''))}
                        />
                      ) : isOwnerField ? (
                        <Select
                          showSearch
                          optionFilterProp="label"
                          defaultValue={strValue}
                          options={(field.options ?? []).map((option) => ({ value: option, label: option }))}
                        />
                      ) : isConsultationCustomerName ? (
                        <Button type="link" style={{ padding: 0 }} onClick={() => setCustomerModalOpen(true)}>
                          {strValue || '-'}
                        </Button>
                      ) : isReadOnlyField ? (
                        renderReadOnlyField(field)
                      ) : (
                        renderEditableField(field)
                      )}
                    </Form.Item>
                  </Col>
                )
              })}

              {section.title === '基础信息' && isCustomerConfirmation ? (
                <Col xs={24}>
                  <ConsultationConfirmationItems />
                </Col>
              ) : null}
            </Row>
          </Form>
        </Card>
      ))}

      <Modal
        open={customerModalOpen}
        title="客户资料"
        onCancel={() => setCustomerModalOpen(false)}
        maskClosable={false}
        footer={<Button onClick={() => setCustomerModalOpen(false)}>关闭</Button>}
        width={800}
      >
        <Row gutter={[16, 8]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <div style={{ padding: 16 }}>
              <div style={{ color: '#94a3b8', marginBottom: 8 }}>电话号码</div>
              <span>138****1234</span>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div style={{ padding: 16 }}>
              <div style={{ color: '#94a3b8', marginBottom: 8 }}>电子邮件</div>
              <span>zhang***@email.com</span>
            </div>
          </Col>
          <Col xs={24}>
            <div style={{ padding: 16 }}>
              <div style={{ color: '#94a3b8', marginBottom: 8 }}>地址</div>
              <span>上海市静安区南京西路 1266 号 38 层客户服务中心</span>
            </div>
          </Col>
        </Row>
        <Card size="small" title="受理历史记录">
          <Table rowKey="key" columns={customerHistoryColumns} dataSource={customerHistoryData} pagination={false} scroll={{ x: '100%' }} />
        </Card>
      </Modal>
    </Space>
  )
}
