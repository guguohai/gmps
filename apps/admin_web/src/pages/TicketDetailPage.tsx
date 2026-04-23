import { Breadcrumb, Button, Card, Checkbox, Col, DatePicker, Dropdown, Form, Image, Input, InputNumber, Modal, Row, Segmented, Select, Space, Steps, Switch, Table, Tabs, Tag, Typography, Upload, message } from 'antd'
import {
  CheckCircleOutlined,
  CreditCardOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FileTextOutlined,
  InboxOutlined,
  LoadingOutlined,
  PlusOutlined,
  SolutionOutlined,
  ToolOutlined,
  TruckOutlined,
} from '@ant-design/icons'
import { Alert } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import type { CSSProperties } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useBeforeUnload, useParams } from 'react-router-dom'
import addressBookIcon from '../assets/address-book.svg'
import { defaultProductOptions, ProductSearchSelect } from '../components/ProductSearchSelect'
import type { ModuleField, ModuleRow, ModuleSection } from '../types/module'
import {
  REPAIR_TYPE_OPTIONS,
  ATTACHED_ITEM_TYPE_OPTIONS,
  HEADER_OWNER_OPTIONS,
  SMS_TEMPLATES,
  EMAIL_TEMPLATES,
} from '../mocks/data/ticketDict'
import { useI18n } from '../i18n/context'
import type { TicketMainStatus, TicketSubStatus, TicketFlowStepRecord, InventoryItem, AttachmentRow, CustomerConfirmationRow, PriceItemRow, PriceFactorRow, NoticeRow, TicketLogRow, CustomerHistoryRow } from '../types/ticket'
import type { SearchableSelectOption } from '../types/common'
import { useTicketStatus } from '../hooks/useTicketStatus'
import { getNavigationBreadcrumbLabels } from '../utils/navigationI18n'
import { resolveTicketFlowView } from '../business/ticketFlow'
import { getTicketDetail, getTicketDetailSections, getTicketFlowSteps } from '../services/ticketApi'
import type { MenuProps } from 'antd/lib/menu'

const { TextArea } = Input
const { Text, Title } = Typography

