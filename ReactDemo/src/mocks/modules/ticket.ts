import type { ModuleSchema } from './types'

export const ticketSchemas: ModuleSchema[] = [
{
    "path": "/ticket/list",
    "title": "工单列表",
    "breadcrumb": [
      "工单管理",
      "工单列表"
    ],
    "filters": [
      {
        "key": "f1",
        "label": "工单编号",
        "type": "input",
        "placeholder": "输入工单编号"
      },
      {
        "key": "f2",
        "label": "接收日期",
        "type": "date"
      },
      {
        "key": "f3",
        "label": "状态",
        "type": "select",
        "options": [
          "全部",
          "待处理",
          "处理中",
          "已完成"
        ]
      },
      {
        "key": "f4",
        "label": "本社入库日期",
        "type": "date"
      },
      {
        "key": "f5",
        "label": "客户入库运单号",
        "type": "input",
        "placeholder": "输入客户入库运单号"
      },
      {
        "key": "f6",
        "label": "预计出库日期",
        "type": "date"
      },
      {
        "key": "f7",
        "label": "受理渠道",
        "type": "select",
        "options": [
          "全部",
          "线上商城",
          "实体店",
          "客服热线"
        ]
      },
      {
        "key": "f8",
        "label": "客户",
        "type": "input",
        "placeholder": "输入客户"
      },
      {
        "key": "f9",
        "label": "电话号码",
        "type": "input",
        "placeholder": "输入电话号码"
      },
      {
        "key": "f10",
        "label": "邮箱",
        "type": "input",
        "placeholder": "输入邮箱"
      },
      {
        "key": "f11",
        "label": "产品名称",
        "type": "input",
        "placeholder": "输入产品名称"
      },
      {
        "key": "f12",
        "label": "维修执行方",
        "type": "select",
        "options": [
          "全部",
          "本社维修中心",
          "授权服务商"
        ]
      },
      {
        "key": "f13",
        "label": "维修内容",
        "type": "input",
        "placeholder": "输入维修内容"
      },
      {
        "key": "f14",
        "label": "付款日期",
        "type": "date"
      },
      {
        "key": "f15",
        "label": "出库方式",
        "type": "select",
        "options": [
          "全部",
          "快递配送",
          "自提"
        ]
      },
      {
        "key": "f16",
        "label": "出库完成日期",
        "type": "date"
      },
      {
        "key": "f17",
        "label": "客户产品寄回地址",
        "type": "input",
        "placeholder": "输入客户产品寄回地址"
      }
    ],
    "columns": [
      {
        "key": "c1",
        "title": "工单编号",
        "width": 180
      },
      {
        "key": "c2",
        "title": "接收日期",
        "width": 140
      },
      {
        "key": "c3",
        "title": "状态",
        "width": 140
      },
      {
        "key": "c4",
        "title": "本社入库日期",
        "width": 140
      },
      {
        "key": "c5",
        "title": "客户入库运单号",
        "width": 160
      },
      {
        "key": "c6",
        "title": "预计出库日期",
        "width": 140
      },
      {
        "key": "c7",
        "title": "受理渠道",
        "width": 140
      },
      {
        "key": "c8",
        "title": "客户",
        "width": 140
      },
      {
        "key": "c9",
        "title": "电话号码",
        "width": 140
      },
      {
        "key": "c10",
        "title": "邮箱",
        "width": 140
      },
      {
        "key": "c11",
        "title": "产品名称",
        "width": 140
      },
      {
        "key": "c12",
        "title": "维修执行方",
        "width": 140
      },
      {
        "key": "c13",
        "title": "维修内容",
        "width": 140
      },
      {
        "key": "c14",
        "title": "付款日期",
        "width": 140
      },
      {
        "key": "c15",
        "title": "出库方式",
        "width": 140
      },
      {
        "key": "c16",
        "title": "出库完成日期",
        "width": 140
      },
      {
        "key": "c17",
        "title": "客户产品寄回地址",
        "width": 220
      }
    ],
    "rows": [
      {
        "c1": "115001",
        "c2": "2024-01-15 09:30",
        "c3": "处理中",
        "c4": "2024-01-16",
        "c5": "SF20240115001",
        "c6": "2024-01-20",
        "c7": "线上商城",
        "c8": "张伟",
        "c9": "138****1234",
        "c10": "zhang***@email.com",
        "c11": "V8 Turbo Max",
        "c12": "总部",
        "c13": "镜片更换",
        "c14": "2024-01-17",
        "c15": "快递配送",
        "c16": "-",
        "c17": "上海市静安区南京西路 1266 号 38 层客户服务中心",
        "id": "115001"
      },
      {
        "c1": "115001-1",
        "c2": "2024-01-15 09:30",
        "c3": "处理中",
        "c4": "2024-01-16",
        "c5": "SF20240115001",
        "c6": "2024-01-20",
        "c7": "线上商城",
        "c8": "张伟",
        "c9": "138****1234",
        "c10": "zhang***@email.com",
        "c11": "V8 Turbo Max",
        "c12": "总部",
        "c13": "镜片更换",
        "c14": "2024-01-17",
        "c15": "快递配送",
        "c16": "-",
        "c17": "上海市静安区南京西路 1266 号 38 层客户服务中心",
        "id": "115001-1",
        "originalTicketNo": "115001"
      },
      {
        "c1": "114088",
        "c2": "2024-01-14 14:20",
        "c3": "待处理",
        "c4": "2024-01-15",
        "c5": "JT20240114088",
        "c6": "2024-01-19",
        "c7": "实体店",
        "c8": "Maria Garcia",
        "c9": "139****5678",
        "c10": "maria***@email.com",
        "c11": "Titanium Frame",
        "c12": "合作方",
        "c13": "镜框调整",
        "c14": "-",
        "c15": "自提",
        "c16": "-",
        "c17": "北京市朝阳区三里屯太古里南区 S4-12",
        "id": "114088"
      },
      {
        "c1": "114042",
        "c2": "2024-01-14 11:05",
        "c3": "已完成",
        "c4": "2024-01-15",
        "c5": "YD20240114042",
        "c6": "2024-01-18",
        "c7": "客服热线",
        "c8": "James Wilson",
        "c9": "136****9012",
        "c10": "james***@email.com",
        "c11": "Classic Aviator",
        "c12": "3PL",
        "c13": "全面保养",
        "c14": "2024-01-17",
        "c15": "快递配送",
        "c16": "2024-01-19",
        "c17": "广州市天河区天河路 383 号太古汇 L2-201",
        "id": "114042"
      }
    ],
    "sections": [
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
            "value": "运输中",
            "options": [
              "待发货",
              "运输中",
              "派送中",
              "已签收",
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
            "value": "镜框组件 A01"
          },
          {
            "key": "配件存放位置",
            "label": "配件存放位置",
            "type": "input",
            "value": "PS仓：C001-1117-A3-12"
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
              "US Office",
              "JP Office",
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
            "key": "更换产品名称",
            "label": "更换产品名称",
            "type": "input",
            "value": "请搜索并选择更换产品"
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
            "key": "再维修原因",
            "label": "再维修原因",
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
            "key": "是否等待配件",
            "label": "是否等待配件",
            "type": "switch",
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
            "value": "待提货",
            "options": [
              "待提货",
              "已提货"
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
  }
]
