import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, DatePicker, Divider, Form, Image, Input, InputNumber, Modal, Row, Select, Space, Switch, Table, Tag, Upload } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { ModuleField, ModuleNestedRow, ModuleRow } from '../services/api'
import { useModuleData } from '../hooks/useModuleData'
import { useI18n } from '../i18n/context'
import { getNavigationBreadcrumbLabels } from '../utils/navigationI18n'

const { TextArea } = Input

type CustomerConfirmationRow = {
  key: string
  content: string
  imageUrls?: string[]
  status: string
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

const PRODUCT_INVENTORY_KEYS = new Set(['库存分布', '本地总库存', '冻结库存', '调拨中', '可用库存', '安全库存状态'])
const PRODUCT_FACTORY_LABELS = new Set(['生产工厂 1', '生产工厂 2', '生产工厂 3'])
const MAX_PRODUCT_FACTORY_COUNT = 3
const STOCKOUT_LABEL = '缺货'

const toNumber = (value: string | number | undefined) => {
  if (typeof value === 'number') return value
  const normalized = String(value ?? '')
    .replace(/,/g, '')
    .trim()
  return Number(normalized) || 0
}

const getInventoryStatus = (value: string | number | undefined) => (toNumber(value) < 5 ? STOCKOUT_LABEL : '-')

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

const normalizeFields = (fields: ModuleField[]): ModuleField[] => {
  const normalized: ModuleField[] = []
  let skipYesNo = false

  for (const field of fields) {
    const label = field.label.trim()

    if (skipYesNo && (label === '是' || label === '否')) continue

    if (label === '是否需要审核') {
      const fieldValue = Array.isArray(field.value) ? field.value.join(',') : (field.value ?? '')
      normalized.push({
        ...field,
        type: 'switch',
        value: isSwitchOn(fieldValue) ? 'on' : 'off',
      })
      skipYesNo = true
      continue
    }

    skipYesNo = false
    normalized.push(field)
  }

  return normalized
}

const renderImageUpload = () => (
  <Upload className="ticket-confirmation-image-upload" accept="image/*" listType="picture-card" maxCount={6} beforeUpload={() => false}>
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>选择图片</div>
    </div>
  </Upload>
)

const renderEditableField = (field: ModuleField, basePath?: string) => {
  const type = field.type
  const strValue = Array.isArray(field.value) ? field.value.join(',') : (field.value ?? '')

  if (basePath === '/service/consultation' && field.label === '确认图片') {
    return renderImageUpload()
  }

  // 没有 type 的字段显示为纯文本
  if (!type) return <span>{strValue || '-'}</span>

  if (type === 'switch') return <Switch defaultChecked={isSwitchOn(strValue)} />
  if (type === 'input' && isSwitchLike(strValue)) return <Switch defaultChecked={isSwitchOn(strValue)} />
  if (type === 'number') return <InputNumber style={{ width: '100%' }} defaultValue={toNumber(strValue)} />
  if (type === 'date') {
    return <DatePicker showTime style={{ width: '100%' }} defaultValue={parseDateValue(strValue)} />
  }
  if (type === 'select') {
    const options = (field.options && field.options.length ? field.options : [strValue || '']).filter(Boolean)
    return <Select defaultValue={strValue || options[0]} options={options.map((option) => ({ value: option, label: option }))} />
  }
  if (type === 'multiSelect') {
    const options = field.options ?? []
    const selectedValues = Array.isArray(field.value) ? field.value : [field.value].filter(Boolean)
    return (
      <Select
        mode="multiple"
        defaultValue={selectedValues}
        options={options.map((option) => ({ value: option, label: option }))}
        placeholder="请选择角色"
        style={{ width: '100%' }}
      />
    )
  }
  if (type === 'textarea') return <TextArea rows={3} defaultValue={strValue} />
  return <Input defaultValue={strValue} />
}

const renderReadOnlyField = (field: ModuleField, basePath?: string) => {
  const type = field.type ?? 'input'
  const strValue = Array.isArray(field.value) ? field.value.join(',') : (field.value ?? '')

  if (basePath === '/service/consultation' && field.label === '事项编号') {
    return strValue ? <Link to={`/service/consultation/${strValue}`}>{strValue}</Link> : <span>-</span>
  }

  if (basePath === '/service/consultation' && field.label === '工单编号') {
    return strValue ? <Link to={`/ticket/list/${strValue}`}>{strValue}</Link> : <span>-</span>
  }

  if (basePath === '/service/consultation' && field.label === '确认图片') {
    return strValue ? <Image width={64} height={64} src={strValue} style={{ objectFit: 'cover' }} /> : <span>-</span>
  }

  if (basePath === '/service/consultation' && field.label === '产品条码') {
    return strValue ? <Link to="/product/list">{strValue}</Link> : <span>-</span>
  }

  if (basePath === '/service/consultation' && field.label === '是否有库存') {
    const tone = /有/.test(strValue) ? 'success' : 'error'
    return strValue ? <Tag color={tone}>{strValue}</Tag> : <span>-</span>
  }

  if (basePath === '/service/consultation' && field.label === '是否完成付款') {
    const tone = /已|是|完成/.test(strValue) ? 'success' : 'warning'
    return strValue ? <Tag color={tone}>{strValue}</Tag> : <span>-</span>
  }

  if (basePath === '/service/consultation' && field.label === '客户确认结果') {
    const color = strValue === '已确认' ? 'success' : strValue === '已拒绝' ? 'error' : 'orange'
    return strValue && strValue !== '-' ? <Tag color={color}>{strValue}</Tag> : <span>-</span>
  }

  if (type === 'switch' || (type === 'input' && isSwitchLike(strValue))) {
    return <span>{isSwitchOn(strValue) ? '是' : '否'}</span>
  }

  return <span>{strValue || '-'}</span>
}

function ConsultationConfirmationItems({ showTitle = true }: ConsultationConfirmationItemsProps) {
  const [confirmationRows, setConfirmationRows] = useState<CustomerConfirmationRow[]>([
    { key: '1', content: '请客户确认更换镜片及对应费用。', status: '待确认' },
    { key: '2', content: '请客户确认维修周期延长 3 个工作日。', status: '待确认' },
  ])
  const [editingConfirmationRow, setEditingConfirmationRow] = useState<CustomerConfirmationRow>()

  const updateConfirmationRow = (key: string, data: Partial<CustomerConfirmationRow>) => {
    setConfirmationRows((rows) => rows.map((row) => row.key === key ? { ...row, ...data } : row))
  }

  const openAddConfirmationRow = () => {
    setEditingConfirmationRow({ key: '', content: '', imageUrls: [], status: '待确认' })
  }

  const saveEditingConfirmationRow = () => {
    if (!editingConfirmationRow) return

    if (editingConfirmationRow.key) {
      updateConfirmationRow(editingConfirmationRow.key, editingConfirmationRow)
    } else {
      setConfirmationRows((rows) => [
        ...rows,
        { ...editingConfirmationRow, key: Date.now().toString() },
      ])
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
      title: '图片预览',
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (value: string) => <Tag color={value === '已确认' ? 'success' : value === '已拒绝' ? 'error' : 'orange'}>{value}</Tag>,
    },
  ]

  return (
    <>
      {showTitle ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="ticket-confirmation-title">客户确认事项</span>
          <Button type="link" icon={<PlusOutlined />} onClick={openAddConfirmationRow}>添加</Button>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
          <Button type="link" icon={<PlusOutlined />} onClick={openAddConfirmationRow}>添加</Button>
        </div>
      )}
      <Table
        className="consultation-confirmation-table"
        rowKey="key"
        columns={confirmationColumns}
        dataSource={confirmationRows}
        pagination={false}
        size="small"
        scroll={{ x: '100%' }}
      />

      <Modal
        open={Boolean(editingConfirmationRow)}
        title={editingConfirmationRow?.key ? '编辑客户确认事项' : '添加客户确认事项'}
        onCancel={() => setEditingConfirmationRow(undefined)}
        onOk={saveEditingConfirmationRow}
        maskClosable={false}
        okText="发送"
        cancelText="取消"
      >
        <Form layout="vertical" className="v2-form-labels">
          <Form.Item label="内容">
            <TextArea
              rows={4}
              value={editingConfirmationRow?.content}
              placeholder="请输入客户确认内容"
              onChange={(event) => setEditingConfirmationRow((row) => row ? { ...row, content: event.target.value } : row)}
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
                setEditingConfirmationRow((row) => row ? { ...row, imageUrls: [...(row.imageUrls ?? []), imageUrl] } : row)
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
                setEditingConfirmationRow((row) => row ? {
                  ...row,
                  imageUrls: (row.imageUrls ?? []).filter((_, imageIndex) => imageIndex !== index),
                } : row)
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

export function StandardDetailPage() {
  const navigate = useNavigate()
  const { messages } = useI18n()

  const { schema, sections: apiSections, basePath, detailId } = useModuleData()

  const isProductDetail = basePath === '/product/list'
  const isConsultationDetail = basePath === '/service/consultation'

  // 从 schema rows 中找当前记录（用于 warehouseDetails 等额外字段）
  const currentRow = useMemo(() => {
    if (!schema) return undefined
    return (schema.rows.find((row) => String(row.id) === detailId) ?? schema.rows[0]) as ModuleRow | undefined
  }, [schema, detailId])

  const sourceInventoryRows = useMemo(
    () => (Array.isArray(currentRow?.warehouseDetails) ? (currentRow!.warehouseDetails as ModuleNestedRow[]) : []),
    [currentRow]
  )

  const [inventoryRows, setInventoryRows] = useState<ModuleNestedRow[]>([])
  const [productFactoryValues, setProductFactoryValues] = useState<string[]>([])
  const [visibleFactoryCount, setVisibleFactoryCount] = useState(2)
  const [customerModalOpen, setCustomerModalOpen] = useState(false)
  const [consultationType, setConsultationType] = useState('')
  const isCustomerConfirmation = isConsultationDetail && consultationType === '客户确认'

  const customerHistoryColumns: ColumnsType<CustomerHistoryRow> = [
    { title: '工单编号', dataIndex: 'ticketNo', key: 'ticketNo', render: (value: string) => <Link to={`/ticket/list/${value}`}>{value}</Link> },
    { title: '受理日期', dataIndex: 'acceptDate', key: 'acceptDate', width: 140 },
    {
      title: '工单状态',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (value: string) => <Tag color={value === '已完成' ? 'green' : 'blue'}>{value}</Tag>,
    },
    { title: '故障分类', dataIndex: 'faultType', key: 'faultType' },
  ]
  const customerHistoryData: CustomerHistoryRow[] = [
    { key: '1', ticketNo: '115001', acceptDate: '2023-10-27', status: '维修进行中', faultType: '镜框损坏' },
    { key: '2', ticketNo: '114982', acceptDate: '2023-08-15', status: '已完成', faultType: '螺丝松动' },
    { key: '3', ticketNo: '113205', acceptDate: '2023-03-02', status: '已完成', faultType: '抛光服务' },
  ]

  const productFactoryFields = useMemo(() => {
    if (!isProductDetail) return [] as ModuleField[]
    return normalizeFields(apiSections.flatMap((section) => section.fields)).filter((field) =>
      PRODUCT_FACTORY_LABELS.has(field.label.trim()),
    )
  }, [isProductDetail, apiSections])

  const productFactoryOptions = useMemo(() => {
    return Array.from(
      new Set(
        productFactoryFields.flatMap((field) =>
          (field.options && field.options.length ? field.options : [field.value ?? '']).filter(Boolean),
        ),
      ),
    )
  }, [productFactoryFields])

  // 当数据加载完成后初始化状态
  useEffect(() => {
    async function initState() {
      setInventoryRows(sourceInventoryRows)
      const initialValues = productFactoryFields.map((field) => {
        const val = Array.isArray(field.value) ? field.value.join(',') : (field.value ?? '')
        return val
      })
      setProductFactoryValues(initialValues)
      setVisibleFactoryCount(Math.min(2, Math.max(initialValues.length, 2)))
    }
    initState()
  }, [basePath, detailId, isProductDetail, sourceInventoryRows, productFactoryFields])

  useEffect(() => {
    if (!isConsultationDetail) return
    setConsultationType(String(currentRow?.c3 ?? '一般咨询'))
  }, [currentRow, isConsultationDetail])

  const sections = useMemo(() => {
    if (isConsultationDetail) {
      const hiddenConfirmationLabels = new Set(['确认图片', '确认说明'])
      const confirmationOnlyLabels = new Set(['客户确认结果', '确认时间'])
      const rowValueMap: Record<string, string> = {
        工单编号: String(currentRow?.c1 ?? ''),
        事项编号: String(currentRow?.c2 ?? detailId),
        事项类型: String(consultationType || currentRow?.c3 || ''),
        事项主题: String(currentRow?.c4 ?? ''),
        外呼类型: String(currentRow?.c5 ?? ''),
        咨询渠道: String(currentRow?.c5 ?? ''),
        咨询日期: String(currentRow?.c6 ?? ''),
        负责人: String(currentRow?.c7 ?? ''),
        状态: String(currentRow?.c8 ?? ''),
        客户确认结果: String(currentRow?.c9 ?? ''),
      }

      const mappedSections = apiSections
        .map((section) => ({
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
      const mergedBaseFields =
        insertAfterIndex >= 0
          ? [
              ...baseFields.slice(0, insertAfterIndex + 1),
              ...processingFields,
              ...baseFields.slice(insertAfterIndex + 1),
            ]
          : [...baseFields, ...processingFields]
      const mergedBaseSection = {
        ...(baseSection ?? { title: '基础信息', fields: [] }),
        fields: mergedBaseFields,
      }

      const restSections = mappedSections.filter(
        (section) => section.title !== '基础信息' && section.title !== '咨询处理信息',
      )
      const sectionOrder: Record<string, number> = { 基础信息: 1, 关联信息: 2, 处理信息: 3 }
      return [mergedBaseSection, ...restSections].sort((a, b) => (sectionOrder[a.title] ?? 99) - (sectionOrder[b.title] ?? 99))
    }

    if (!isProductDetail) return apiSections

    return apiSections.map((section) => ({
      ...section,
      fields: section.fields.filter((field) => {
        const label = field.label.trim()
        return !PRODUCT_INVENTORY_KEYS.has(label) && !PRODUCT_FACTORY_LABELS.has(label)
      }),
    }))
  }, [apiSections, currentRow, detailId, isConsultationDetail, isCustomerConfirmation, isProductDetail])

  const inventoryColumns = useMemo<ColumnsType<ModuleNestedRow>>(
    () => [
      {
        title: '仓名',
        dataIndex: 'warehouse',
        key: 'warehouse',
        width: 160,
      },
      {
        title: '仓库位置',
        dataIndex: 'location',
        key: 'location',
        width: 160,
        render: (value: string | number | undefined, record) => (
          <Input
            value={String(value ?? '')}
            onChange={(event) => {
              const nextValue = event.target.value
              setInventoryRows((prev) =>
                prev.map((item) =>
                  String(item.key ?? item.warehouse) === String(record.key ?? record.warehouse)
                    ? { ...item, location: nextValue }
                    : item,
                ),
              )
            }}
          />
        ),
      },
      {
        title: '本地总库存',
        dataIndex: 'localTotal',
        key: 'localTotal',
        width: 120,
        align: 'center',
      },
      {
        title: '冻结库存',
        dataIndex: 'frozen',
        key: 'frozen',
        width: 120,
        align: 'center',
      },
      {
        title: '调拨中',
        dataIndex: 'transfer',
        key: 'transfer',
        width: 120,
        align: 'center',
      },
      {
        title: '可用库存',
        dataIndex: 'available',
        key: 'available',
        width: 120,
        align: 'center',
      },
      {
        title: '安全库存状态',
        dataIndex: 'status',
        key: 'status',
        width: 140,
        align: 'center',
        render: (_value: string | number | undefined, record) => {
          const inventoryStatus = getInventoryStatus(record.available as string | number | undefined)
          return inventoryStatus === STOCKOUT_LABEL ? <Tag color="error">{inventoryStatus}</Tag> : inventoryStatus
        },
      },
    ],
    [],
  )

  const inventoryTotals = useMemo(
    () => ({
      localTotal: inventoryRows.reduce((sum, row) => sum + toNumber(row.localTotal as string | number | undefined), 0),
      frozen: inventoryRows.reduce((sum, row) => sum + toNumber(row.frozen as string | number | undefined), 0),
      transfer: inventoryRows.reduce((sum, row) => sum + toNumber(row.transfer as string | number | undefined), 0),
      available: inventoryRows.reduce((sum, row) => sum + toNumber(row.available as string | number | undefined), 0),
    }),
    [inventoryRows],
  )

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
            <Button onClick={() => (isProductDetail ? navigate(basePath) : undefined)}>
              {isProductDetail ? '返回' : '取消'}
            </Button>
            <Button type="primary">保存</Button>
          </Space>
        </Col>
      </Row>

      {sections.map((section, index) => {
        // 库存申请单：根据处理方式决定是否显示执行信息
        if (basePath === '/inventory/request' && section.title === '执行信息') {
          const processMethod = sections.find((s) => s.title === '处理信息')?.fields.find((f) => f.key === '处理方式')?.value
          if (processMethod === '驳回' || processMethod === '无需执行') return null
        }
        return (
        <Card key={section.title} title={section.title}>
          <Form layout="vertical">
            <Row gutter={16}>
              {normalizeFields(section.fields).map((field) => {
                // 库存申请单执行信息：根据执行类型动态显示字段
                if (basePath === '/inventory/request' && section.title === '执行信息' && field.showWhen) {
                  const execType = section.fields.find((f) => f.key === '执行类型')?.value
                  if (field.showWhen === 'outbound' && execType !== '出库执行') return null
                  if (field.showWhen === 'transfer' && execType !== '调拨执行') return null
                }
                const isReadOnlyField = isProductDetail || field.editable === false
                const isFullWidthField = field.type === 'textarea' || (basePath === '/service/consultation' && field.label === '确认图片')
                const isConsultationCustomerName =
                  basePath === '/service/consultation' && (field.label === '客户名称' || field.label === '客户姓名')
                const isConsultationTypeField =
                  basePath === '/service/consultation' && field.label === '事项类型'
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
                      ) : isConsultationCustomerName ? (
                        <Button type="link" style={{ padding: 0 }} onClick={() => setCustomerModalOpen(true)}>
                          {strValue || '-'}
                        </Button>
                      ) : isReadOnlyField ? (
                        renderReadOnlyField(field, basePath)
                      ) : (
                        renderEditableField(field, basePath)
                      )}
                    </Form.Item>
                  </Col>
                )
              })}

              {isConsultationDetail && section.title === '基础信息' && isCustomerConfirmation ? (
                <Col xs={24}>
                  <Divider plain titlePlacement="start">客户确认信息</Divider>
                  <ConsultationConfirmationItems showTitle={false} />
                </Col>
              ) : null}

              {isProductDetail && productFactoryFields.length > 0 && index === 0 ? (
                <Col xs={24}>
                  <Form.Item label="生产工厂" style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                      {productFactoryValues.slice(0, visibleFactoryCount).map((value, factoryIndex) => (
                        <div key={`factory-${factoryIndex}`} style={{ flex: '1 1 150px', minWidth: 150, maxWidth: 300 }}>
                          <Select
                            value={value || productFactoryOptions[0]}
                            options={productFactoryOptions.map((option) => ({ value: option, label: option }))}
                            onChange={(nextValue) =>
                              setProductFactoryValues((prev) => {
                                const next = [...prev]
                                next[factoryIndex] = String(nextValue)
                                return next
                              })
                            }
                          />
                        </div>
                      ))}
                      <Button
                        style={{ width: 32, paddingInline: 0, flex: '0 0 auto' }}
                        onClick={() => setVisibleFactoryCount((count) => Math.max(1, count - 1))}
                        disabled={visibleFactoryCount <= 1}
                        icon={<MinusOutlined />}
                      />
                      <Button
                        style={{ width: 32, paddingInline: 0, flex: '0 0 auto' }}
                        onClick={() => setVisibleFactoryCount((count) => Math.min(MAX_PRODUCT_FACTORY_COUNT, count + 1))}
                        disabled={visibleFactoryCount >= MAX_PRODUCT_FACTORY_COUNT}
                        icon={<PlusOutlined />}
                      />
                    </div>
                  </Form.Item>
                </Col>
              ) : null}
            </Row>
          </Form>
        </Card>
        )
      })}

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

      {isProductDetail ? (
        <Card title="库存信息">
          <Table
            rowKey={(row) => String(row.key ?? `${row.warehouse}-${row.location}`)}
            columns={inventoryColumns}
            dataSource={inventoryRows}
            pagination={false}
            scroll={{ x: 940 }}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={2}>
                  合计
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2} align="center">
                  {inventoryTotals.localTotal.toLocaleString()}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3} align="center">
                  {inventoryTotals.frozen.toLocaleString()}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4} align="center">
                  {inventoryTotals.transfer.toLocaleString()}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} align="center">
                  {inventoryTotals.available.toLocaleString()}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} align="center">
                  -
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </Card>
      ) : null}
    </Space>
  )
}
