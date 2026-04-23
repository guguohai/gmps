import type { ModuleRow, ModuleSection } from '../../types/module'
import type { TicketFlowStepsResponse } from '../../types/ticket'

export const ticketListRows: ModuleRow[] = [
  {
    id: '115001',
    ticketNo: '115001',
    receivedAt: '2024-01-15 09:30',
    status: 'WAITING_PARTS',
    headOfficeInboundDate: '2024-01-16',
    customerInboundTrackingNo: 'SF20240115001',
    estimatedOutboundDate: '2024-01-20',
    channel: '线上商城',
    customerName: '张伟',
    phone: '138****1234',
    email: 'zhang***@email.com',
    productName: 'V8 Turbo Max',
    repairExecutor: '总部',
    repairContent: '镜片更换',
    paymentDate: '2024-01-17',
    outboundMethod: '快递配送',
    outboundCompletedAt: '-',
    customerReturnAddress: '上海市静安区南京西路 1266 号 38 层客户服务中心',
    mainStatus: 'PROCESS',
    subStatus: 'WAITING_PARTS',
    specialDescription: '库存申请单 23569 处理中',
    inventoryRequestNo: '23569',
    inventoryRequestStatus: '处理中',
    inventoryRequestCompleted: false,
  },
  {
    id: '115001-1',
    ticketNo: '115001-1',
    receivedAt: '2024-01-15 09:30',
    status: 'SUBMITTED',
    headOfficeInboundDate: '2024-01-16',
    customerInboundTrackingNo: 'SF20240115001',
    estimatedOutboundDate: '2024-01-20',
    channel: '线上商城',
    customerName: '张伟',
    phone: '138****1234',
    email: 'zhang***@email.com',
    productName: 'V8 Turbo Max',
    repairExecutor: '总部',
    repairContent: '镜片更换',
    paymentDate: '2024-01-17',
    outboundMethod: '快递配送',
    outboundCompletedAt: '-',
    customerReturnAddress: '上海市静安区南京西路 1266 号 38 层客户服务中心',
    mainStatus: 'REVIEW',
    subStatus: 'SUBMITTED',
    originalTicketNo: '115001',
  },
  {
    id: '114088',
    ticketNo: '114088',
    receivedAt: '2024-01-14 14:20',
    status: 'JUDGING',
    headOfficeInboundDate: '2024-01-15',
    customerInboundTrackingNo: 'JT20240114088',
    estimatedOutboundDate: '2024-01-19',
    channel: '实体店',
    customerName: 'Maria Garcia',
    phone: '139****5678',
    email: 'maria***@email.com',
    productName: 'Titanium Frame',
    repairExecutor: '合作方',
    repairContent: '镜框调整',
    paymentDate: '-',
    outboundMethod: '自提',
    outboundCompletedAt: '-',
    customerReturnAddress: '北京市朝阳区三里屯太古里南区 S4-12',
    mainStatus: 'JUDGE',
    subStatus: 'JUDGING',
  },
  {
    id: '114042',
    ticketNo: '114042',
    receivedAt: '2024-01-14 11:05',
    status: 'SERVICE_ENDED',
    headOfficeInboundDate: '2024-01-15',
    customerInboundTrackingNo: 'YD20240114042',
    estimatedOutboundDate: '2024-01-18',
    channel: '客服热线',
    customerName: 'James Wilson',
    phone: '136****9012',
    email: 'james***@email.com',
    productName: 'Classic Aviator',
    repairExecutor: '3PL',
    repairContent: '全面保养',
    paymentDate: '2024-01-17',
    outboundMethod: '快递配送',
    outboundCompletedAt: '2024-01-19',
    customerReturnAddress: '广州市天河区天河路 383 号太古汇 L2-201',
    mainStatus: 'COMPLETE',
    subStatus: 'SERVICE_ENDED',
  },
  {
    id: '113986',
    ticketNo: '113986',
    receivedAt: '2024-01-13 16:40',
    status: 'WAITING_PAY',
    headOfficeInboundDate: '2024-01-14',
    customerInboundTrackingNo: 'SF20240113986',
    estimatedOutboundDate: '2024-01-21',
    channel: '线上商城',
    customerName: '陈晨',
    phone: '137****7788',
    email: 'chen***@email.com',
    productName: 'HER 01',
    repairExecutor: '总部',
    repairContent: '镜腿更换',
    paymentDate: '-',
    outboundMethod: '快递配送',
    outboundCompletedAt: '-',
    customerReturnAddress: '杭州市拱墅区湖墅南路 123 号',
    mainStatus: 'PAY',
    subStatus: 'WAITING_PAY',
  },
]