const createConsultationNo = () =>
  `CONS-${dayjs().format('YYYYMM')}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

const mainStatusStepIcons: Record<TicketMainStatus, React.ReactNode> = {
  REVIEW: <FileTextOutlined />,
  ACCEPT: <FileTextOutlined />,
  RECEIVE: <InboxOutlined />,
  JUDGE: <SolutionOutlined />,
  PAY: <CreditCardOutlined />,
  PROCESS: <ToolOutlined />,
  FULFILL: <TruckOutlined />,
  COMPLETE: <CheckCircleOutlined />,
}

const appFormSelectStyle: CSSProperties & Record<string, string> = {
  '--ant-select-height': '40px',
  '--ant-select-padding-horizontal': '11px',
  '--ant-select-padding-vertical': '8px',
  '--ant-select-background-color': '#f5f7fa',
}

const isSwitchOn = (value: string) => {
  const normalized = value.trim().toLowerCase()
  return normalized === 'on' || normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === '是'
}

const isSwitchLike = (value: string) => {
  const normalized = value.trim().toLowerCase()
  return normalized === 'on' || normalized === 'off' || normalized === 'true' || normalized === 'false' || normalized === '1' || normalized === '0'
}

function InventoryRequestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form] = Form.useForm()
  const [items, setItems] = useState<InventoryItem[]>([
    { key: '1', productName: '', quantity: 1, reason: '' }
  ])

  const addItem = () => {
    setItems([...items, {
      key: Date.now().toString(),
      productName: '',
      quantity: 1,
      reason: ''
    }])
  }

  const removeItem = (key: string) => {
    setItems(items.filter(item => item.key !== key))
  }

  const updateItem = (key: string, field: keyof InventoryItem, value: string | number) => {
    setItems(items.map(item => item.key === key ? { ...item, [field]: value } : item))
  }

  const getAvailableStock = (productName: string) => {
    if (!productName) return null
    return defaultProductOptions.find((item) => item.value === productName)?.stock ?? null
  }

  const handleSubmit = async () => {
    await form.validateFields()
    message.success('库存申请已提交')
    onClose()
  }

  return (
    <Modal
      open={open}
      title="库存申请"
      onCancel={onClose}
      onOk={handleSubmit}
      mask={{ closable: false }}
      okText="确认申请"
      cancelText="取消"
      width={800}
      destroyOnHidden={false}
    >
      <Form form={form} layout="vertical" className="v2-form-labels">
        {/* 基本信息 */}
        <Row gutter={16} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #f0f0f0' }}>
          <Col span={12}>
            <Form.Item label="申请负责人">
              <span style={{ fontWeight: 500 }}>Vance</span>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="进行状态">
              <span style={{ fontWeight: 500 }}>待处理</span>
            </Form.Item>
          </Col>
        </Row>

        {/* 申请项目 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontWeight: 600, color: '#64748b' }}>申请项目</span>
            <Button type="link" onClick={addItem} style={{ padding: 0 }}>
              + 添加
            </Button>
          </div>

          {items.map((item, index) => {
            const availableStock = getAvailableStock(item.productName)

            return (
              <div
                key={item.key}
                className="ticket-inventory-item"
                style={{
                  padding: 16,
                  marginBottom: 16,
                  border: '1px solid #f0f0f0'
                }}
              >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="产品名称"
                    name={['items', index, 'productName']}
                    rules={[{ required: true, message: '请选择产品' }]}
                  >
                    <ProductSearchSelect
                      value={item.productName}
                      onChange={(value) => updateItem(item.key, 'productName', value)}
                      placeholder="选择产品"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={`申请数量${availableStock === null ? '' : `（可用库存：${availableStock}）`}`}
                    name={['items', index, 'quantity']}
                    rules={[{ required: true, message: '请输入数量' }]}
                  >
                    <InputNumber
                      style={{ width: '100%' }}
                      min={1}
                      value={item.quantity}
                      onChange={(value) => updateItem(item.key, 'quantity', value || 1)}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item
                    label="申请原因"
                    name={['items', index, 'reason']}
                  >
                    <TextArea
                      placeholder="请填写申请原因"
                      value={item.reason}
                      onChange={(e) => updateItem(item.key, 'reason', e.target.value)}
                      rows={2}
                    />
                  </Form.Item>
                </Col>
              </Row>
              {items.length > 1 && (
                <div style={{ textAlign: 'right' }}>
                  <Button type="link" danger onClick={() => removeItem(item.key)}>
                    删除
                  </Button>
                </div>
              )}
              </div>
            )
          })}
        </div>
      </Form>
    </Modal>
  )
}



function AddRepairItemModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form] = Form.useForm()
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)

  const handleSubmit = async () => {
    await form.validateFields()
    message.success('维修项目已添加')
    onClose()
    form.resetFields()
    setSelectedProduct(null)
  }

  const handleClose = () => {
    onClose()
    form.resetFields()
    setSelectedProduct(null)
  }

  return (
    <Modal
      open={open}
      title="新增"
      onCancel={handleClose}
      onOk={handleSubmit}
      mask={{ closable: false }}
      okText="保存"
      cancelText="取消"
      width={600}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" className="v2-form-labels">
        {/* 产品名称搜索 */}
        <Form.Item
          label="产品名称"
          name="product"
          rules={[{ required: true, message: '请选择产品' }]}
        >
          <ProductSearchSelect
            value={selectedProduct || undefined}
            onChange={(value) => setSelectedProduct(value)}
            placeholder="请搜索并选择产品"
          />
        </Form.Item>

        {/* 数量 */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="计划数量"
              name="planQty"
              initialValue={1}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="实际数量"
              name="actualQty"
              initialValue={1}
            >
              <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        {/* 维修类型 */}
        <Form.Item
          label="维修类型 (可多选)"
          name="repairTypes"
        >
          <Checkbox.Group style={{ width: '100%' }}>
            <Row gutter={[8, 8]}>
              {REPAIR_TYPE_OPTIONS.map(option => (
                <Col span={12} key={option.value}>
                  <Checkbox value={option.value} className="ticket-repair-type-checkbox" style={{ padding: '8px 12px', width: '100%' }}>
                    {option.label}
                  </Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

function NoticeSendAction() {
  const [noticeOpen, setNoticeOpen] = useState(false)
  const [channel, setChannel] = useState<'sms' | 'email'>('sms')
  const [noticeForm] = Form.useForm()

  const smsTemplates = SMS_TEMPLATES
  const emailTemplates = EMAIL_TEMPLATES

  return (
    <>
      <Button type="primary" onClick={() => setNoticeOpen(true)}>发送通知</Button>
      <Modal
        open={noticeOpen}
        title="发送通知"
        onCancel={() => setNoticeOpen(false)}
        onOk={async () => {
          await noticeForm.validateFields()
          setNoticeOpen(false)
          noticeForm.resetFields()
          setChannel('sms')
          message.success('通知已发送')
        }}
        mask={{ closable: false }}
        okText="确认发送"
        cancelText="取消"
        forceRender
        destroyOnHidden
      >
        <Form form={noticeForm} layout="vertical" className="v2-form-labels">
          <Form.Item label="发送方式">
            <Segmented
              block
              value={channel}
              onChange={(v) => {
                setChannel(v as 'sms' | 'email')
                noticeForm.setFieldValue('template', undefined)
              }}
              options={[
                { label: '消息通知 (SMS)', value: 'sms' },
                { label: '邮件通知 (Email)', value: 'email' },
              ]}
            />
          </Form.Item>
          <Form.Item label="模板" name="template" rules={[{ required: true, message: '请选择模板' }]}>
            <Select
              className="app-form-select"
              style={appFormSelectStyle}
              placeholder="请选择模板"
              showSearch
              optionFilterProp="label"
              options={(channel === 'sms' ? smsTemplates : emailTemplates).map((v) => ({ value: v, label: v }))}
            />
          </Form.Item>
          <Form.Item label="接收人信息">
            <div style={{ padding: 12,  border: '1px solid #dbeafe',borderRadius:'6px' }}>
              <Row gutter={12}>
                <Col span={12}>
                  <div style={{ color: '#64748b' }}>手机号码</div>
                  <div>138****8888</div>
                </Col>
                <Col span={12}>
                  <div style={{ color: '#64748b' }}>电子邮件</div>
                  <div>vance@example.com</div>
                </Col>
              </Row>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

const buildSearchableOptions = (values: string[]): SearchableSelectOption[] =>
  values.map((value) => ({
    value,
    label: value,
    plainLabel: value,
    searchText: value.toLowerCase(),
  }))

const searchableFieldOptionMap: Record<string, { placeholder: string; options: SearchableSelectOption[] }> = {
  '受理渠道': {
    placeholder: '搜索渠道...',
    options: buildSearchableOptions([
      'Online Support',
      'Shanghai Flagship',
      'Beijing Boutique',
      'Authorized Retailer - Century',
      'Duty Free',
      'Call Center',
      'Seoul Subsidiary',
      'Tokyo Flagship',
    ]),
  },
  '受理门店': {
    placeholder: '搜索门店...',
    options: buildSearchableOptions([
      '上海旗舰店',
      '北京王府井店',
      '广州天河店',
      '深圳万象城店',
      '成都太古里店',
      '杭州大厦店',
    ]),
  },
  '购买渠道': {
    placeholder: '搜索购买渠道...',
    options: buildSearchableOptions([
      '官方旗舰店',
      '百货专柜',
      '独立精品店',
      '线上官方商城',
      '授权零售商',
      '免税店',
    ]),
  },
  '咨询负责人': {
    placeholder: '搜索负责人...',
    options: buildSearchableOptions(['赵师傅', '张师傅', '刘师傅']),
  },
  '现象': {
    placeholder: '搜索...',
    options: buildSearchableOptions([
      '产品破损/损坏',
      '镜片问题',
      '装饰问题',
      '调校请求',
      '护理请求',
      '其他问题',
      '配件请求',
      '产品丢失',
      '门店破损',
      '假货',
    ]),
  },
  '问题现象': {
    placeholder: '搜索...',
    options: buildSearchableOptions([
      '假品',
      '钉胶掉漆',
      '钉胶变形',
      '钉胶氧化生锈',
      '钉胶松动',
      '钉胶脱落',
      '钉胶破损',
      '钉胶垫圈损坏',
      '钉胶垫圈脱落',
      '螺丝掉漆',
    ]),
  },
  '服务工程师': {
    placeholder: '搜索...',
    options: buildSearchableOptions(['张师傅', '李师傅', '王工程师']),
  },
  '维修内容': {
    placeholder: '搜索...',
    options: buildSearchableOptions([
      'Gentle Care',
      '零配件更换',
      '电镀维修',
      '焊接维修',
      '无法修复',
      '维修已取消',
      '退款',
      '产品更换',
      '产品兑换券',
      'Simple Care',
    ]),
  },
  '更换产品名称': {
    placeholder: '搜索产品...',
    options: buildSearchableOptions(['GM Sunglasses B02', 'GM Sunglasses C03', 'GM Optical D04']),
  },
  '配件名称': {
    placeholder: '请选择配件',
    options: buildSearchableOptions([
      '请选择配件',
      'Jennie - Aile.G',
      'Jennie - Aile.M',
      'Jennie - Aile.B',
      'Jennie - Jem',
      'Jennie - Jem.P',
      'Jennie - Dottler',
      'Jennie - Dottler.P',
      'Jennie - Cupiece',
      'Jennie - Cooing',
    ]),
  },
}

const REPAIR_CONTENT_LABEL = '\u7ef4\u4fee\u5185\u5bb9'
const REPLACEMENT_PRODUCT_LABEL = '\u66f4\u6362\u4ea7\u54c1\u540d\u79f0'
const PRODUCT_REPLACEMENT_VALUE = '\u4ea7\u54c1\u66f4\u6362'
const SEARCH_TOKEN = '\u641c\u7d22'
const PLEASE_SELECT_TOKEN = '\u8bf7\u9009\u62e9'

const getFieldStringValue = (field?: ModuleField) =>
  field ? (Array.isArray(field.value) ? field.value.join(',') : (field.value ?? '')) : ''

const normalizeSelectDefaultValue = (value: string) => {
  if (!value) return undefined
  if (value.includes(SEARCH_TOKEN) || value.includes(PLEASE_SELECT_TOKEN)) return undefined
  return value
}

const isRepairContentField = (field: ModuleField) =>
  field.key === REPAIR_CONTENT_LABEL || field.label === REPAIR_CONTENT_LABEL

const isReplacementProductField = (field: ModuleField) =>
  field.key === REPLACEMENT_PRODUCT_LABEL || field.label === REPLACEMENT_PRODUCT_LABEL

const isProductReplacementContent = (value?: string) =>
  Boolean(value && value.includes(PRODUCT_REPLACEMENT_VALUE))

function RepairContentWithReplacementSelect({
  repairContentField,
  replacementProductField,
  onDirty,
}: {
  repairContentField: ModuleField
  replacementProductField?: ModuleField
  onDirty?: () => void
}) {
  const repairContentConfig = searchableFieldOptionMap[repairContentField.label] ?? searchableFieldOptionMap[repairContentField.key]
  const replacementProductConfig =
    (replacementProductField
      ? (searchableFieldOptionMap[replacementProductField.label] ?? searchableFieldOptionMap[replacementProductField.key])
      : undefined) ?? searchableFieldOptionMap[REPLACEMENT_PRODUCT_LABEL]

  const [repairContentValue, setRepairContentValue] = useState<string | undefined>(
    normalizeSelectDefaultValue(getFieldStringValue(repairContentField)),
  )
  const [replacementProductValue, setReplacementProductValue] = useState<string | undefined>(
    normalizeSelectDefaultValue(getFieldStringValue(replacementProductField)),
  )

  const showReplacementProductSelect = isProductReplacementContent(repairContentValue)

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Select
        className="app-form-select"
        style={{ ...appFormSelectStyle, width: showReplacementProductSelect ? '50%' : '100%' }}
        showSearch
        placeholder={repairContentConfig?.placeholder}
        optionLabelProp="plainLabel"
        filterOption={(input, option) =>
          String(option?.searchText ?? '').includes(input.trim().toLowerCase())
        }
        value={repairContentValue}
        options={repairContentConfig?.options ?? []}
        onChange={(value) => {
          setRepairContentValue(value)
          if (!isProductReplacementContent(value)) {
            setReplacementProductValue(undefined)
          }
          onDirty?.()
        }}
      />
      {showReplacementProductSelect ? (
        <Select
          className="app-form-select"
          style={{ ...appFormSelectStyle, width: '50%' }}
          showSearch
          placeholder={replacementProductConfig?.placeholder}
          optionLabelProp="plainLabel"
          filterOption={(input, option) =>
            String(option?.searchText ?? '').includes(input.trim().toLowerCase())
          }
          value={replacementProductValue}
          options={replacementProductConfig?.options ?? []}
          onChange={(value) => {
            setReplacementProductValue(value)
            onDirty?.()
          }}
        />
      ) : null}
    </div>
  )
}

const renderSearchableSelect = (
  value: string,
  placeholder: string,
  options: SearchableSelectOption[],
  onDirty?: () => void,
) => {
  const looksLikePlaceholder = !value || value.includes('搜索') || value.includes('请选择')

  return (
    <Select
      className="app-form-select"
      style={appFormSelectStyle}
      showSearch
      placeholder={placeholder}
      optionLabelProp="plainLabel"
      filterOption={(input, option) =>
        String(option?.searchText ?? '').includes(input.trim().toLowerCase())
      }
      defaultValue={looksLikePlaceholder ? undefined : value}
      options={options}
      onChange={() => onDirty?.()}
    />
  )
}

const renderField = (field: ModuleField, onDirty?: () => void) => {
  const type = field.type ?? 'input'
  const strValue = Array.isArray(field.value) ? field.value.join(',') : (field.value ?? '')
  const searchableFieldConfig = searchableFieldOptionMap[field.label] ?? searchableFieldOptionMap[field.key]
  const isProductNameField = field.key === '产品名称' || field.label === '产品名称'
  const isLogisticsTrackField = field.key === '物流轨迹入口' || field.label === '物流轨迹入口'
  const isConsultationNoField = field.key === '咨询单号' || field.label === '咨询单号'

  if (isProductNameField) {
    return <ProductSearchSelect value={strValue} placeholder="搜索产品..." style={{ width: '100%' }} onChange={() => onDirty?.()} />
  }

  if (searchableFieldConfig) {
    return renderSearchableSelect(strValue, searchableFieldConfig.placeholder, searchableFieldConfig.options, onDirty)
  }

  // 物流轨迹入口 改为链接
  if (isLogisticsTrackField) return <Link to="/logistics/track">点击查询实时轨迹</Link>

  // 咨询单号 改为链接
  if (isConsultationNoField) return <Link to={`/service/consultation/${strValue}`}>{strValue}</Link>

  // 是否产品问题 改为 Switch
  if (field.key === '是否产品问题' || field.label === '是否产品问题') {
    return <Switch defaultChecked={isSwitchOn(strValue)} onChange={() => onDirty?.()} />
  }

  // 类别改为纯文本
  if (field.key === '类别' || field.label === '类别') {
    return <span style={{ color: '#333' }}>{strValue}</span>
  }

  // 产品信息中，除了产品名称和生产工厂外，其他都是只读文本
  const isProductInfoField = field.key && (
    field.key.includes('产品') || field.key.includes('上市日期') || field.key.includes('零件保有期限') ||
    field.key.includes('库存分布') || field.key.includes('库存') || field.key.includes('调拨中')
  )
  const isProductNameOrFactory = field.key === '产品名称' || field.label === '产品名称' ||
    field.key === '生产工厂' || field.label === '生产工厂'
  if (isProductInfoField && !isProductNameOrFactory) {
    return <span style={{ color: '#333' }}>{strValue}</span>
  }

  // 其他只读字段
  const isReadOnlyField = field.key === '电镀焊接维修是否可行' || field.label === '电镀 / 焊接维修是否可行' ||
    field.key === '库存状态' || field.label === '库存状态' ||
    field.key === '配件存放位置' || field.label === '配件存放位置'
  if (isReadOnlyField) {
    return <span style={{ color: '#333' }}>{strValue}</span>
  }

  if (type === 'switch') return <Switch defaultChecked={isSwitchOn(strValue)} onChange={() => onDirty?.()} />
  if (type === 'input' && isSwitchLike(strValue)) return <Switch defaultChecked={isSwitchOn(strValue)} onChange={() => onDirty?.()} />
  if (type === 'number') return <InputNumber style={{ width: '100%' }} value={Number(strValue) || 0} onChange={() => onDirty?.()} />
  if (type === 'date') return <DatePicker style={{ width: '100%' }} value={strValue ? dayjs(strValue.replace(' ', 'T')) : undefined} onChange={() => onDirty?.()} />
  if (type === 'select') {
    const options = (field.options && field.options.length ? field.options : [strValue || '']).filter(Boolean)
    return <Select className="app-form-select" style={appFormSelectStyle} defaultValue={strValue || options[0]} options={options.map((v) => ({ value: v, label: v }))} onChange={() => onDirty?.()} />
  }
  if (type === 'textarea') return <TextArea rows={3} value={strValue} onChange={() => onDirty?.()} />
  return <Input value={strValue} onChange={() => onDirty?.()} />
}

const findField = (fields: ModuleField[], label: string) =>
  fields.find((field) => field.label === label || field.key === label)

const groupedRepairSwitchLabels = new Set(['是否再维修', '是否紧急维修'])
const groupedAttachmentSwitchLabels = new Set(['是否有购买凭证', '是否附保修卡'])
const groupedProcessingSwitchLabels = new Set(['是否产品问题', '是否等待配件'])


const isGroupedRepairSwitchField = (field: ModuleField) =>
  groupedRepairSwitchLabels.has(field.label) || groupedRepairSwitchLabels.has(field.key)

const isGroupedAttachmentSwitchField = (field: ModuleField) =>
  groupedAttachmentSwitchLabels.has(field.label) || groupedAttachmentSwitchLabels.has(field.key)

const isGroupedProcessingSwitchField = (field: ModuleField) =>
  groupedProcessingSwitchLabels.has(field.label) || groupedProcessingSwitchLabels.has(field.key)

const fullWidthFieldLabels = new Set(['维修参考事项', '客户要求事项内容'])
const isFullWidthField = (field: ModuleField) =>
  fullWidthFieldLabels.has(field.label) || fullWidthFieldLabels.has(field.key)

const renderFieldsWithGroupedRepairSwitches = (
  fields: ModuleField[],
  renderField: (field: ModuleField) => React.ReactNode,
  keyPrefix: string,
  attachedItemType?: string,
  onAttachedItemTypeChange?: (value: string) => void,
  onDirty?: () => void,
) => {
  const repairSwitchFields = fields.filter(isGroupedRepairSwitchField)
  const attachmentSwitchFields = fields.filter(isGroupedAttachmentSwitchField)
  const processingSwitchFields = fields.filter(isGroupedProcessingSwitchField)
  const replacementProductField = fields.find(isReplacementProductField)
  let repairSwitchGroupRendered = false
  let attachmentSwitchGroupRendered = false
  let processingSwitchGroupRendered = false

  return fields.map((field) => {
    if (isFullWidthField(field)) {
      return (
        <Col key={`${keyPrefix}-${field.key}-${field.label}`} xs={24}>
          <Form.Item label={field.label}>{renderField(field)}</Form.Item>
        </Col>
      )
    }

    if (isGroupedRepairSwitchField(field)) {
      if (repairSwitchGroupRendered) return null
      repairSwitchGroupRendered = true

      return (
        <Col key={`${keyPrefix}-repair-switch-group`} xs={24} md={12} style={{ marginBottom: 16 }}>
          <Space size={32} align="start">
            {repairSwitchFields.map((switchField) => (
              <Form.Item
                key={`${keyPrefix}-${switchField.key}-${switchField.label}`}
                label={switchField.label}
                style={{ marginBottom: 0 }}
              >
                {renderField(switchField)}
              </Form.Item>
            ))}
          </Space>
        </Col>
      )
    }

    if (isGroupedAttachmentSwitchField(field)) {
      if (attachmentSwitchGroupRendered) return null
      attachmentSwitchGroupRendered = true

      const nodes: React.ReactNode[] = [
        <Col key={`${keyPrefix}-attachment-switch-group`} xs={24} md={12} style={{ marginBottom: 16 }}>
          <Space size={32} align="start">
            {attachmentSwitchFields.map((switchField) => (
              <Form.Item
                key={`${keyPrefix}-${switchField.key}-${switchField.label}`}
                label={switchField.label}
                style={{ marginBottom: 0 }}
              >
                {renderField(switchField)}
              </Form.Item>
            ))}
          </Space>
        </Col>,
      ]

      if (onAttachedItemTypeChange) {
        nodes.push(
          <Col key={`${keyPrefix}-attached-item-type`} xs={24} md={12}>
            <Form.Item label="随附物品类型">
              <Select
                allowClear
                className="app-form-select"
                placeholder="请选择随附物品类型"
                value={attachedItemType}
                onChange={onAttachedItemTypeChange}
                options={ATTACHED_ITEM_TYPE_OPTIONS.map((value) => ({ value, label: value }))}
              />
            </Form.Item>
          </Col>,
        )
      }

      return nodes
    }

    if (isGroupedProcessingSwitchField(field)) {
      if (processingSwitchGroupRendered) return null
      processingSwitchGroupRendered = true

      return (
        <Col key={`${keyPrefix}-processing-switch-group`} xs={24} md={12} style={{ marginBottom: 16 }}>
          <Space size={32} align="start">
            {processingSwitchFields.map((switchField) => (
              <Form.Item
                key={`${keyPrefix}-${switchField.key}-${switchField.label}`}
                label={switchField.label}
                style={{ marginBottom: 0 }}
              >
                {renderField(switchField)}
              </Form.Item>
            ))}
          </Space>
        </Col>
      )
    }

    if (isReplacementProductField(field)) {
      return null
    }

    if (isRepairContentField(field)) {
      return (
        <Col key={`${keyPrefix}-${field.key}-${field.label}`} xs={24} md={12}>
          <Form.Item label={field.label}>
            <RepairContentWithReplacementSelect
              repairContentField={field}
              replacementProductField={replacementProductField}
              onDirty={onDirty}
            />
          </Form.Item>
        </Col>
      )
    }

    return (
      <Col key={`${keyPrefix}-${field.key}-${field.label}`} xs={24} md={12}>
        <Form.Item label={field.label}>{renderField(field)}</Form.Item>
      </Col>
    )
  })
}

function CustomerInfoSection({
  section,
  renderField,
  onDirty,
}: {
  section: { title: string; fields: ModuleField[] }
  renderField: (field: ModuleField) => React.ReactNode
  onDirty?: () => void
}) {
  const [customerModalOpen, setCustomerModalOpen] = useState(false)
  const nameField = findField(section.fields, '客户姓名')
  const phoneField = findField(section.fields, '电话号码')
  const countryField = findField(section.fields, '国家')
  const emailField = findField(section.fields, '邮箱')
  const marketingField = findField(section.fields, '营销同意')
  const privacyField = findField(section.fields, '隐私同意')
  const deliveryTypeField = findField(section.fields, '收货类型')
  const addressField = findField(section.fields, '收货地址')
  const marketingValue = Array.isArray(marketingField?.value) ? marketingField.value.join(',') : (marketingField?.value ?? '')
  const privacyValue = Array.isArray(privacyField?.value) ? privacyField.value.join(',') : (privacyField?.value ?? '')
  const [marketingChecked, setMarketingChecked] = useState(isSwitchOn(marketingValue))
  const [privacyChecked, setPrivacyChecked] = useState(isSwitchOn(privacyValue))

  const lastName = nameField?.value || 'Vance'
  const firstName = 'Jameson'

  const historyColumns: ColumnsType<CustomerHistoryRow> = [
    { title: '工单编号', dataIndex: 'ticketNo', key: 'ticketNo', render: (value: string) => <Link to={`/ticket/${value}`}>{value}</Link> },
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

  const historyData: CustomerHistoryRow[] = [
    { key: '1', ticketNo: '115001', acceptDate: '2023-10-27', status: '处理中', faultType: '镜框损坏' },
    { key: '2', ticketNo: '114982', acceptDate: '2023-08-15', status: '服务完成', faultType: '螺丝松动' },
    { key: '3', ticketNo: '113205', acceptDate: '2023-03-02', status: '服务完成', faultType: '抛光服务' },
  ]

  return (
    <>
      <Card key={section.title} title={section.title} size="small">
        <Form layout="vertical" className="v2-form-labels">
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="客户姓名">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 8, flex: 1, minWidth: 0 }}>
                    <Input value={lastName} placeholder="姓" style={{ width: '35%', minWidth: 60 }} />
                    <Input value={firstName} placeholder="名" style={{ width: '65%', minWidth: 0 }} />
                  </div>
                  <Button
                    onClick={() => setCustomerModalOpen(true)}
                    type="text"
                    style={{ width: 38, height: 38, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#1677ff' }}
                  >
                    <img src={addressBookIcon} alt="客户详情" style={{ width: 18, height: 18, filter: 'invert(45%) sepia(96%) saturate(2594%) hue-rotate(204deg) brightness(101%) contrast(101%)' }} />
                  </Button>
                </div>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label={phoneField?.label ?? '电话号码'}>{phoneField ? renderField(phoneField) : <Input value="" />}</Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label={countryField?.label ?? '国家'}>{countryField ? renderField(countryField) : <Input value="" />}</Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label={emailField?.label ?? '邮箱'}>{emailField ? renderField(emailField) : <Input value="" />}</Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item label={marketingField?.label ?? '营销同意'} style={{ marginBottom: 0 }}>
                    <Space>
                      <Switch checked={marketingChecked} onChange={(checked) => { setMarketingChecked(checked); onDirty?.() }} />
                      <Text>{marketingChecked ? '已同意' : '未同意'}</Text>
                    </Space>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label={privacyField?.label ?? '隐私同意'} style={{ marginBottom: 0 }}>
                    <Space>
                      <Switch checked={privacyChecked} onChange={(checked) => { setPrivacyChecked(checked); onDirty?.() }} />
                      <Text>{privacyChecked ? '已同意' : '未同意'}</Text>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label={deliveryTypeField?.label ?? '收货类型'}>
                {deliveryTypeField ? renderField(deliveryTypeField) : <Input value="" />}
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item label={addressField?.label ?? '收货地址'}>
                {addressField ? <TextArea rows={2} value={addressField.value ?? ''} /> : <TextArea rows={2} value="" />}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>

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
              <Text>{phoneField?.value || '-'}</Text>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div style={{ padding: 16 }}>
              <div style={{ color: '#94a3b8', marginBottom: 8 }}>电子邮件</div>
              <Text>{emailField?.value || '-'}</Text>
            </div>
          </Col>
          <Col xs={24}>
            <div style={{ padding: 16 }}>
              <div style={{ color: '#94a3b8', marginBottom: 8 }}>地址</div>
              <Text>{addressField?.value || '-'}</Text>
            </div>
          </Col>
        </Row>
        <Card size="small" title="受理历史记录">
          <Table rowKey="key" columns={historyColumns} dataSource={historyData} pagination={false} scroll={{ x: '100%' }} />
        </Card>
      </Modal>
    </>
  )
}

// 受理信息组件（带附件信息表格）
function AcceptanceInfoSection({
  section,
  renderField,
  attachedItemType,
  onAttachedItemTypeChange,
  onDirty,
}: {
  section: { title: string; fields: ModuleField[] }
  renderField: (field: ModuleField) => React.ReactNode
  attachedItemType?: string
  onAttachedItemTypeChange?: (value: string) => void
  onDirty?: () => void
}) {
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false)
  const [deleteAttachmentRow, setDeleteAttachmentRow] = useState<AttachmentRow>()
  const [attachmentData, setAttachmentData] = useState<AttachmentRow[]>([
    {
      key: '1',
      title: '购买凭证',
      fileType: 'PDF',
      modifyTime: '—',
      modifyBy: '—',
    },
  ])

  const updateAttachmentTitle = (key: string, title: string) => {
    setAttachmentData((rows) => rows.map((row) => row.key === key ? { ...row, title } : row))
    onDirty?.()
  }

  const deleteAttachment = (key: string) => {
    setAttachmentData((rows) => rows.filter((row) => row.key !== key))
    setDeleteAttachmentRow(undefined)
    onDirty?.()
  }

  const attachmentColumns: ColumnsType<AttachmentRow> = [
    {
      title: <span><span style={{ color: '#ff4d4f', marginRight: 4 }}>*</span>标题</span>,
      dataIndex: 'title',
      key: 'title',
      render: (value: string, record) => <a onClick={() => updateAttachmentTitle(record.key, value)}>{value}</a>,
    },
    { title: '文件类型', dataIndex: 'fileType', key: 'fileType' },
    { title: '修改时间', dataIndex: 'modifyTime', key: 'modifyTime' },
    { title: '修改人', dataIndex: 'modifyBy', key: 'modifyBy' },
    {
      title: '操作',
      key: 'action',
      width: 88,
      render: (_, record) => (
        <Button
          danger
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => setDeleteAttachmentRow(record)}
        />
      ),
    },
  ]

  return (
    <>
      <Card key={section.title} title={section.title} size="small">
        <Form layout="vertical" className="v2-form-labels">
          <Row gutter={16}>
            {renderFieldsWithGroupedRepairSwitches(
              section.fields,
              renderField,
              section.title,
              attachedItemType,
              onAttachedItemTypeChange,
              onDirty,
            )}
          </Row>
        </Form>

        {/* 附件信息表格 */}
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text strong>
              <span style={{ marginRight: 8 }}>📎</span>附件信息
            </Text>
            <Button type="link" icon={<span>+</span>} onClick={() => setAttachmentModalOpen(true)}>
              添加附件
            </Button>
          </div>
          <Table
            rowKey="key"
            columns={attachmentColumns}
            dataSource={attachmentData}
            pagination={false}
            size="small"
            scroll={{ x: 800 }}
          />
        </div>
      </Card>

      <Modal
        open={attachmentModalOpen}
        title="添加附件"
        onCancel={() => setAttachmentModalOpen(false)}
        mask={{ closable: false }}
        footer={[
          <Button key="cancel" onClick={() => setAttachmentModalOpen(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={() => { onDirty?.(); setAttachmentModalOpen(false) }}>上传</Button>,
        ]}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="文件标题" required>
            <Input placeholder="请输入文件标题" onChange={() => onDirty?.()} />
          </Form.Item>
          <Form.Item label="选择文件" required>
            <Input type="file" onChange={() => onDirty?.()} />
          </Form.Item>
          <Form.Item label="备注">
            <TextArea rows={3} placeholder="请输入备注信息" onChange={() => onDirty?.()} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        open={Boolean(deleteAttachmentRow)}
        title="确认删除附件"
        onCancel={() => setDeleteAttachmentRow(undefined)}
        mask={{ closable: false }}
        footer={[
          <Button key="cancel" onClick={() => setDeleteAttachmentRow(undefined)}>取消</Button>,
          <Button key="delete" danger type="primary" onClick={() => deleteAttachment(deleteAttachmentRow?.key ?? '')}>删除</Button>,
        ]}
        width={520}
      >
        确认删除附件“{deleteAttachmentRow?.title}”吗？删除后不可恢复。
      </Modal>
    </>
  )
}

function ConsultationInfoSection({
  section,
  renderField,
  onDirty,
}: {
  section: { title: string; fields: ModuleField[] }
  renderField: (field: ModuleField) => React.ReactNode
  onDirty?: () => void
}) {
  const needConsultationField = findField(section.fields, '是否需要咨询')
  const consultationNoField = findField(section.fields, '咨询单号')
  const typeField = findField(section.fields, '事项类型')
  const initialType = Array.isArray(typeField?.value) ? typeField.value[0] : (typeField?.value ?? '一般咨询')
  const typeOptions = typeField?.options?.length ? typeField.options : ['一般咨询', '客户确认']
  const initialNeedConsultation = isSwitchOn(
    Array.isArray(needConsultationField?.value) ? needConsultationField.value.join(',') : (needConsultationField?.value ?? ''),
  )
  const initialConsultationNo = String(
    Array.isArray(consultationNoField?.value) ? consultationNoField.value.join(',') : (consultationNoField?.value ?? ''),
  ).trim()

  const [consultationType, setConsultationType] = useState(initialType)
  const [needConsultation, setNeedConsultation] = useState(initialNeedConsultation)
  const [consultationNo, setConsultationNo] = useState(initialConsultationNo)
  useEffect(() => {
    if (initialNeedConsultation && !initialConsultationNo) {
      setConsultationNo(`CONS-${dayjs().format('YYYYMMDD')}-${String(Date.now() % 1000).padStart(3, '0')}`)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const [confirmationRows, setConfirmationRows] = useState<CustomerConfirmationRow[]>([
    { key: '1', content: '请客户确认更换镜片及对应费用。', status: '待确认' },
  ])
  const [editingConfirmationRow, setEditingConfirmationRow] = useState<CustomerConfirmationRow>()
  const consultationMainFields = section.fields.filter(
    (field) => !['是否需要咨询', '咨询单号'].includes(field.key) && !['是否需要咨询', '咨询单号'].includes(field.label),
  )

  const updateConfirmationRow = (key: string, data: Partial<CustomerConfirmationRow>) => {
    setConfirmationRows((rows) => rows.map((row) => row.key === key ? { ...row, ...data } : row))
    onDirty?.()
  }

  const deleteConfirmationRow = (key: string) => {
    setConfirmationRows((rows) => rows.filter((row) => row.key !== key))
    onDirty?.()
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
      onDirty?.()
    }

    setEditingConfirmationRow(undefined)
  }

  const renderConsultationField = (field: ModuleField) => {
    if (field.key === '事项类型' || field.label === '事项类型') {
      return (
        <Select
          className="app-form-select"
          style={appFormSelectStyle}
          value={consultationType}
          onChange={(value) => {
            setConsultationType(value)
            onDirty?.()
          }}
          options={typeOptions.map((value) => ({ value, label: value }))}
        />
      )
    }

    return renderField(field)
  }

  const confirmationColumns: ColumnsType<CustomerConfirmationRow> = [
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      render: (value: string) => <Text>{value || '-'}</Text>,
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
          <Text type="secondary">暂无图片</Text>
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
    {
      title: '操作',
      key: 'action',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <Space size={4}>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => setEditingConfirmationRow({ ...record, imageUrls: [...(record.imageUrls ?? [])] })}
          />
          <Button
            danger
            type="link"
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => deleteConfirmationRow(record.key)}
          />
        </Space>
      ),
    },
  ]

  return (
    <>
      <Card key={section.title} title={section.title} size="small">
        <Form layout="vertical" className="v2-form-labels">
          <Row gutter={16}>
            <Col key={`${section.title}-consultation-toggle-group`} xs={24} md={12} style={{ marginBottom: 16 }}>
              <Space size={32} align="start">
                <Form.Item label={needConsultationField?.label ?? '是否需要咨询'} style={{ marginBottom: 0 }}>
                  <Switch
                    checked={needConsultation}
                    onChange={(checked) => {
                      setNeedConsultation(checked)
                      onDirty?.()
                      if (checked && !consultationNo) {
                        setConsultationNo(createConsultationNo())
                      }
                    }}
                  />
                </Form.Item>
                <Form.Item label={consultationNoField?.label ?? '咨询单号'} style={{ marginBottom: 0 }}>
                  {needConsultation && consultationNo ? (
                    <Link to={`/service/consultation/${consultationNo}`}>{consultationNo}</Link>
                  ) : (
                    <Text type="secondary">-</Text>
                  )}
                </Form.Item>
              </Space>
            </Col>
            {renderFieldsWithGroupedRepairSwitches(
              consultationMainFields,
              renderConsultationField,
              section.title,
              undefined,
              undefined,
              onDirty,
            )}
          </Row>
        </Form>

        {consultationType === '客户确认' ? (
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text className="ticket-confirmation-title">客户确认事项</Text>
              <Button type="link" icon={<PlusOutlined />} onClick={openAddConfirmationRow}>添加</Button>
            </div>
            <Table
              rowKey="key"
              columns={confirmationColumns}
              dataSource={confirmationRows}
              pagination={false}
              size="small"
              scroll={{ x: '100%' }}
            />
          </div>
        ) : null}
      </Card>

      <Modal
        open={Boolean(editingConfirmationRow)}
        title={editingConfirmationRow?.key ? '编辑客户确认事项' : '添加客户确认事项'}
        onCancel={() => setEditingConfirmationRow(undefined)}
        onOk={saveEditingConfirmationRow}
        mask={{ closable: false }}
        okText="保存"
        cancelText="取消"
      >
        <Form layout="vertical" className="v2-form-labels">
          <Form.Item label="内容">
            <TextArea
              rows={4}
              value={editingConfirmationRow?.content}
              placeholder="请输入客户确认内容"
              onChange={(event) => {
                onDirty?.()
                setEditingConfirmationRow((row) => row ? { ...row, content: event.target.value } : row)
              }}
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
                onDirty?.()
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
                onDirty?.()
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

export function TicketDetailPage() {
  const { id } = useParams()
  const { messages } = useI18n()
  const [row, setRow] = useState<ModuleRow | null>(null)
  const [sections, setSections] = useState<ModuleSection[]>([])
  const [loading, setLoading] = useState(true)
  const { helpers } = useTicketStatus()
  const [parentBreadcrumbLabel, currentBreadcrumbLabel] = getNavigationBreadcrumbLabels(messages, '/ticket/list', [
    '工单管理',
    '工单列表',
  ])
  const initialFlowView = resolveTicketFlowView(row, helpers)
  const currentFlowSpecialDescription = initialFlowView.specialDescription
  const [headerOwner, setHeaderOwner] = useState('张经理')
  const reviewMainStatus = helpers?.TICKET_MAIN_STATUS_ORDER[0] ?? 'REVIEW'
  const processMainStatus = helpers?.TICKET_MAIN_STATUS_ORDER[5] ?? 'PROCESS'
  const reviewSubStatuses = helpers?.TICKET_STATUS_GROUP_MAP[reviewMainStatus] ?? []
  const processSubStatuses = helpers?.TICKET_STATUS_GROUP_MAP[processMainStatus] ?? []
  const reviewStatusOptions = [
    reviewSubStatuses[2],
    reviewSubStatuses[3],
  ] as TicketSubStatus[]
  const reviewRejectedStatus = reviewStatusOptions[1]
  const processStatusOptions = [
    processSubStatuses[2],
    processSubStatuses[1],
  ] as TicketSubStatus[]
  const processRepairingStatus = processStatusOptions[1]
  const hasPendingInventoryRequest = initialFlowView.hasPendingInventoryRequest
  const [stepFlowMainStatus, setStepFlowMainStatus] = useState<TicketMainStatus>(initialFlowView.mainStatus)
  const [stepFlowStatus, setStepFlowStatus] = useState(initialFlowView.subStatus)
  const [flowSteps, setFlowSteps] = useState<TicketFlowStepRecord[]>([])
  const [stepFlowUpdating, setStepFlowUpdating] = useState(false)
  const [reviewRejectModalOpen, setReviewRejectModalOpen] = useState(false)
  const [reviewRejectReason, setReviewRejectReason] = useState('')
  const [pendingReviewStatus, setPendingReviewStatus] = useState<TicketSubStatus | null>(null)
  const [attachedItemType, setAttachedItemType] = useState<string>()
  const [activeTicketTabKey, setActiveTicketTabKey] = useState('summary')
  const [loadedTicketTabKeys, setLoadedTicketTabKeys] = useState<Set<string>>(() => new Set(['summary']))
  const [ticketTabLoading, setTicketTabLoading] = useState(false)
  const ticketTabLoadingTimerRef = useRef<number | undefined>(undefined)
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false)
  const [addRepairItemModalOpen, setAddRepairItemModalOpen] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const markDirty = useCallback(() => setHasUnsavedChanges(true), [])
  const handleSave = useCallback(() => {
    setHasUnsavedChanges(false)
    message.success('保存成功')
  }, [])
  useBeforeUnload((event) => {
    if (!hasUnsavedChanges) return
    event.preventDefault()
    event.returnValue = ''
  })

  useEffect(() => {
    if (!hasUnsavedChanges) return

    const handleDocumentClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const target = event.target
      if (!(target instanceof Element)) return

      const anchor = target.closest('a[href]')
      if (!(anchor instanceof HTMLAnchorElement)) return

      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return
      if (anchor.target && anchor.target !== '_self') return

      const nextUrl = new URL(anchor.href, window.location.href)
      const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`
      const nextPath = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`
      if (nextUrl.origin !== window.location.origin || nextPath === currentPath) return

      if (!window.confirm('当前编辑内容还没有提交，确定要离开当前页面吗？')) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        setHasUnsavedChanges(false)
      }
    }

    document.addEventListener('click', handleDocumentClick, true)
    return () => document.removeEventListener('click', handleDocumentClick, true)
  }, [hasUnsavedChanges])

  useEffect(() => {
    if (!id) {
      setRow(null)
      setSections([])
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    Promise.all([getTicketDetail(id), getTicketDetailSections()])
      .then(([detailRes, sectionRes]) => {
        if (cancelled) return
        setRow(detailRes.code === 200 ? (detailRes.data ?? null) : null)
        setSections(sectionRes.code === 200 && sectionRes.data ? sectionRes.data : [])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [id])

  useEffect(() => {
    const nextFlowView = resolveTicketFlowView(row, helpers)
    setStepFlowStatus(nextFlowView.subStatus)
    setStepFlowMainStatus(nextFlowView.mainStatus)
  }, [helpers, row])

  useEffect(() => {
    if (!id) return
    let cancelled = false
    getTicketFlowSteps(id).then((res) => {
      if (cancelled || res.code !== 200 || !res.data) return
      setFlowSteps(res.data.steps)
      setStepFlowMainStatus(res.data.currentMainStatus)
      setStepFlowStatus(res.data.currentSubStatus)
    })
    return () => { cancelled = true }
  }, [id])

  const renderFieldWithDirty = useCallback((field: ModuleField) => renderField(field, markDirty), [markDirty])

  const headerOwnerOptions = HEADER_OWNER_OPTIONS
  const headerOwnerMenuItems = headerOwnerOptions.map((value) => ({
    key: value,
    label: value,
  }))

  const mappedSections = useMemo<ModuleSection[]>(() => {
    if (!row) return sections

    const getRowString = (key: string) => {
      const value = (row as ModuleRow)[key]
      return typeof value === 'string' || typeof value === 'number' ? String(value) : ''
    }
    const statusValue = getRowString('status')
    const statusLabel = helpers?.TICKET_STATUS_LABEL_MAP?.[statusValue] ?? statusValue
    const hasPayment = getRowString('paymentDate') && getRowString('paymentDate') !== '-'
    const hasOutbound = getRowString('outboundCompletedAt') && getRowString('outboundCompletedAt') !== '-'

    const fieldValueByKey: Record<string, string> = {
      工单编号: getRowString('ticketNo'),
      客户姓名: getRowString('customerName'),
      电话号码: getRowString('phone'),
      邮箱: getRowString('email'),
      收货地址: getRowString('customerReturnAddress'),
      接收日期: getRowString('receivedAt'),
      受理渠道: getRowString('channel'),
      购买渠道: getRowString('channel'),
      运单号: getRowString('customerInboundTrackingNo'),
      物流单号: getRowString('customerInboundTrackingNo'),
      物流状态: statusLabel,
      产品名称: getRowString('productName'),
      总部入库日期: getRowString('headOfficeInboundDate'),
      预计出库日期: getRowString('estimatedOutboundDate'),
      维修处: getRowString('repairExecutor'),
      维修内容: getRowString('repairContent'),
      咨询状态: statusLabel,
      支付完成状态: hasPayment ? 'on' : 'off',
      支付日期: getRowString('paymentDate'),
      是否出库完成: hasOutbound ? 'on' : 'off',
      出库方式: getRowString('outboundMethod'),
      配送完成: hasOutbound ? 'on' : 'off',
      配送日期: getRowString('outboundCompletedAt'),
      出库完成日期: getRowString('outboundCompletedAt'),
    }

    return sections.map((section) => ({
      ...section,
      fields: section.fields.map((field) => {
        const byKey = Object.prototype.hasOwnProperty.call(fieldValueByKey, field.key)
        const byLabel = Object.prototype.hasOwnProperty.call(fieldValueByKey, field.label)
        if (!byKey && !byLabel) return field
        const mappedValue = byKey ? fieldValueByKey[field.key] : fieldValueByKey[field.label]
        return { ...field, value: mappedValue }
      }),
    }))
  }, [helpers, row, sections])

  const normalizeTitle = (s: string) => s.replace(/\s+/g, '').replace(/（|）/g, '')
  const findSection = (name: string) => mappedSections.find((s) => normalizeTitle(s.title).includes(normalizeTitle(name)))
  const leftGroupNames = ['客户信息', '寄件信息', '受理信息', '咨询/确认信息']
  const rightGroupNames = ['产品信息', '维修信息', '支付信息', '出库信息']
  const leftSections = leftGroupNames.map(findSection).filter((v): v is NonNullable<typeof v> => Boolean(v))
  const rightSections = rightGroupNames.map(findSection).filter((v): v is NonNullable<typeof v> => Boolean(v))

  if (loading) return <Card loading style={{ margin: 16 }} />
  if (!row) return <Card>未找到工单详情</Card>

  const originalTicketNo = String(row.originalTicketNo ?? '')
  const handleTicketTabChange = (key: string) => {
    if (key === activeTicketTabKey) return

    const hasLoadedTab = loadedTicketTabKeys.has(key)

    if (ticketTabLoadingTimerRef.current) {
      window.clearTimeout(ticketTabLoadingTimerRef.current)
    }

    setActiveTicketTabKey(key)
    setTicketTabLoading(!hasLoadedTab)

    if (hasLoadedTab) return

    ticketTabLoadingTimerRef.current = window.setTimeout(() => {
      setLoadedTicketTabKeys((keys) => new Set(keys).add(key))
      setTicketTabLoading(false)
    }, 320)
  }
  const renderTicketTabContent = (key: string, content: React.ReactNode) =>
    ticketTabLoading && activeTicketTabKey === key ? <Card loading style={{ margin: '8px 0' }} /> : content

  const priceItemColumns: ColumnsType<PriceItemRow> = [
    { title: 'No.', dataIndex: 'no', key: 'no', width: 70, align: 'center' },
    { title: '产品编码', dataIndex: 'productCode', key: 'productCode', width: 120, render: (v) => <span style={{ color: '#94a3b8' }}>{v}</span> },
    { title: '产品', dataIndex: 'product', key: 'product', render: (v) => <span style={{ fontWeight: 500 }}>{v}</span> },
    {
      title: '计划数量',
      dataIndex: 'planQty',
      key: 'planQty',
      width: 140,
      align: 'center',
      render: () => (
        <Space>
          <InputNumber min={0} defaultValue={1} style={{ width: 60 }} />
          <Select defaultValue="ea" style={{ width: 70 }} options={[{ value: 'ea', label: 'ea' }]} />
        </Space>
      ),
    },
    { title: '实际数量', dataIndex: 'actualQty', key: 'actualQty', width: 110, align: 'center' },
    { title: '计划总计', dataIndex: 'planTotal', key: 'planTotal', width: 100, align: 'right' },
    { title: '实际总计', dataIndex: 'actualTotal', key: 'actualTotal', width: 100, align: 'right', render: (v) => <span style={{ color: '#1677ff' }}>{v}</span> },
    {
      title: '维修类型',
      dataIndex: 'repairType',
      key: 'repairType',
      width: 160,
      render: (v) => <Tag color="blue">{v}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      align: 'center',
      render: () => (
        <Button type="text" danger size="large" icon={<span>🗑</span>} />
      ),
    },
  ]
  const priceItemData: PriceItemRow[] = [
    {
      key: '1',
      no: '1',
      productCode: 'P000123',
      product: 'GM Sunglasses A01',
      planQty: '1 ea',
      actualQty: '1',
      planTotal: '',
      actualTotal: '',
      repairType: '售后服务 - 电镀',
    },
  ]

  const priceFactorColumns: ColumnsType<PriceFactorRow> = [
    { title: '价格组成要素', dataIndex: 'code', key: 'code', width: 120, render: (v) => <span style={{ fontFamily: 'monospace' }}>{v}</span> },
    { title: '明细', dataIndex: 'name', key: 'name', render: (v) => <span style={{ fontWeight: 500 }}>{v}</span> },
    { title: '状态', dataIndex: 'status', key: 'status', width: 90, align: 'center' },
    {
      title: '手动添加/更改',
      dataIndex: 'manual',
      key: 'manual',
      width: 120,
      align: 'center',
      render: () => <Switch size="small" />,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 140,
      align: 'right',
      render: () => (
        <Space>
          <InputNumber min={0} defaultValue={0} style={{ width: 80 }} />
          <Select defaultValue="元" style={{ width: 60 }} options={[{ value: '元', label: '元' }]} />
        </Space>
      ),
    },
    {
      title: '目标',
      dataIndex: 'target',
      key: 'target',
      width: 120,
      align: 'center',
      render: () => (
        <Space>
          <InputNumber min={0} defaultValue={1} style={{ width: 60 }} />
          <Select defaultValue="ea" style={{ width: 60 }} options={[{ value: 'ea', label: 'ea' }]} />
        </Space>
      ),
    },
    { title: '价格组成要素值', dataIndex: 'value', key: 'value', width: 120, align: 'right', render: (v) => <span style={{ color: '#94a3b8' }}>{v}</span> },
    {
      title: '操作',
      key: 'action',
      width: 80,
      align: 'center',
      render: () => (
        <Button type="text" danger size="large" icon={<span>🗑</span>} />
      ),
    },
  ]
  const priceFactorData: PriceFactorRow[] = [
    {
      key: '1',
      code: 'ZP01',
      name: '销售价格（消费者价格）',
      status: '',
      manual: '☐',
      amount: '0.0 元',
      target: '1 ea',
      value: '0',
    },
  ]

  const noticeColumns: ColumnsType<NoticeRow> = [
    { title: '发送时间', dataIndex: 'sendTime', key: 'sendTime', width: 180 },
    { title: '通知类型', dataIndex: 'noticeType', key: 'noticeType', width: 120 },
    { title: '接收人', dataIndex: 'receiver', key: 'receiver', width: 220 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (v: string) => <Tag color={v === '发送成功' ? 'green' : 'default'}>{v}</Tag>,
    },
    { title: '内容摘要', dataIndex: 'summary', key: 'summary' },
  ]
  const noticeData: NoticeRow[] = [
    {
      key: '1',
      sendTime: '2023-11-02 10:30:45',
      noticeType: '短信 (SMS)',
      receiver: 'Jameson Vance / 138-8822-1922',
      status: '发送成功',
      summary: '合作企业维修延迟',
    },
  ]

  const logColumns: ColumnsType<TicketLogRow> = [
    { title: '编号', dataIndex: 'no', key: 'no', width: 90 },
    { title: '操作时间', dataIndex: 'opTime', key: 'opTime', width: 180 },
    { title: '操作人', dataIndex: 'operator', key: 'operator', width: 160 },
    { title: '操作内容', dataIndex: 'action', key: 'action', width: 120 },
    { title: '备注 / 详情', dataIndex: 'detail', key: 'detail' },
  ]
  const logData: TicketLogRow[] = [
    { key: '1', no: '00012', opTime: '2023-11-01 15:30:45', operator: 'Jameson Vance', action: '创建工单', detail: '门店受理完成，进入维修分拣流程。' },
    { key: '2', no: '00013', opTime: '2023-11-01 16:15:22', operator: '张经理', action: '状态更新', detail: '状态由 待处理 变更为 处理中。' },
    { key: '3', no: '00014', opTime: '2023-11-02 09:30:00', operator: '系统', action: '消息通知', detail: '已发送 [受理] 门店受理完成 (SMS: +86 138****1922)' },
    { key: '4', no: '00015', opTime: '2023-11-02 11:00:12', operator: 'Jameson Vance', action: '附件更新', detail: '上传并关联了客户签名图片。' },
  ]

  const requestStepFlowStatusUpdate = async (nextStatus: TicketSubStatus, rejectReason?: string): Promise<TicketSubStatus> => {
    // 这里先用 mock 模拟接口耗时，后续可替换为真实 fetch/axios 请求
    void rejectReason
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 280)
    })
    return nextStatus
  }

  const stepFlowMenuOptions: TicketSubStatus[] =
    stepFlowMainStatus === reviewMainStatus
      ? reviewStatusOptions
      : stepFlowMainStatus === processMainStatus
        ? processStatusOptions
        : []

  const stepFlowMenuItems: MenuProps['items'] = [
    {
      type: 'group',
      label: helpers?.TICKET_STATUS_LABEL_MAP?.[stepFlowMainStatus] ?? stepFlowMainStatus,
      children: stepFlowMenuOptions.map((status) => ({
        key: status,
        label: helpers?.TICKET_STATUS_LABEL_MAP?.[status] ?? status,
        disabled:
          stepFlowUpdating ||
          status === stepFlowStatus,
      })),
    },
  ]

  const handleStepFlowChange = async (nextStatus: TicketSubStatus, rejectReason?: string) => {
    if (stepFlowUpdating || nextStatus === stepFlowStatus) return
    setStepFlowUpdating(true)

    try {
      const latestStatus = await requestStepFlowStatusUpdate(nextStatus, rejectReason)
      const nextMainStatus = helpers?.getTicketMainStatusBySubStatus(latestStatus) ?? stepFlowMainStatus
      setStepFlowStatus(latestStatus)
      setStepFlowMainStatus(nextMainStatus)
      setFlowSteps((prevSteps) => {
        const updatedSteps = prevSteps.map((step) =>
          step.mainStatus === nextMainStatus
            ? { ...step, subStatus: latestStatus, completedAt: null, operator: null }
            : step,
        )

        if (updatedSteps.some((step) => step.mainStatus === nextMainStatus)) {
          return updatedSteps
        }

        return [
          ...updatedSteps,
          {
            mainStatus: nextMainStatus,
            subStatus: latestStatus,
            completedAt: null,
            operator: null,
          },
        ]
      })
      markDirty()
    } catch (error) {
      console.error(error)
      message.error('状态更新失败，请稍后重试')
    } finally {
      setStepFlowUpdating(false)
    }
  }

  const handleStepStatusSelect = (nextStatus: TicketSubStatus) => {
    if (stepFlowUpdating || nextStatus === stepFlowStatus) return
    if (
      stepFlowMainStatus === processMainStatus &&
      nextStatus === processRepairingStatus &&
      hasPendingInventoryRequest
    ) {
      message.warning('库存申请未完成，不能更改状态')
      return
    }
    if (stepFlowMainStatus === reviewMainStatus && nextStatus === reviewRejectedStatus) {
      setPendingReviewStatus(nextStatus)
      setReviewRejectReason('')
      setReviewRejectModalOpen(true)
      return
    }

    setPendingReviewStatus(null)
    window.setTimeout(() => {
      void handleStepFlowChange(nextStatus)
    }, 0)
  }

  const stepFlowMenuProps: MenuProps = {
    items: stepFlowMenuItems,
    selectable: true,
    selectedKeys: stepFlowMenuOptions.includes(stepFlowStatus) ? [stepFlowStatus] : [],
    onClick: ({ key }) => {
      handleStepStatusSelect(key as TicketSubStatus)
    },
  }

  const handleReviewRejectConfirm = () => {
    if (!pendingReviewStatus) {
      setReviewRejectModalOpen(false)
      return
    }
    const reason = reviewRejectReason.trim()
    if (!reason) {
      message.warning('请填写审核不通过原因')
      return
    }
    setReviewRejectModalOpen(false)
    setPendingReviewStatus(null)
    window.setTimeout(() => {
      void handleStepFlowChange(reviewRejectedStatus, reason)
    }, 0)
  }

  const handleReviewRejectCancel = () => {
    setReviewRejectModalOpen(false)
    setPendingReviewStatus(null)
    setReviewRejectReason('')
  }

  const currentMainStatus: TicketMainStatus = stepFlowMainStatus
  const currentStepIndex = helpers?.TICKET_MAIN_STATUS_ORDER.indexOf(currentMainStatus) ?? -1


  return (
    <div className="app-page-stack" onChangeCapture={markDirty}>
      <Row className="app-sticky-page-bar" justify="space-between" align="middle">
        <Col>
          <Breadcrumb
            items={[
              { title: parentBreadcrumbLabel },
              { title: <Link to="/ticket/list">{currentBreadcrumbLabel}</Link> },
              { title: messages.ticket.detail },
            ]}
          />
        </Col>
        <Col>
          <Space>
            <Button>条码打印</Button>
            <Button disabled={!attachedItemType}>随附物品退回</Button>
            <Button onClick={() => setInventoryModalOpen(true)}>库存申请</Button>
            <Button>工单复制</Button>
            <Button type="primary" onClick={handleSave}>保存</Button>
          </Space>
        </Col>
      </Row>

      <Card>
        <Space orientation="vertical" size={8} style={{ width: '100%' }}>
          <Row gutter={24} align="middle" wrap={false}>
            <Col flex="none">
              <Space align="center" size={12}>
                <Title level={2} style={{ margin: 0 }}>{String(row.ticketNo ?? row.id ?? '115001')}</Title>
              </Space>
            </Col>
            <Col flex="auto" style={{ display: 'flex', alignItems: 'center' }}>
              <Steps
                className="ticket-header-steps"
                size="small"
                current={currentStepIndex}
                items={(helpers?.TICKET_MAIN_STATUS_ORDER ?? []).map((mainStatus) => {
                  const isCurrent = mainStatus === currentMainStatus
                  const label = helpers?.TICKET_STATUS_LABEL_MAP?.[mainStatus] ?? mainStatus
                  const flowStep = flowSteps.find((s) => s.mainStatus === mainStatus)
                  const subLabel = flowStep?.subStatus ? (helpers?.TICKET_STATUS_LABEL_MAP?.[flowStep.subStatus] ?? flowStep.subStatus) : ''
                  const title = isCurrent && subLabel ? `${label}（${subLabel}）` : label

                  const showDropdown = isCurrent && (mainStatus === reviewMainStatus || mainStatus === processMainStatus)
                  const titleNode = showDropdown ? (
                    <Dropdown trigger={['click']} menu={stepFlowMenuProps} disabled={stepFlowUpdating}>
                      <Typography.Link>
                        <Space>
                          {title}
                          {stepFlowUpdating ? <LoadingOutlined /> : <DownOutlined className="ticket-step-flow-arrow" />}
                        </Space>
                      </Typography.Link>
                    </Dropdown>
                  ) : title

                  const baseItem = {
                    title: titleNode,
                    icon: <span className="step-icon">{mainStatusStepIcons[mainStatus]}</span>,
                  }

                  const descriptionNode =
                    mainStatus === processMainStatus && isCurrent && currentFlowSpecialDescription ? (
                      <div style={{ minHeight: 32, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Alert
                          type="warning"
                          showIcon
                          style={{ padding: '4px 8px' }}
                          title={currentFlowSpecialDescription}
                        />
                      </div>
                    ) : (
                      <div style={{ minHeight: 32, visibility: 'hidden' }} aria-hidden>
                        &nbsp;
                      </div>
                    )

                  return {
                    ...baseItem,
                    description: descriptionNode,
                  }
                })}
              />
            </Col>
          </Row>
          
          <Row gutter={24} align="middle" wrap={false}>
            {originalTicketNo ? (
              <Col>
                <Text>
                  原工单：
                  <Link to={`/ticket/list/${originalTicketNo}`}>{originalTicketNo}</Link>
                </Text>
              </Col>
            ) : null}
            <Col>
              <Dropdown
                trigger={['click']}
                menu={{
                  items: headerOwnerMenuItems,
                  selectedKeys: [headerOwner],
                  onClick: ({ key }) => {
                    setHeaderOwner(String(key))
                    markDirty()
                  },
                }}
              >
                <Space size="small" style={{ cursor: 'pointer' }}>
                  负责人：{headerOwner} <DownOutlined className="app-dropdown-menu-arrow" />
                </Space>
              </Dropdown>
            </Col>
            <Col>
            <Text>SO 文件编号：SO-8829011</Text>
            </Col>

          </Row>
        </Space>
      </Card>

      <Card>
        <Tabs
          destroyOnHidden={false}
          animated={false}
          activeKey={activeTicketTabKey}
          onChange={handleTicketTabChange}
          items={[
            {
              key: 'summary',
              label: '概要',
              children: renderTicketTabContent('summary', (
                <Space orientation="vertical" size={16} style={{ width: '100%' }}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} xl={12}>
                      <Space orientation="vertical" size={16} style={{ width: '100%' }}>
                        {leftSections.map((section) => {
                          const sectionRenderKey = `${String(row.id ?? row.ticketNo ?? 'ticket')}-${section.title}`
                          return (
                          normalizeTitle(section.title).includes(normalizeTitle('客户信息')) ? (
                            <CustomerInfoSection key={sectionRenderKey} section={section} renderField={renderFieldWithDirty} onDirty={markDirty} />
                          ) : normalizeTitle(section.title).includes(normalizeTitle('受理信息')) ? (
                            <AcceptanceInfoSection
                              key={sectionRenderKey}
                              section={section}
                              renderField={renderFieldWithDirty}
                              attachedItemType={attachedItemType}
                              onAttachedItemTypeChange={(value) => {
                                setAttachedItemType(value)
                                markDirty()
                              }}
                              onDirty={markDirty}
                            />
                          ) : normalizeTitle(section.title).includes(normalizeTitle('咨询/确认信息')) ? (
                            <ConsultationInfoSection key={sectionRenderKey} section={section} renderField={renderFieldWithDirty} onDirty={markDirty} />
                          ) : (
                            <Card key={sectionRenderKey} title={section.title} size="small">
                              <Form layout="vertical" className="v2-form-labels">
                                <Row gutter={16}>
                                  {renderFieldsWithGroupedRepairSwitches(
                                    section.fields,
                                    renderFieldWithDirty,
                                    section.title,
                                    undefined,
                                    undefined,
                                    markDirty,
                                  )}
                                </Row>
                              </Form>
                            </Card>
                          )
                        )})}
                      </Space>
                    </Col>
                    <Col xs={24} xl={12}>
                      <Space orientation="vertical" size={16} style={{ width: '100%' }}>
                        {rightSections.map((section) => {
                          const sectionRenderKey = `${String(row.id ?? row.ticketNo ?? 'ticket')}-${section.title}`
                          return (
                          <Card key={sectionRenderKey} title={section.title} size="small">
                            <Form layout="vertical" className="v2-form-labels">
                              <Row gutter={16}>
                                {renderFieldsWithGroupedRepairSwitches(
                                  section.fields,
                                  renderFieldWithDirty,
                                  section.title,
                                  undefined,
                                  undefined,
                                  markDirty,
                                )}
                              </Row>
                            </Form>
                          </Card>
                        )})}
                      </Space>
                    </Col>
                  </Row>
                </Space>
              )),
            },
            {
              key: 'fees',
              label: '定价',
              children: renderTicketTabContent('fees', (
                <Space orientation="vertical" size={16} style={{ width: '100%' }}>
                  <Card
                    title="品目"
                    size="small"
                    extra={
                      <Space>
                        <Button type="link" style={{ padding: 0 }} onClick={() => setAddRepairItemModalOpen(true)}>+ 添加</Button>
                        <Button type="link" style={{ padding: 0 }}>请求外部价格</Button>
                      </Space>
                    }
                  >
                    <Table rowKey="key" columns={priceItemColumns} dataSource={priceItemData} pagination={false} scroll={{ x: 1200 }} />
                  </Card>
                  <Card title="品目价格设置" size="small">
                    <Table rowKey="key" columns={priceFactorColumns} dataSource={priceFactorData} pagination={false} scroll={{ x: 1200 }} />
                  </Card>
                </Space>
              )),
            },
            {
              key: 'notifications',
              label: '通知',
              children: renderTicketTabContent('notifications', (
                <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <NoticeSendAction />
                  </div>
                  <Table rowKey="key" columns={noticeColumns} dataSource={noticeData} pagination={false} scroll={{ x: 1000 }} />
                </Space>
              )),
            },
            {
              key: 'logs',
              label: '日志',
              children: renderTicketTabContent('logs', (
                <Table rowKey="key" columns={logColumns} dataSource={logData} pagination={false} scroll={{ x: 1000 }} />
              )),
            },
          ]}
        />
      </Card>

      <InventoryRequestModal
        open={inventoryModalOpen}
        onClose={() => setInventoryModalOpen(false)}
      />

      <AddRepairItemModal
        open={addRepairItemModalOpen}
        onClose={() => setAddRepairItemModalOpen(false)}
      />

      <Modal
        open={reviewRejectModalOpen}
        title="审核不通过"
        onOk={handleReviewRejectConfirm}
        onCancel={handleReviewRejectCancel}
        okText="确认"
        cancelText="取消"
        mask={{ closable: false }}
        destroyOnHidden
      >
        <Form layout="vertical" className="v2-form-labels">
          <Form.Item label="不通过原因" required>
            <TextArea
              rows={4}
              maxLength={200}
              value={reviewRejectReason}
              onChange={(event) => setReviewRejectReason(event.target.value)}
              placeholder="请输入审核不通过原因"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
