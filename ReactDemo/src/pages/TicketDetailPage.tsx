import { Breadcrumb, Button, Card, Checkbox, Col, DatePicker, Dropdown, Form, Image, Input, InputNumber, Modal, Row, Segmented, Select, Space, Steps, Switch, Table, Tabs, Tag, Typography, Upload, message } from 'antd'
import {
  CheckCircleOutlined,
  CreditCardOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  FileTextOutlined,
  InboxOutlined,
  PlusOutlined,
  SolutionOutlined,
  ToolOutlined,
  TruckOutlined,
} from '@ant-design/icons'
import { Alert } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import type { CSSProperties } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useBeforeUnload, useBlocker, useParams } from 'react-router-dom'
import addressBookIcon from '../assets/address-book.svg'
import { defaultProductOptions, ProductSearchSelect } from '../components/ProductSearchSelect'
import type { ModuleField } from '../services/api'
import { useModuleData } from '../hooks/useModuleData'
import { useI18n } from '../i18n/context'
import { getNavigationBreadcrumbLabels } from '../utils/navigationI18n'

const { TextArea } = Input
const { Text, Title } = Typography

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

type InventoryItem = {
  key: string
  productName: string
  quantity: number
  reason: string
}

type AttachmentRow = {
  key: string
  title: string
  fileType: string
  modifyTime: string
  modifyBy: string
}