const ticketDetailOverrides: Record<string, Partial<ModuleRow>> = {
  '115001': {
    country: '中国 (China)',
    receiveChannelType: '线上商城',
    receiveStore: '上海旗舰店',
    purchaseChannel: '官方旗舰店',
    consultOwner: '赵师傅',
    consultDate: '2024-01-16',
    consultationStatus: '待客户确认',
    faultType: '镜片磨损',
    repairEngineer: '张师傅',
    paymentMethod: '微信',
  },
  '115001-1': {
    country: '中国 (China)',
    receiveChannelType: '线上商城',
    receiveStore: '上海旗舰店',
    purchaseChannel: '官方旗舰店',
    consultOwner: '赵师傅',
    consultDate: '2024-01-15',
    consultationStatus: '等待中',
    faultType: '镜片磨损',
    repairEngineer: '张师傅',
    paymentMethod: '微信',
  },
  '114088': {
    country: '美国 (United States)',
    receiveChannelType: '实体店',
    receiveStore: '北京三里屯店',
    purchaseChannel: '百货专柜',
    consultOwner: '刘师傅',
    consultDate: '2024-01-14',
    consultationStatus: '判定中',
    faultType: '镜框变形',
    repairEngineer: '王工程师',
    paymentMethod: '',
  },
  '114042': {
    country: '美国 (United States)',
    receiveChannelType: '客服热线',
    receiveStore: '广州太古汇店',
    purchaseChannel: '客服热线',
    consultOwner: '张师傅',
    consultDate: '2024-01-14',
    consultationStatus: '已完成',
    faultType: '全面保养',
    repairEngineer: '李师傅',
    paymentMethod: '支付宝',
  },
  '113986': {
    country: '中国 (China)',
    receiveChannelType: '线上商城',
    receiveStore: '杭州大厦店',
    purchaseChannel: '线上官方商城',
    consultOwner: '赵师傅',
    consultDate: '2024-01-13',
    consultationStatus: '等待中',
    faultType: '镜腿更换',
    repairEngineer: '王工程师',
    paymentMethod: '',
  },
}

const mergeModuleRow = (baseRow: ModuleRow, overrideRow?: Partial<ModuleRow>): ModuleRow => {
  const merged: ModuleRow = { ...baseRow }
  if (!overrideRow) return merged

  Object.entries(overrideRow).forEach(([key, value]) => {
    if (value !== undefined) {
      merged[key] = value
    }
  })

  return merged
}

export const ticketDetailRows: ModuleRow[] = ticketListRows.map((row) =>
  mergeModuleRow(row, ticketDetailOverrides[String(row.id)])
)

export const getTicketDetailRowById = (id: string) =>
  ticketDetailRows.find((row) => String(row.id) === id || String(row.ticketNo) === id)

export const TICKET_FLOW_STEPS_MOCK: TicketFlowStepsResponse = {
  currentMainStatus: 'PROCESS',
  currentSubStatus: 'REPAIRING',
  steps: [
    { mainStatus: 'REVIEW', subStatus: 'APPROVED', completedAt: '2023-10-27T10:00:00', operator: '系统' },
    { mainStatus: 'ACCEPT', subStatus: 'ACCEPTED', completedAt: '2023-10-27T11:00:00', operator: '张经理' },
    { mainStatus: 'RECEIVE', subStatus: 'RECEIVED', completedAt: '2023-10-28T09:00:00', operator: '李师傅' },
    { mainStatus: 'JUDGE', subStatus: 'JUDGE_COMPLETED', completedAt: '2023-10-29T14:00:00', operator: '王工' },
    { mainStatus: 'PAY', subStatus: 'PAID', completedAt: '2023-10-29T15:00:00', operator: '客户' },
    { mainStatus: 'PROCESS', subStatus: 'REPAIRING', completedAt: null, operator: null },
  ],
}


