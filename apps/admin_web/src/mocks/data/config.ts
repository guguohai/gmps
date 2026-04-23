import type { ModuleRow, ModuleSection } from '../../types/module'

export const CONFIG_DICT_ROWS: ModuleRow[] = [
      {
        "dictType": "申请原因",
        "code": "REASON_QUALITY",
        "name": "质量问题",
        "parentCode": "-",
        "sortNo": "1",
        "isDefault": "是",
        "status": "启用",
        "updater": "Admin",
        "action": "编辑",
        "id": "申请原因"
      },
      {
        "dictType": "支付方式",
        "code": "PAY_ALIPAY",
        "name": "支付宝",
        "parentCode": "-",
        "sortNo": "2",
        "isDefault": "否",
        "status": "启用",
        "updater": "Admin",
        "action": "编辑",
        "id": "支付方式"
      }
    ]

export const CONFIG_TEMPLATE_ROWS: ModuleRow[] = [
      {
        "templateType": "小程序消息",
        "code": "TPL_ORDER_CONFIRM",
        "templateName": "工单受理通知",
        "scenario": "工单管理",
        "triggerNode": "工单受理",
        "language": "中文",
        "status": "启用",
        "updater": "Admin",
        "action": "编辑",
        "id": "小程序消息"
      },
      {
        "templateType": "邮件模板",
        "code": "TPL_SURVEY_INVITE",
        "templateName": "问卷邀请模板",
        "scenario": "服务管理",
        "triggerNode": "问卷发放",
        "language": "English",
        "status": "启用",
        "updater": "Admin",
        "action": "编辑",
        "id": "邮件模板"
      }
    ]

export const CONFIG_STATUS_ROWS: ModuleRow[] = [
      {
        "bizObject": "工单管理",
        "statusCode": "TIK_PROCESSING",
        "statusName": "维修中",
        "description": "处理中",
        "status": "#177ee5",
        "updater": "",
        "action": "",
        "manualEdit": "",
        "recordStatus": "启用",
        "updatedBy": "Admin",
        "operation": "配置",
        "id": "工单管理"
      },
      {
        "bizObject": "库存申请",
        "statusCode": "INV_PENDING",
        "statusName": "待审批",
        "description": "处理中",
        "status": "#fb923c",
        "updater": "",
        "action": "",
        "manualEdit": "",
        "recordStatus": "启用",
        "updatedBy": "Admin",
        "operation": "配置",
        "id": "库存申请"
      }
    ]

export const CONFIG_DICT_SECTIONS: ModuleSection[] = [
      {
        "title": "基础信息",
        "fields": [
          {
            "key": "字典类型",
            "label": "字典类型",
            "type": "select",
            "value": "门店类型",
            "options": [
              "申请原因",
              "咨询分类",
              "支付方式",
              "门店类型"
            ]
          },
          {
            "key": "字典编码",
            "label": "字典编码",
            "type": "input",
            "value": "STORE_RETAIL"
          },
          {
            "key": "字典名称",
            "label": "字典名称",
            "type": "input",
            "value": "零售门店"
          },
          {
            "key": "英文名称",
            "label": "英文名称",
            "type": "input",
            "value": "Retail Store"
          },
          {
            "key": "韩文名称",
            "label": "韩文名称",
            "type": "input",
            "value": "소매점"
          },
          {
            "key": "上级字典编码",
            "label": "上级字典编码",
            "type": "select",
            "value": "- 无上级 -",
            "options": [
              "- 无上级 -",
              "一级分类 A"
            ]
          },
          {
            "key": "排序号",
            "label": "排序号",
            "type": "number",
            "value": "10"
          },
          {
            "key": "默认值标识",
            "label": "默认值标识",
            "type": "input",
            "value": ""
          },
          {
            "key": "状态",
            "label": "状态",
            "type": "input",
            "value": "active"
          },
          {
            "key": "启用",
            "label": "启用",
            "type": "input",
            "value": "active"
          },
          {
            "key": "禁用",
            "label": "禁用",
            "type": "input",
            "value": "active"
          },
          {
            "key": "扩展值1",
            "label": "扩展值1",
            "type": "input",
            "value": "Value A"
          },
          {
            "key": "扩展值2",
            "label": "扩展值2",
            "type": "input",
            "value": "Value B"
          },
          {
            "key": "备注",
            "label": "备注",
            "type": "textarea",
            "value": "在此输入字典说明..."
          }
        ]
      }
    ]