type CustomerConfirmationRow = {
  key: string
  content: string
  imageUrls?: string[]
  status: string
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
      maskClosable={false}
      okText="确认申请"
      cancelText="取消"
      width={800}
      destroyOnClose={false}
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

const repairTypeOptions = [
  { value: '电镀', label: '售后服务 - 电镀' },
  { value: '更换', label: '售后服务 - 更换' },
  { value: '抛光', label: '售后服务 - 抛光' },
  { value: '清洗', label: '售后服务 - 清洗' },
]

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
      maskClosable={false}
      okText="保存"
      cancelText="取消"
      width={600}
      destroyOnClose
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
              {repairTypeOptions.map(option => (
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

  const smsTemplates = [
    '-',
    '[受理] 门店受理完成',
    '[通知] 配件退回',
    '[判定] 产品更换',
    '[咨询] 合作企业维修延迟通知',
    '[通知] 维修取消',
    '[通知] 到达门店及领取',
    '[通知] 门店领取完成',
  ]

  const emailTemplates = [
    '-',
    '[受理]门店已收到受理',
    '[通知]未付款返送',
    '[检查]产品更换',
    '[咨询]合作伙伴修理延迟通知',
    '[检查]维修已取消',
    '[通知] 已抵达门店并接收',
    '[通知]门店取货完成',
  ]

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
        maskClosable={false}
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

type PriceItemRow = {
  key: string
  no: string
  productCode: string
  product: string
  planQty: string
  actualQty: string
  planTotal: string
  actualTotal: string
  repairType: string
}

type PriceFactorRow = {
  key: string
  code: string
  name: string
  status: string
  manual: string
  amount: string
  target: string
  value: string
}

type NoticeRow = {
  key: string
  sendTime: string
  noticeType: string
  receiver: string
  status: string
  summary: string
}

type LogRow = {
  key: string
  no: string
  opTime: string
  operator: string
  action: string
  detail: string
}

type CustomerHistoryRow = {
  key: string
  ticketNo: string
  acceptDate: string
  status: string
  faultType: string
}

type SearchableSelectOption = {
  value: string
  label: React.ReactNode
  searchText: string
  plainLabel?: string
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
      '饰件问题',
      '请求更换零配件',
      '调整请求',
      '保养请求',
      '其他问题',
      'cp.parts_lost',
      '假冒产品',
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
    field.key === '配件名称' || field.label === '配件名称' ||
    field.key === '配件存放位置' || field.label === '配件存放位置'
  if (isReadOnlyField) {
    return <span style={{ color: '#333' }}>{strValue}</span>
  }

  if (type === 'switch') return <Switch defaultChecked={isSwitchOn(strValue)} onChange={() => onDirty?.()} />
  if (type === 'input' && isSwitchLike(strValue)) return <Switch defaultChecked={isSwitchOn(strValue)} onChange={() => onDirty?.()} />
  if (type === 'number') return <InputNumber style={{ width: '100%' }} value={Number(strValue) || 0} onChange={() => onDirty?.()} />
  if (type === 'date') return <DatePicker showTime style={{ width: '100%' }} value={strValue ? dayjs(strValue.replace(' ', 'T')) : undefined} onChange={() => onDirty?.()} />
  if (type === 'select') {
    const options = (field.options && field.options.length ? field.options : [strValue || '']).filter(Boolean)
    return <Select className="app-form-select" style={appFormSelectStyle} value={strValue || options[0]} options={options.map((v) => ({ value: v, label: v }))} onChange={() => onDirty?.()} />
  }
  if (type === 'textarea') return <TextArea rows={3} value={strValue} onChange={() => onDirty?.()} />
  return <Input value={strValue} onChange={() => onDirty?.()} />
}

const findField = (fields: ModuleField[], label: string) =>
  fields.find((field) => field.label === label || field.key === label)

const groupedRepairSwitchLabels = new Set(['是否再维修', '是否紧急维修'])
const groupedAttachmentSwitchLabels = new Set(['是否有购买凭证', '是否附保修卡'])
const groupedProcessingSwitchLabels = new Set(['是否产品问题', '是否等待配件'])
const attachedItemTypeOptions = ['定制镜片', '眼镜盒', '眼镜布', '保修卡', '其他']

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
) => {
  const repairSwitchFields = fields.filter(isGroupedRepairSwitchField)
  const attachmentSwitchFields = fields.filter(isGroupedAttachmentSwitchField)
  const processingSwitchFields = fields.filter(isGroupedProcessingSwitchField)
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
                options={attachedItemTypeOptions.map((value) => ({ value, label: value }))}
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
    { key: '1', ticketNo: '115001', acceptDate: '2023-10-27', status: '维修进行中', faultType: '镜框损坏' },
    { key: '2', ticketNo: '114982', acceptDate: '2023-08-15', status: '已完成', faultType: '螺丝松动' },
    { key: '3', ticketNo: '113205', acceptDate: '2023-03-02', status: '已完成', faultType: '抛光服务' },
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
        maskClosable={false}
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
        maskClosable={false}
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
        maskClosable={false}
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
  const createConsultationNo = () => `CONS-${dayjs().format('YYYYMMDD')}-${String(Date.now() % 1000).padStart(3, '0')}`

  const [consultationType, setConsultationType] = useState(initialType)
  const [needConsultation, setNeedConsultation] = useState(initialNeedConsultation)
  const [consultationNo, setConsultationNo] = useState(
    initialNeedConsultation && !initialConsultationNo ? createConsultationNo() : initialConsultationNo,
  )
  const [confirmationRows, setConfirmationRows] = useState<CustomerConfirmationRow[]>([
    { key: '1', content: '请客户确认更换镜片及对应费用。', status: '待确认' },
    { key: '2', content: '请客户确认维修周期延长 3 个工作日。', status: '待确认' },
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
            {renderFieldsWithGroupedRepairSwitches(consultationMainFields, renderConsultationField, section.title)}
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
        maskClosable={false}
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
  const { schema, sections } = useModuleData()
  const [parentBreadcrumbLabel, currentBreadcrumbLabel] = getNavigationBreadcrumbLabels(messages, '/ticket/list', [
    '工单管理',
    '工单列表',
  ])
  const row = schema?.rows.find((r) => String(r.id) === id) ?? schema?.rows?.[0]
  const [headerOwner, setHeaderOwner] = useState('张经理')
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
  const blocker = useBlocker(hasUnsavedChanges)

  useBeforeUnload((event) => {
    if (!hasUnsavedChanges) return
    event.preventDefault()
    event.returnValue = ''
  })

  useEffect(() => {
    if (blocker.state !== 'blocked') return
    const shouldLeave = window.confirm('当前编辑内容还没有提交，离开后未保存内容将丢失。是否继续离开？')

    if (shouldLeave) {
      setHasUnsavedChanges(false)
      blocker.proceed()
      return
    }

    blocker.reset()
  }, [blocker])

  const renderFieldWithDirty = useCallback((field: ModuleField) => renderField(field, markDirty), [markDirty])

  const headerOwnerOptions = ['张经理', '李经理', '王经理', '赵经理']
  const headerOwnerMenuItems = headerOwnerOptions.map((value) => ({
    key: value,
    label: value,
  }))

  const normalizeTitle = (s: string) => s.replace(/\s+/g, '').replace(/（|）/g, '')
  const findSection = (name: string) => sections.find((s) => normalizeTitle(s.title).includes(normalizeTitle(name)))
  const leftGroupNames = ['客户信息', '寄件信息', '受理信息', '咨询/确认信息']
  const rightGroupNames = ['产品信息', '维修信息', '支付信息', '出库信息']
  const leftSections = leftGroupNames.map(findSection).filter((v): v is NonNullable<typeof v> => Boolean(v))
  const rightSections = rightGroupNames.map(findSection).filter((v): v is NonNullable<typeof v> => Boolean(v))

  if (!schema || !row) return <Card>未找到工单详情</Card>

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

  const logColumns: ColumnsType<LogRow> = [
    { title: '编号', dataIndex: 'no', key: 'no', width: 90 },
    { title: '操作时间', dataIndex: 'opTime', key: 'opTime', width: 180 },
    { title: '操作人', dataIndex: 'operator', key: 'operator', width: 160 },
    { title: '操作内容', dataIndex: 'action', key: 'action', width: 120 },
    { title: '备注 / 详情', dataIndex: 'detail', key: 'detail' },
  ]
  const logData: LogRow[] = [
    { key: '1', no: '00012', opTime: '2023-11-01 15:30:45', operator: 'Jameson Vance', action: '创建工单', detail: '门店受理完成，进入维修分拣流程。' },
    { key: '2', no: '00013', opTime: '2023-11-01 16:15:22', operator: '张经理', action: '状态更新', detail: '状态由 待处理 变更为 修理中。' },
    { key: '3', no: '00014', opTime: '2023-11-02 09:30:00', operator: '系统', action: '消息通知', detail: '已发送 [受理] 门店受理完成 (SMS: +86 138****1922)' },
    { key: '4', no: '00015', opTime: '2023-11-02 11:00:12', operator: 'Jameson Vance', action: '附件更新', detail: '上传并关联了客户签名图片。' },
  ]

  return (
    <Space orientation="vertical" size={16} style={{ width: '100%' }} onChangeCapture={markDirty}>
      <Row justify="space-between" align="middle">
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
                <Title level={2} style={{ margin: 0 }}>{String(row.c1 ?? '115001')}</Title>
              </Space>
            </Col>
            <Col flex="auto" style={{ display: 'flex', alignItems: 'center' }}>
              <Steps
                className="ticket-header-steps"
                size="small"
                current={4}
                items={[
                  { title: '受理', icon: <span className="step-icon"><FileTextOutlined /></span> },
                  { title: '接收', icon: <span className="step-icon"><InboxOutlined /></span> },
                  { title: '判定', icon: <span className="step-icon"><SolutionOutlined /></span> },
                  { title: '支付', icon: <span className="step-icon"><CreditCardOutlined /></span> },
                  {
                    title: (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <span>处理</span>
                        <span style={{ color: '#1677ff' }}>等待配件</span>
                      </span>
                    ),
                    description: (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Alert
                          type="warning"
                          showIcon
                          style={{ padding: '4px 8px' }}
                          title={<>库存申请单 <Link to="/inventory/request/23569">23569</Link> 处理中</>}
                        />
                      </div>
                    ),
                    icon: <span className="step-icon"><ToolOutlined /></span>
                  },
                  { title: '履约', icon: <span className="step-icon"><TruckOutlined /></span> },
                  { title: '完成', icon: <span className="step-icon"><CheckCircleOutlined /></span> },
                ]}
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
                        {leftSections.map((section) => (
                          normalizeTitle(section.title).includes(normalizeTitle('客户信息')) ? (
                            <CustomerInfoSection key={section.title} section={section} renderField={renderFieldWithDirty} onDirty={markDirty} />
                          ) : normalizeTitle(section.title).includes(normalizeTitle('受理信息')) ? (
                            <AcceptanceInfoSection
                              key={section.title}
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
                            <ConsultationInfoSection key={section.title} section={section} renderField={renderFieldWithDirty} onDirty={markDirty} />
                          ) : (
                            <Card key={section.title} title={section.title} size="small">
                              <Form layout="vertical" className="v2-form-labels">
                                <Row gutter={16}>
                                  {renderFieldsWithGroupedRepairSwitches(section.fields, renderFieldWithDirty, section.title)}
                                </Row>
                              </Form>
                            </Card>
                          )
                        ))}
                      </Space>
                    </Col>
                    <Col xs={24} xl={12}>
                      <Space orientation="vertical" size={16} style={{ width: '100%' }}>
                        {rightSections.map((section) => (
                          <Card key={section.title} title={section.title} size="small">
                            <Form layout="vertical" className="v2-form-labels">
                              <Row gutter={16}>
                                {renderFieldsWithGroupedRepairSwitches(section.fields, renderFieldWithDirty, section.title)}
                              </Row>
                            </Form>
                          </Card>
                        ))}
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
    </Space>
  )
}