export const TICKET_LIST_SECTIONS: ModuleSection[] = [
      {
        "title": "客户信息",
        "fields": [
          {
            "key": "客户姓名",
            "label": "客户姓名",
            "type": "input",
            "value": "Vance"
          },
          {
            "key": "电话号码",
            "label": "电话号码",
            "type": "input",
            "value": "+86 138-8822-1922"
          },
          {
            "key": "国家",
            "label": "国家",
            "type": "select",
            "value": "中国 (China)",
            "options": [
              "中国 (China)",
              "美国 (United States)",
              "日本 (Japan)"
            ]
          },
          {
            "key": "邮箱",
            "label": "邮箱",
            "type": "input",
            "value": "vance.design@example.com"
          },
          {
            "key": "营销同意",
            "label": "营销同意",
            "type": "input",
            "value": "on"
          },
          {
            "key": "隐私同意",
            "label": "隐私同意",
            "type": "input",
            "value": "on"
          },
          {
            "key": "收货类型",
            "label": "收货类型",
            "type": "select",
            "value": "请选择收货类型",
            "options": [
              "请选择收货类型",
              "门店",
              "快递"
            ]
          },
          {
            "key": "收货地址",
            "label": "收货地址",
            "type": "textarea",
            "value": "上海市静安区南京西路 1266 号恒隆广场一座 45 楼"
          }
        ]
      },
      {
        "title": "寄件信息（受理后隐藏）",
        "fields": [
          {
            "key": "寄件方式",
            "label": "寄件方式",
            "type": "select",
            "value": "快递",
            "options": [
              "快递",
              "自提",
              "同城配送",
              "其他"
            ]
          },
          {
            "key": "快递公司",
            "label": "快递公司",
            "type": "select",
            "value": "顺丰快递 (SF Express)",
            "options": [
              "顺丰快递 (SF Express)",
              "中通快递 (ZTO Express)",
              "圆通快递 (YTO Express)",
              "申通快递 (STO Express)",
              "韵达快递 (Yunda)",
              "EMS",
              "京东物流 (JD Logistics)",
              "其他"
            ]
          },
          {
            "key": "运单号",
            "label": "运单号",
            "type": "input",
            "value": "SF14223908812"
          },
          {
            "key": "寄件时间",
            "label": "寄件时间",
            "type": "date",
            "value": "2023-11-01T14:30"
          },
          {
            "key": "物流状态",
            "label": "物流状态",
            "type": "select",
            "value": "配送开始",
            "options": [
              "待出库",
              "配送开始",
              "配送完成",
              "客户签收",
              "异常"
            ]
          },
          {
            "key": "物流轨迹入口",
            "label": "物流轨迹入口",
            "type": "input",
            "value": "点击查询实时轨迹"
          }
        ]
      },
      {
        "title": "受理信息",
        "fields": [
          {
            "key": "接收日期",
            "label": "接收日期",
            "type": "date",
            "value": "2023-10-27"
          },
          {
            "key": "受理渠道类型",
            "label": "受理渠道类型",
            "type": "select",
            "value": "海外法人(子公司)",
            "options": [
              "-",
              "Flagship Store",
              "百货商店",
              "Mall",
              "免税店",
              "配镜师",
              "编辑店",
              "网上公司商城",
              "线上第三方商城",
              "海外法人(子公司)",
              "海外法人(合资)",
              "Distributor",
              "Wholesale",
              "PS",
              "Etc"
            ]
          },
          {
            "key": "受理渠道",
            "label": "受理渠道",
            "type": "input",
            "value": "Online Support"
          },
          {
            "key": "受理门店",
            "label": "受理门店",
            "type": "input",
            "value": "上海旗舰店"
          },
          {
            "key": "是否再维修",
            "label": "是否再维修",
            "type": "input",
            "value": "on"
          },
          {
            "key": "是否紧急维修",
            "label": "是否紧急维修",
            "type": "input",
            "value": "on"
          },
          {
            "key": "是否有购买凭证",
            "label": "是否有购买凭证",
            "type": "input",
            "value": "on"
          },
          {
            "key": "是否附保修卡",
            "label": "是否附保修卡",
            "type": "input",
            "value": "on"
          },
          {
            "key": "购买日期",
            "label": "购买日期",
            "type": "date",
            "value": "2023-05-12"
          },
          {
            "key": "购买渠道",
            "label": "购买渠道",
            "type": "input",
            "value": "官方旗舰店"
          },
          {
            "key": "客户要求事项内容",
            "label": "客户要求事项内容",
            "type": "textarea",
            "value": "右眼下部分的镜框有缺失，且有裂纹。请帮忙维修该部分。"
          }
        ]
      },
      {
        "title": "咨询 / 确认信息",
        "fields": [
          {
            "key": "是否需要咨询",
            "label": "是否需要咨询",
            "type": "input",
            "value": "on"
          },
          {
            "key": "事项类型",
            "label": "事项类型",
            "type": "select",
            "value": "一般咨询",
            "options": [
              "一般咨询",
              "客户确认"
            ]
          },
          {
            "key": "咨询单号",
            "label": "咨询单号",
            "type": "input",
            "value": "CONS-202401-001"
          },
          {
            "key": "外呼类型",
            "label": "外呼类型",
            "type": "select",
            "value": "电话",
            "options": [
              "电话",
              "email",
              "小程序"
            ]
          },
          {
            "key": "咨询需求分类",
            "label": "咨询需求分类",
            "type": "select",
            "value": "维修费用",
            "options": [
              "维修费用",
              "调整沟通",
              "配件停产",
              "配送周期",
              "同款产品更换",
              "更换其他产品",
              "镜片补偿",
              "产品退款",
              "其他"
            ]
          },
          {
            "key": "咨询负责人",
            "label": "咨询负责人",
            "type": "input",
            "value": "赵师傅"
          },
          {
            "key": "咨询状态",
            "label": "咨询状态",
            "type": "select",
            "value": "等待中",
            "options": [
              "等待中",
              "已发送",
              "待客户确认",
              "客户已回复",
              "已完成"
            ]
          },
          {
            "key": "咨询日期",
            "label": "咨询日期",
            "type": "date",
            "value": "2023-10-28"
          }
        ]
      },
      {
        "title": "产品信息",
        "fields": [
          {
            "key": "产品名称",
            "label": "产品名称",
            "type": "searchSelect",
            "value": "GM Sunglasses A01",
            "options": ["GM Sunglasses A01", "GM Sunglasses B02", "GM Optical C03", "GM Optical D04", "MOLSION 陌森 SUNGLASS COMBI"]
          },
          {
            "key": "生产工厂",
            "label": "生产工厂",
            "type": "select",
            "value": "第一工厂",
            "options": [
              "第一工厂",
              "第二工厂"
            ]
          },
          {
            "key": "产品id",
            "label": "产品 ID",
            "type": "input",
            "value": "P000123"
          },
          {
            "key": "类别",
            "label": "类别",
            "type": "input",
            "value": "SUNGLASS ACETATE"
          },
          {
            "key": "库存状态",
            "label": "库存状态",
            "type": "number",
            "value": "有库存"
          },
          {
            "key": "上市日期",
            "label": "上市日期",
            "type": "date",
            "value": "2023-05-15"
          },
          {
            "key": "电镀焊接维修是否可行",
            "label": "电镀 / 焊接维修是否可行",
            "type": "select",
            "value": "可行",
            "options": []
          },
          {
            "key": "配件名称",
            "label": "配件名称",
            "type": "input",
            "value": "Jennie - Aile.G"
          },
          {
            "key": "配件存放位置",
            "label": "配件存放位置",
            "type": "input",
            "value": "C002-1020"
          }
        ]
      },
      {
        "title": "维修信息",
        "fields": [
          {
            "key": "总部入库日期",
            "label": "总部入库日期",
            "type": "date",
            "value": "2023-10-29"
          },
          {
            "key": "预计出库日期",
            "label": "预计出库日期",
            "type": "date",
            "value": "2023-11-05"
          },
          {
            "key": "移交总部日期",
            "label": "移交总部日期",
            "type": "date",
            "value": ""
          },
          {
            "key": "总部返还签收日期",
            "label": "总部返还签收日期",
            "type": "date",
            "value": ""
          },
          {
            "key": "现象",
            "label": "现象",
            "type": "input",
            "value": "镜腿漆面剥落"
          },
          {
            "key": "问题现象",
            "label": "问题现象",
            "type": "input",
            "value": "漆面剥落"
          },
          {
            "key": "客户请求",
            "label": "客户请求",
            "type": "input",
            "value": ""
          },
          {
            "key": "镜片类型",
            "label": "镜片类型",
            "type": "select",
            "value": "未安装",
            "options": [
              "-",
              "未安装",
              "定制镜片",
              "产品的原装镜片"
            ]
          },
          {
            "key": "维修处",
            "label": "维修处",
            "type": "select",
            "value": "-",
            "options": [
              "-",
              "总部",
              "合作公司",
              "3PL"
            ]
          },
          {
            "key": "服务工程师",
            "label": "服务工程师",
            "type": "input",
            "value": "张师傅"
          },
          {
            "key": "维修内容",
            "label": "维修内容",
            "type": "input",
            "value": "请选择维修内容"
          },
          {
            "key": "维修进度日期",
            "label": "维修进度日期",
            "type": "date",
            "value": "2025-10-30"
          },
          {
            "key": "合作方出库日期",
            "label": "合作方出库日期",
            "type": "date",
            "value": ""
          },
          {
            "key": "合作方入库日期",
            "label": "合作方入库日期",
            "type": "date",
            "value": ""
          },
          {
            "key": "返修原因",
            "label": "返修原因",
            "type": "select",
            "value": "-",
            "options": [
              "-",
              "维修不满意",
              "新问题出现",
              "零件失效"
            ]
          },
          {
            "key": "是否产品问题",
            "label": "是否产品问题",
            "type": "input",
            "value": "on"
          },
          {
            "key": "维修费用判定",
            "label": "维修费用判定",
            "type": "select",
            "value": "-",
            "options": [
              "-",
              "有偿",
              "免费"
            ]
          },
          {
            "key": "维修费用",
            "label": "维修费用",
            "type": "input",
            "value": ""
          },
          {
            "key": "维修参考事项",
            "label": "维修参考事项",
            "type": "textarea",
            "value": "输入维修参考事项..."
          }
        ]
      },
      {
        "title": "支付信息",
        "fields": [
          {
            "key": "支付完成状态",
            "label": "支付完成状态",
            "type": "input",
            "value": "on"
          },
          {
            "key": "支付方式",
            "label": "支付方式",
            "type": "select",
            "value": "微信",
            "options": [
              "线下支付",
              "微信",
              "支付宝",
              "POS机"
            ]
          },
          {
            "key": "支付金额",
            "label": "支付金额",
            "type": "input",
            "value": "¥0.00"
          },
          {
            "key": "实付金额",
            "label": "实付金额",
            "type": "input",
            "value": "¥0.00"
          },
          {
            "key": "支付截至日期",
            "label": "支付截至日期",
            "type": "date",
            "value": ""
          },
          {
            "key": "支付日期",
            "label": "支付日期",
            "type": "input",
            "value": ""
          },
          {
            "key": "支付授权号",
            "label": "支付授权号",
            "type": "input",
            "value": ""
          }
        ]
      },
      {
        "title": "出库信息",
        "fields": [
          {
            "key": "是否出库完成",
            "label": "是否出库完成",
            "type": "input",
            "value": "on"
          },
          {
            "key": "出库完成日期",
            "label": "出库完成日期",
            "type": "date",
            "value": ""
          },
          {
            "key": "出库方式",
            "label": "出库方式",
            "type": "select",
            "value": "-",
            "options": [
              "-",
              "快递（总部）",
              "邮件袋（总部）",
              "国际配送（总部）",
              "配送服务（3PL）",
              "海外配送（3PL）",
              "亲自取件",
              "特快快递服务"
            ]
          },
          {
            "key": "配送完成",
            "label": "配送完成",
            "type": "input",
            "value": "on"
          },
          {
            "key": "配送日期",
            "label": "配送日期",
            "type": "date",
            "value": ""
          },
          {
            "key": "物流单号",
            "label": "物流单号",
            "type": "input",
            "value": ""
          },
          {
            "key": "门店提货状态",
            "label": "门店提货状态",
            "type": "select",
            "value": "门店可取",
            "options": [
              "门店到达",
              "门店收货完成",
              "门店可取",
              "客户取件完成"
            ]
          },
          {
            "key": "门店提货日期",
            "label": "门店提货日期",
            "type": "date",
            "value": ""
          }
        ]
      }
    ]