export const CONFIG_TEMPLATE_SECTIONS: ModuleSection[] = [
      {
        "title": "模板定义",
        "fields": [
          {
            "key": "模板类型",
            "label": "模板类型",
            "type": "select",
            "value": "小程序消息",
            "options": [
              "短信模板",
              "邮件模板",
              "站内消息",
              "小程序消息"
            ]
          },
          {
            "key": "模板编码",
            "label": "模板编码",
            "type": "input",
            "value": "TPL_ORDER_CONFIRM"
          },
          {
            "key": "模板名称",
            "label": "模板名称",
            "type": "input",
            "value": "工单受理通知"
          },
          {
            "key": "语言",
            "label": "语言",
            "type": "select",
            "value": "中文",
            "options": [
              "中文",
              "English",
              "한국어"
            ]
          },
          {
            "key": "模板标题",
            "label": "模板标题",
            "type": "input",
            "value": "您的服务订单已被受理"
          },
          {
            "key": "模板内容",
            "label": "模板内容",
            "type": "textarea",
            "value": "亲爱的客户：您的工单 {order_id} 已经于 {accept_time} 被正式受理。服务人员 {technician_name} 正准备为您提供服务。您可以点击下方链接查看实时进度：{tracking_url}。感谢您的信任！"
          },
          {
            "key": "变量占位符说明",
            "label": "变量占位符说明",
            "type": "textarea",
            "value": "{order_id} - 工单编号 {accept_time} - 受理时间 {technician_name} - 技术员姓名"
          },
          {
            "key": "触发节点",
            "label": "触发节点",
            "type": "select",
            "value": "工单状态变更为已受理",
            "options": [
              "工单状态变更为已受理",
              "物料发货成功"
            ]
          },
          {
            "key": "适用场景",
            "label": "适用场景",
            "type": "select",
            "value": "工单管理",
            "options": [
              "工单管理",
              "库存配置"
            ]
          },
          {
            "key": "是否默认模板",
            "label": "是否默认模板",
            "type": "input",
            "value": ""
          },
          {
            "key": "状态",
            "label": "状态",
            "type": "input",
            "value": "active"
          },
          {
            "key": "备注",
            "label": "备注",
            "type": "input",
            "value": "输入备注信息..."
          }
        ]
      },
      {
        "title": "基础信息",
        "fields": [
          {
            "key": "启用",
            "label": "启用",
            "type": "input",
            "value": "active"
          },
          {
            "key": "禁用",
            "label": "禁用",
            "type": "input",
            "value": "active"
          }
        ]
      }
    ]

export const CONFIG_STATUS_SECTIONS: ModuleSection[] = [
      {
        "title": "状态身份",
        "fields": [
          {
            "key": "业务对象",
            "label": "业务对象",
            "type": "select",
            "value": "工单管理",
            "options": [
              "工单管理",
              "库存申请"
            ]
          },
          {
            "key": "状态编码",
            "label": "状态编码",
            "type": "input",
            "value": "RECEIVED"
          },
          {
            "key": "状态名称",
            "label": "状态名称",
            "type": "input",
            "value": "已收到受理"
          },
          {
            "key": "英文名称",
            "label": "英文名称",
            "type": "input",
            "value": "Received"
          },
          {
            "key": "韩文名称",
            "label": "韩文名称",
            "type": "input",
            "value": "접수완료"
          },
          {
            "key": "可流转下一状态",
            "label": "可流转下一状态",
            "type": "input",
            "value": "on"
          },
          {
            "key": "触发动作",
            "label": "触发动作",
            "type": "textarea",
            "value": "状态变更时执行的逻辑或接口..."
          }
        ]
      },
      {
        "title": "基础信息",
        "fields": [
          {
            "key": "已收到受理received",
            "label": "已收到受理 RECEIVED",
            "type": "input",
            "value": "on"
          },
          {
            "key": "待判定wait_judge",
            "label": "待判定 WAIT_JUDGE",
            "type": "input",
            "value": "on"
          },
          {
            "key": "付款待机wait_payment",
            "label": "付款待机 WAIT_PAYMENT",
            "type": "input",
            "value": "on"
          },
          {
            "key": "未付款关闭closed_unpaid",
            "label": "未付款关闭 CLOSED_UNPAID",
            "type": "input",
            "value": "on"
          },
          {
            "key": "维修进行中repairing",
            "label": "维修进行中 REPAIRING",
            "type": "input",
            "value": "on"
          },
          {
            "key": "等待配件wait_parts",
            "label": "等待配件 WAIT_PARTS",
            "type": "input",
            "value": "on"
          },
          {
            "key": "待出库处理wait_outbound",
            "label": "待出库处理 WAIT_OUTBOUND",
            "type": "input",
            "value": "on"
          },
          {
            "key": "已发货shipped",
            "label": "已发货 SHIPPED",
            "type": "input",
            "value": "on"
          },
          {
            "key": "配送中in_delivery",
            "label": "配送中 IN_DELIVERY",
            "type": "input",
            "value": "on"
          },
          {
            "key": "门店收货完成store_received",
            "label": "门店收货完成 STORE_RECEIVED",
            "type": "input",
            "value": "on"
          },
          {
            "key": "服务完成completed",
            "label": "服务完成 COMPLETED",
            "type": "input",
            "value": "on"
          },
          {
            "key": "已取消canceled",
            "label": "已取消 CANCELED",
            "type": "input",
            "value": "on"
          },
          {
            "key": "启用",
            "label": "启用",
            "type": "input",
            "value": "active"
          },
          {
            "key": "禁用",
            "label": "禁用",
            "type": "input",
            "value": "active"
          }
        ]
      },
      {
        "title": "视觉与属性",
        "fields": [
          {
            "key": "状态分类",
            "label": "状态分类",
            "type": "select",
            "value": "处理中",
            "options": [
              "待处理",
              "处理中",
              "已结束"
            ]
          },
          {
            "key": "前端标签颜色",
            "label": "前端标签颜色",
            "type": "input",
            "value": "#177ee5"
          },
          {
            "key": "是否初始状态",
            "label": "是否初始状态",
            "type": "input",
            "value": "on"
          },
          {
            "key": "是否结束状态",
            "label": "是否结束状态",
            "type": "input",
            "value": "on"
          },
          {
            "key": "是否允许手工修改",
            "label": "是否允许手工修改",
            "type": "input",
            "value": "on"
          },
          {
            "key": "状态",
            "label": "状态",
            "type": "input",
            "value": "active"
          },
          {
            "key": "状态业务说明",
            "label": "状态业务说明",
            "type": "textarea",
            "value": "输入状态业务说明..."
          },
          {
            "key": "内部备注信息",
            "label": "内部备注信息",
            "type": "textarea",
            "value": "内部备注信息..."
          }
        ]
      }
    ]
