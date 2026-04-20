import { Breadcrumb, Button, Card, Checkbox, Col, DatePicker, Divider, Dropdown, Form, Input, InputNumber, Modal, Row, Select, Space, Switch, Table, Tabs, Tag, Typography, Upload, message } from 'antd'
import { Alert } from 'antd'
import { DownOutlined, PlusOutlined } from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import type { UploadFile } from 'antd/es/upload'
import dayjs from 'dayjs'
import type { CSSProperties } from 'react'
import { useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
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
  category: string
  reasonCategory: string
  reasonSubCategory: string
}

const categoryOptions = ['-', '产品申请', '补货申请', '调拨申请', '维修领用', '换货申请', '其他']
const reasonCategoryOptions = ['-', '维修使用', '库存补充', '不良置换', '其他']
const reasonSubCategoryOptions = ['-', '零件损坏', 'SUNGLASS ACETATE补充', '客户要求', '定期补货']

function InventoryRequestModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form] = Form.useForm()
  const [items, setItems] = useState<InventoryItem[]>([
    { key: '1', productName: '', quantity: 1, category: '', reasonCategory: '', reasonSubCategory: '' }
  ])

  const addItem = () => {
    setItems([...items, {
      key: Date.now().toString(),
      productName: '',
      quantity: 1,
      category: '',
      reasonCategory: '',
      reasonSubCategory: ''
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
                <Col span={12}>
                  <Form.Item
                    label="分类"
                    name={['items', index, 'category']}
                    rules={[{ required: true, message: '请选择分类' }]}
                  >
                    <Select
                      className="app-form-select"
                      style={appFormSelectStyle}
                      placeholder="选择分类"
                      value={item.category || undefined}
                      onChange={(value) => updateItem(item.key, 'category', value)}
                      options={categoryOptions.map(v => ({ value: v, label: v }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="申请原因（大类）"
                    name={['items', index, 'reasonCategory']}
                  >
                    <Select
                      className="app-form-select"
                      style={appFormSelectStyle}
                      placeholder="选择原因"
                      value={item.reasonCategory || undefined}
                      onChange={(value) => updateItem(item.key, 'reasonCategory', value)}
                      options={reasonCategoryOptions.map(v => ({ value: v, label: v }))}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="申请原因（中类）"
                    name={['items', index, 'reasonSubCategory']}
                  >
                    <Select
                      className="app-form-select"
                      style={appFormSelectStyle}
                      placeholder="选择原因"
                      value={item.reasonSubCategory || undefined}
                      onChange={(value) => updateItem(item.key, 'reasonSubCategory', value)}
                      options={reasonSubCategoryOptions.map(v => ({ value: v, label: v }))}
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

type LogRow = {
  key: string
  no: string
  opTime: string
  operator: string
  action: string
  detail: string
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
    />
  )
}

const renderField = (field: ModuleField) => {
  const type = field.type ?? 'input'
  const strValue = Array.isArray(field.value) ? field.value.join(',') : (field.value ?? '')
  const searchableFieldConfig = searchableFieldOptionMap[field.label] ?? searchableFieldOptionMap[field.key]
  const isProductNameField = field.key === '产品名称' || field.label === '产品名称'
  const isLogisticsTrackField = field.key === '物流轨迹入口' || field.label === '物流轨迹入口'
  const isConsultationNoField = field.key === '咨询单号' || field.label === '咨询单号'

  if (isProductNameField) {
    return <ProductSearchSelect value={strValue} placeholder="搜索产品..." style={{ width: '100%' }} />
  }

  if (searchableFieldConfig) {
    return renderSearchableSelect(strValue, searchableFieldConfig.placeholder, searchableFieldConfig.options)
  }

  // 物流轨迹入口 改为链接
  if (isLogisticsTrackField) return <Link to="/logistics/track">点击查询实时轨迹</Link>

  // 咨询单号 改为链接
  if (isConsultationNoField) return <Link to={`/service/consultation/${strValue}`}>{strValue}</Link>

  // 是否产品问题 改为 Switch
  if (field.key === '是否产品问题' || field.label === '是否产品问题') {
    return <Switch defaultChecked={isSwitchOn(strValue)} />
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

  if (type === 'switch') return <Switch defaultChecked={isSwitchOn(strValue)} />
  if (type === 'input' && isSwitchLike(strValue)) return <Switch defaultChecked={isSwitchOn(strValue)} />
  if (type === 'number') return <InputNumber style={{ width: '100%' }} value={Number(strValue) || 0} />
  if (type === 'date') return <DatePicker showTime style={{ width: '100%' }} value={strValue ? dayjs(strValue.replace(' ', 'T')) : undefined} />
  if (type === 'select') {
    const options = (field.options && field.options.length ? field.options : [strValue || '']).filter(Boolean)
    return <Select className="app-form-select" style={appFormSelectStyle} value={strValue || options[0]} options={options.map((v) => ({ value: v, label: v }))} />
  }
  if (type === 'textarea') return <TextArea rows={3} value={strValue} />
  return <Input value={strValue} />
}

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

const isRepairReferenceField = (field: ModuleField) => field.label === '维修参考事项' || field.key === '维修参考事项'

const renderFieldsWithGroupedRepairSwitches = (
  fields: ModuleField[],
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
    if (isRepairReferenceField(field)) {
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
        <Col key={`${keyPrefix}-repair-switch-group`} xs={24} md={6} xl={6} style={{ marginBottom: 16 }}>
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
        <Col key={`${keyPrefix}-attachment-switch-group`} xs={24} md={6} xl={6} style={{ marginBottom: 16 }}>
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
          <Col key={`${keyPrefix}-attached-item-type`} xs={24} md={6} xl={6}>
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
        <Col key={`${keyPrefix}-processing-switch-group`} xs={24} md={6} xl={6} style={{ marginBottom: 16 }}>
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
      <Col key={`${keyPrefix}-${field.key}-${field.label}`} xs={24} md={6} xl={6}>
        <Form.Item label={field.label}>{renderField(field)}</Form.Item>
      </Col>
    )
  })
}

// 客户姓名字段组件（带按钮和弹窗）
function CustomerNameField({ field }: { field: ModuleField }) {
  const [customerModalOpen, setCustomerModalOpen] = useState(false)
  const lastName = field.value || 'Vance'
  const firstName = 'Jameson'

  return (
    <>
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
      <Modal
        title="客户详情"
        open={customerModalOpen}
        onCancel={() => setCustomerModalOpen(false)}
        maskClosable={false}
        footer={null}
        width={720}
      >
        <div style={{ padding: '16px 0' }}>
          <Row gutter={[24, 16]}>
            <Col xs={24} md={12}>
              <div style={{ marginBottom: 8, color: '#666' }}>客户姓名</div>
              <div style={{ fontWeight: 500 }}>{lastName} {firstName}</div>
            </Col>
            <Col xs={24} md={12}>
              <div style={{ marginBottom: 8, color: '#666' }}>国家</div>
              <div>中国 (China)</div>
            </Col>
            <Col xs={24} md={12}>
              <div style={{ marginBottom: 8, color: '#666' }}>电话号码</div>
              <div>+86 138-8822-1922</div>
            </Col>
            <Col xs={24} md={12}>
              <div style={{ marginBottom: 8, color: '#666' }}>邮箱</div>
              <div>vance.design@example.com</div>
            </Col>
            <Col xs={24}>
              <div style={{ marginBottom: 8, color: '#666' }}>地址</div>
              <div>上海市静安区南京西路 1266 号 38 层客户服务中心</div>
            </Col>
          </Row>
          <Divider />
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 500, marginBottom: 12 }}>历史工单</div>
            <Table
              columns={[
                { title: '工单编号', dataIndex: 'ticketNo', key: 'ticketNo', render: (value: string) => <Link to={`/ticket/${value}`}>{value}</Link> },
                { title: '受理日期', dataIndex: 'acceptDate', key: 'acceptDate', width: 140 },
                { title: '工单状态', dataIndex: 'status', key: 'status', width: 140, render: (value: string) => <Tag color={value === '已完成' ? 'green' : 'blue'}>{value}</Tag> },
                { title: '故障分类', dataIndex: 'faultType', key: 'faultType' },
              ]}
              dataSource={[
                { key: '1', ticketNo: '115001', acceptDate: '2023-10-27', status: '维修进行中', faultType: '镜框损坏' },
                { key: '2', ticketNo: '114982', acceptDate: '2023-08-15', status: '已完成', faultType: '螺丝松动' },
                { key: '3', ticketNo: '113205', acceptDate: '2023-03-02', status: '已完成', faultType: '抛光服务' },
              ]}
              pagination={false}
              size="small"
            />
          </div>
        </div>
      </Modal>
    </>
  )
}

// 新增咨询/确认弹框组件
function AddConsultationModal({ open, onCancel }: { open: boolean; onCancel: () => void }) {
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const handleOk = () => {
    form.validateFields().then((values) => {
      console.log('提交数据:', values)
      message.success('咨询/确认已添加')
      form.resetFields()
      setFileList([])
      onCancel()
    })
  }

  return (
    <Modal
      title="新增咨询/确认"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      maskClosable={false}
      width={600}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="type"
          label="事项类型"
          rules={[{ required: true, message: '请选择事项类型' }]}
        >
          <Select placeholder="请选择事项类型">
            <Select.Option value="consultation">咨询</Select.Option>
            <Select.Option value="confirmation">确认</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="title"
          label="事项标题"
          rules={[{ required: true, message: '请输入事项标题' }]}
        >
          <Input placeholder="请输入事项标题" />
        </Form.Item>

        <Form.Item
          name="content"
          label="正文"
          rules={[{ required: true, message: '请输入正文内容' }]}
        >
          <TextArea rows={4} placeholder="请输入正文内容" />
        </Form.Item>

        <Form.Item label="图片列表">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
            beforeUpload={() => false}
          >
            {fileList.length >= 8 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export function TicketDetailPage2() {
  const { id } = useParams()
  const { messages } = useI18n()
  const { schema, sections } = useModuleData()
  const [parentBreadcrumbLabel, currentBreadcrumbLabel] = getNavigationBreadcrumbLabels(messages, '/ticket/list', [
    '工单管理',
    '工单列表',
  ])
  const row = schema?.rows.find((r) => String(r.id) === id) ?? schema?.rows?.[0]
  const [headerStatus] = useState('等待配件')
  const [headerOwner, setHeaderOwner] = useState('张经理')
  const [attachedItemType, setAttachedItemType] = useState<string>()
  const [activeTicketTabKey, setActiveTicketTabKey] = useState('acceptance')
  const [loadedTicketTabKeys, setLoadedTicketTabKeys] = useState<Set<string>>(() => new Set(['acceptance']))
  const [ticketTabLoading, setTicketTabLoading] = useState(false)
  const ticketTabLoadingTimerRef = useRef<number | undefined>(undefined)
  const [inventoryModalOpen, setInventoryModalOpen] = useState(false)
  const [addRepairItemModalOpen, setAddRepairItemModalOpen] = useState(false)
  const [consultationModalOpen, setConsultationModalOpen] = useState(false)

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
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
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
            <Button type="primary">保存</Button>
          </Space>
        </Col>
      </Row>

      <Card>
        <Space orientation="vertical" size={8} style={{ width: '100%' }}>
          <Row justify="space-between" align="middle" gutter={[16, 8]}>
            <Col>
              <Space align="center" size={12}>
                <Title level={2} style={{ margin: 0 }}>{String(row.c1 ?? '115001')}</Title>
                {/* 原来的状态选择器
                <Select
                  className="app-form-select"
                  size="small"
                  value={headerStatus}
                  style={{ ...appFormSelectStyle, width: 210 }}
                  options={headerStatusOptions.map((v) => ({ value: v, label: v }))}
                  onChange={setHeaderStatus}
                />
                */}
                <span
                  className="ticket-status-pill"
                  style={{
                    backgroundColor: '#e6f4ff',
                    color: '#1677ff',
                    padding: '4px 12px',
                    fontWeight: 500,
                  }}
                >
                  {headerStatus}
                </span>
                <Alert
                  type="warning"
                  showIcon
                  style={{ margin: 0 }}
                  title={
                    <>
                      当前工单配件库存不足，已发起库存申请，库存申请单{' '}
                      <Link to="/inventory/request/23569">23569</Link> 处理中。
                    </>
                  }
                />
              </Space>
            </Col>
          </Row>
          <Space size={16}>
            <Dropdown
              trigger={['click']}
              menu={{
                items: headerOwnerMenuItems,
                selectedKeys: [headerOwner],
                onClick: ({ key }) => setHeaderOwner(String(key)),
              }}
            >
              <Button size="small">
                负责人：{headerOwner} <DownOutlined className="app-dropdown-menu-arrow" />
              </Button>
            </Dropdown>
            <Text>SO 文件编号：SO-8829011</Text>
            {originalTicketNo ? (
              <Text>
                原工单：
                <Link to={`/ticket/list/${originalTicketNo}`}>{originalTicketNo}</Link>
              </Text>
            ) : null}
          </Space>
        </Space>

      </Card>
      <Card>
        <Tabs
          destroyOnHidden={false}
          animated={false}
          activeKey={activeTicketTabKey}
          onChange={handleTicketTabChange}
          tabBarExtraContent={{
            right: <Button type="primary">下一步</Button>,
          }}
          items={[
            {
              key: 'acceptance',
              label: '受理',
              children: renderTicketTabContent('acceptance', (
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  {/* 客户信息 Card */}
                  <Card title="客户信息" size="small">
                    <Form layout="vertical" className="v2-form-labels">
                      <Row gutter={[16, 16]}>
                        {(() => {
                          // 获取所有客户信息字段（按原始顺序）
                          const allCustomerFields = [
                            ...leftSections.filter((section) =>
                              normalizeTitle(section.title).includes(normalizeTitle('客户信息'))
                            ).flatMap((section) => section.fields),
                            ...rightSections.filter((section) =>
                              normalizeTitle(section.title).includes(normalizeTitle('客户信息'))
                            ).flatMap((section) => section.fields)
                          ]

                          // 找到营销同意、隐私同意和收货类型的索引
                          const agreementIndices = allCustomerFields
                            .map((field, index) => (field.label === '营销同意' || field.label === '隐私同意') ? index : -1)
                            .filter((index) => index !== -1)
                          const deliveryTypeIndex = allCustomerFields.findIndex((field) => field.label === '收货类型')

                          // 重新排序：把同意字段移到收货类型后面
                          const reorderedFields: typeof allCustomerFields = []
                          const agreementFields: typeof allCustomerFields = []

                          allCustomerFields.forEach((field, index) => {
                            if (agreementIndices.includes(index)) {
                              agreementFields.push(field)
                            } else {
                              reorderedFields.push(field)
                            }
                          })

                          // 在收货类型前面插入同意字段
                          if (deliveryTypeIndex !== -1 && agreementFields.length > 0) {
                            const insertIndex = reorderedFields.findIndex((field) => field.label === '收货类型')
                            reorderedFields.splice(insertIndex, 0, ...agreementFields)
                          }

                          return (
                            <>
                              {reorderedFields.map((field) => {
                                // 营销同意和隐私同意放在同一个 Col 中
                                if (field.label === '营销同意' || field.label === '隐私同意') {
                                  // 只渲染一次，包含两个字段
                                  if (field.label === '营销同意') {
                                    const privacyField = reorderedFields.find((f) => f.label === '隐私同意')
                                    return (
                                      <Col key="customer-agreements" xs={24} md={6} xl={6}>
                                        <Row gutter={16}>
                                          <Col xs={24} md={6}>
                                            <Form.Item label={field.label}>{renderField(field)}</Form.Item>
                                          </Col>
                                          {privacyField && (
                                            <Col xs={24} md={6}>
                                              <Form.Item label={privacyField.label}>{renderField(privacyField)}</Form.Item>
                                            </Col>
                                          )}
                                        </Row>
                                      </Col>
                                    )
                                  }
                                  // 隐私同意已在上面渲染，跳过
                                  return null
                                }
                                // 客户姓名字段特殊处理，添加按钮
                                if (field.label === '客户姓名') {
                                  return (
                                    <Col key={`customer-${field.key}-${field.label}`} xs={24} md={6} xl={6}>
                                      <Form.Item label={field.label}>
                                        <CustomerNameField field={field} />
                                      </Form.Item>
                                    </Col>
                                  )
                                }
                                return (
                                  <Col key={`customer-${field.key}-${field.label}`} xs={24} md={6} xl={6}>
                                    <Form.Item label={field.label}>{renderField(field)}</Form.Item>
                                  </Col>
                                )
                              })}
                            </>
                          )
                        })()}
                      </Row>
                    </Form>
                  </Card>

                  {/* 受理信息 Card */}
                  <Card title="受理信息" size="small">
                    <Form layout="vertical" className="v2-form-labels">
                      <Row gutter={[16, 16]}>
                        {renderFieldsWithGroupedRepairSwitches(
                          leftSections
                            .filter((section) =>
                              normalizeTitle(section.title).includes(normalizeTitle('受理信息')) ||
                              normalizeTitle(section.title).includes(normalizeTitle('受理附件信息'))
                            )
                            .flatMap((section) => section.fields),
                          'left-acceptance',
                          attachedItemType,
                          setAttachedItemType,
                        )}
                        {renderFieldsWithGroupedRepairSwitches(
                          rightSections
                            .filter((section) =>
                              normalizeTitle(section.title).includes(normalizeTitle('受理信息')) ||
                              normalizeTitle(section.title).includes(normalizeTitle('受理附件信息'))
                            )
                            .flatMap((section) => section.fields),
                          'right-acceptance',
                          attachedItemType,
                          setAttachedItemType,
                        )}
                      </Row>
                    </Form>
                  </Card>
                </Space>
              )),
            },
            {
              key: 'fees',
              label: '接收',
              children: renderTicketTabContent('fees', (
                <Form layout="vertical" className="v2-form-labels">
                  <Row gutter={[16, 16]}>
                    {leftSections
                      .filter((section) =>
                        normalizeTitle(section.title).includes(normalizeTitle('寄件信息'))
                      )
                      .flatMap((section) => section.fields)
                      .map((field) => (
                        <Col key={`left-${field.key}-${field.label}`} xs={24} md={6} xl={6}>
                          <Form.Item label={field.label}>{renderField(field)}</Form.Item>
                        </Col>
                      ))}
                    {rightSections
                      .filter((section) =>
                        normalizeTitle(section.title).includes(normalizeTitle('寄件信息'))
                      )
                      .flatMap((section) => section.fields)
                      .map((field) => (
                        <Col key={`right-${field.key}-${field.label}`} xs={24} md={6} xl={6}>
                          <Form.Item label={field.label}>{renderField(field)}</Form.Item>
                        </Col>
                      ))}
                  </Row>
                </Form>
              )),
            },
            {
              key: 'logistics',
              label: '判定',
              children: renderTicketTabContent('logistics', (
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  {/* 判定类型选择 */}
                  <Card size="small">
                    <Form layout="vertical" className="v2-form-labels">
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={6}>
                          <Form.Item label="判定类型">
                            <Select placeholder="请选择判定类型" style={{ width: '100%' }}>
                              <Select.Option value="repair">维修</Select.Option>
                              <Select.Option value="replace">更换</Select.Option>
                              <Select.Option value="refund">退款</Select.Option>
                              <Select.Option value="return">退货</Select.Option>
                            </Select>
                          </Form.Item>
                        </Col>
                        <Col xs={24} md={6}></Col>
                        <Col xs={24} md={6}></Col>
                        <Col xs={24} md={6}></Col>
                      </Row>
                    </Form>
                  </Card>

                  <Card title="产品信息" size="small">
                    <Form layout="vertical" className="v2-form-labels">
                      <Row gutter={[16, 16]}>
                      {leftSections
                        .filter((section) =>
                          normalizeTitle(section.title).includes(normalizeTitle('产品信息'))
                        )
                        .flatMap((section) => section.fields)
                        .map((field) => (
                          <Col key={`left-${field.key}-${field.label}`} xs={24} md={6} xl={6}>
                            <Form.Item label={field.label}>{renderField(field)}</Form.Item>
                          </Col>
                        ))}
                      {rightSections
                        .filter((section) =>
                          normalizeTitle(section.title).includes(normalizeTitle('产品信息'))
                        )
                        .flatMap((section) => section.fields)
                        .map((field) => (
                          <Col key={`right-${field.key}-${field.label}`} xs={24} md={6} xl={6}>
                            <Form.Item label={field.label}>{renderField(field)}</Form.Item>
                          </Col>
                        ))}
                    </Row>
                  </Form>
                </Card>
                </Space>
              )),
            },
            {
              key: 'payment',
              label: '支付',
              children: renderTicketTabContent('payment', (
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  {/* 支付信息 Card */}
                  <Card title="支付信息" size="small">
                    <Form layout="vertical" className="v2-form-labels">
                      <Row gutter={[16, 16]}>
                        {leftSections
                          .filter((section) =>
                            normalizeTitle(section.title).includes(normalizeTitle('支付信息'))
                          )
                          .flatMap((section) => section.fields)
                          .map((field) => (
                            <Col key={`left-${field.key}-${field.label}`} xs={24} md={6} xl={6}>
                              <Form.Item label={field.label}>{renderField(field)}</Form.Item>
                            </Col>
                          ))}
                        {rightSections
                          .filter((section) =>
                            normalizeTitle(section.title).includes(normalizeTitle('支付信息'))
                          )
                          .flatMap((section) => section.fields)
                          .map((field) => (
                            <Col key={`right-${field.key}-${field.label}`} xs={24} md={6} xl={6}>
                              <Form.Item label={field.label}>{renderField(field)}</Form.Item>
                            </Col>
                          ))}
                      </Row>
                    </Form>
                  </Card>

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
              key: 'processing',
              label: '处理',
              children: renderTicketTabContent('processing', (
                <Form layout="vertical" className="v2-form-labels">
                  <Row gutter={[16, 16]}>
                    {renderFieldsWithGroupedRepairSwitches(
                      [
                        ...leftSections
                          .filter((section) => normalizeTitle(section.title).includes(normalizeTitle('维修信息')))
                          .flatMap((section) => section.fields),
                        ...rightSections
                          .filter((section) => normalizeTitle(section.title).includes(normalizeTitle('维修信息')))
                          .flatMap((section) => section.fields),
                      ],
                      'repair',
                    )}
                  </Row>
                </Form>
              )),
            },
            {
              key: 'fulfillment',
              label: '履约',
              disabled: true,
              children: renderTicketTabContent('fulfillment', (
                <Form layout="vertical" className="v2-form-labels">
                  <Row gutter={[16, 16]}>
                    {leftSections
                      .filter((section) =>
                        normalizeTitle(section.title).includes(normalizeTitle('出库信息'))
                      )
                      .flatMap((section) => section.fields)
                      .map((field) => (
                        <Col key={`left-${field.key}-${field.label}`} xs={24} md={6} xl={6}>
                          <Form.Item label={field.label}>{renderField(field)}</Form.Item>
                        </Col>
                      ))}
                    {rightSections
                      .filter((section) =>
                        normalizeTitle(section.title).includes(normalizeTitle('出库信息'))
                      )
                      .flatMap((section) => section.fields)
                      .map((field) => (
                        <Col key={`right-${field.key}-${field.label}`} xs={24} md={6} xl={6}>
                          <Form.Item label={field.label}>{renderField(field)}</Form.Item>
                        </Col>
                      ))}
                  </Row>
                </Form>
              )),
            },
            { key: 'completion', label: '完成', disabled: true },
          ]}
        />
      </Card>

      {/* 咨询/确认信息 Card */}
      <Card
        title="咨询 / 确认信息"
        extra={
          <Button type="primary" size="small" onClick={() => setConsultationModalOpen(true)}>+ 新增咨询/确认</Button>
        }
      >
        <Table
          rowKey="key"
          columns={[
            { title: '咨询单号', dataIndex: 'consultationNo', key: 'consultationNo', width: 120, render: (v) => <Link to={`/service/consultation/${v}`}>{v}</Link> },
            { title: '咨询标题', dataIndex: 'title', key: 'title' },
            { title: '咨询内容', dataIndex: 'content', key: 'content', ellipsis: true },
            { title: '发起时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
            { title: '是否确认', dataIndex: 'confirmed', key: 'confirmed', width: 100, render: (v) => v ? '是' : '否' },
          ]}
          dataSource={[
            { key: '1', consultationNo: 'C20231016001', title: '维修方案确认', content: '客户同意更换镜框组件，费用已确认', createTime: '2023-10-16 10:30', confirmed: true },
            { key: '2', consultationNo: 'C20231017002', title: '配件到货时间', content: '预计3-5个工作日到货', createTime: '2023-10-17 14:20', confirmed: true },
            { key: '3', consultationNo: 'C20231018003', title: '维修延期说明', content: '因配件缺货，维修时间需延长2天', createTime: '2023-10-18 09:15', confirmed: false },
          ]}
          pagination={false}
          size="small"
        />
      </Card>
      <AddConsultationModal
        open={consultationModalOpen}
        onCancel={() => setConsultationModalOpen(false)}
      />

      <Card title="日志">
        <Table rowKey="key" columns={logColumns} dataSource={logData} pagination={false} scroll={{ x: 1000 }} />
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
