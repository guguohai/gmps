import type { ModuleSchema } from './types'

export const inventorySchemas: ModuleSchema[] = [
{
    "path": "/inventory/request",
    "title": "申请单",
    "breadcrumb": [
      "库存管理",
      "申请单"
    ],
    "filters": [
      {
        "key": "c1",
        "label": "工单ID",
        "type": "input",
        "placeholder": "输入工单ID"
      },
      {
        "key": "c2",
        "label": "请求时间",
        "type": "date"
      },
      {
        "key": "c3",
        "label": "进度状态",
        "type": "select",
        "options": ["全部", "待处理", "处理中", "已完成", "已关闭"]
      },
      {
        "key": "c4",
        "label": "请求负责人",
        "type": "select",
        "placeholder": "请选择请求负责人",
        "options": ["全部", "陈雨桐", "唐嘉蔚", "林浩然", "苏芮", "张晓峰", "马会宁", "周晨曦", "宋逸凡"]
      },
      {
        "key": "c5",
        "label": "产品编码",
        "type": "input",
        "placeholder": "输入产品编码"
      },
      {
        "key": "c6",
        "label": "产品名称",
        "type": "input",
        "placeholder": "输入产品名称"
      },
      {
        "key": "c7",
        "label": "存放位置",
        "type": "input",
        "placeholder": "输入存放位置"
      },
      {
        "key": "c9",
        "label": "处理人",
        "type": "input",
        "placeholder": "输入处理人"
      }
    ],
    "columns": [
      {
        "key": "c1",
        "title": "工单ID",
        "width": 120
      },
      {
        "key": "c2",
        "title": "请求时间",
        "width": 160
      },
      {
        "key": "c3",
        "title": "进度状态",
        "width": 100
      },
      {
        "key": "c4",
        "title": "请求负责人",
        "width": 100
      },
      {
        "key": "c5",
        "title": "产品编码",
        "width": 140
      },
      {
        "key": "c6",
        "title": "产品名称",
        "width": 180
      },
      {
        "key": "c7",
        "title": "存放位置",
        "width": 160
      },
      {
        "key": "c8",
        "title": "请求数量",
        "width": 90,
        "align": "right"
      },
      {
        "key": "c9",
        "title": "处理人",
        "width": 100
      },
      {
        "key": "c10",
        "title": "操作",
        "width": 80
      }
    ],
    "rows": [
      {
        "c1": "115001",
        "c2": "2026-04-10 09:18",
        "c3": "处理中",
        "c4": "陈雨桐",
        "c5": "GM-2024-001",
        "c6": "GM 智能眼镜 Pro",
        "c7": "仓库 C001 - 1117",
        "c8": "2",
        "c9": "周晨曦",
        "c10": "查看",
        "id": "INV-REQ-2026041001"
      },
      {
        "c1": "114088",
        "c2": "2026-04-11 14:26",
        "c3": "待处理",
        "c4": "唐嘉蔚",
        "c5": "GM-2024-015",
        "c6": "GM 太阳镜 Classic",
        "c7": "办公室仓 C002 - 1020",
        "c8": "5",
        "c9": "-",
        "c10": "查看",
        "id": "INV-REQ-2026041002"
      },
      {
        "c1": "114042",
        "c2": "2026-04-09 11:05",
        "c3": "已完成",
        "c4": "林浩然",
        "c5": "GM-2023-089",
        "c6": "GM 光学镜架 Titanium",
        "c7": "仓库 C001 - 1117",
        "c8": "3",
        "c9": "马会宁",
        "c10": "查看",
        "id": "INV-REQ-2026040901"
      },
      {
        "c1": "113205",
        "c2": "2026-04-08 15:30",
        "c3": "已关闭",
        "c4": "苏芮",
        "c5": "GM-2024-032",
        "c6": "GM 运动眼镜 Active",
        "c7": "仓库 C001 - 1117",
        "c8": "1",
        "c9": "宋逸凡",
        "c10": "查看",
        "id": "INV-REQ-2026040801"
      },
      {
        "c1": "113100",
        "c2": "2026-04-07 10:00",
        "c3": "已完成",
        "c4": "张晓峰",
        "c5": "GM-2024-056",
        "c6": "GM 蓝光护目镜 Office",
        "c7": "办公室仓 C002 - 1020",
        "c8": "4",
        "c9": "周晨曦",
        "c10": "查看",
        "id": "INV-REQ-2026040701"
      }
    ],
    "sections": [
      {
        "title": "申请信息",
        "fields": [
          {
            "key": "ticketId",
            "label": "工单ID",
            "type": "input",
            "value": "114042",
            "editable": false
          },
          {
            "key": "requestTime",
            "label": "请求时间",
            "type": "date",
            "value": "2026-04-09T11:05",
            "editable": false
          },
          {
            "key": "requestOwner",
            "label": "请求负责人",
            "type": "input",
            "value": "林浩然",
            "editable": false
          },
          {
            "key": "productName",
            "label": "产品名称",
            "type": "searchSelect",
            "value": "GM 光学镜架 Titanium",
            "options": ["GM 智能眼镜 Pro", "GM 太阳镜 Classic", "GM 光学镜架 Titanium", "GM 运动眼镜 Active", "GM 蓝光护目镜 Office"],
            "editable": true
          },
          {
            "key": "productCode",
            "label": "产品编码",
            "type": "input",
            "value": "GM-2023-089",
            "editable": false
          },
          {
            "key": "storageLocation",
            "label": "存放位置",
            "type": "input",
            "value": "仓库 C001 - 1117",
            "editable": false
          },
          {
            "key": "requestQty",
            "label": "请求数量",
            "type": "number",
            "value": "3",
            "editable": true
          },
          {
            "key": "requestReason",
            "label": "申请原因",
            "type": "textarea",
            "value": "客户维修需求，当前库存不足无法完成维修。",
            "editable": true
          }
        ]
      },
      {
        "title": "处理信息",
        "fields": [
          {
            "key": "progressStatus",
            "label": "进度状态",
            "type": "select",
            "value": "已完成",
            "options": ["待处理", "处理中", "已完成", "已关闭"],
            "editable": true
          },
          {
            "key": "handleTime",
            "label": "处理时间",
            "type": "date",
            "value": "2026-04-09T13:40",
            "editable": true
          },
          {
            "key": "handler",
            "label": "处理人",
            "type": "searchSelect",
            "value": "马会宁",
            "options": ["马会宁", "周晨曦", "宋逸凡", "苏芮", "张经理", "李经理", "王经理"],
            "editable": true
          }
        ]
      }
    ]
  },
{
    "path": "/inventory/sync",
    "title": "同步日志",
    "breadcrumb": [
      "库存管理",
      "同步日志"
    ],
    "filters": [
      {
        "key": "f1",
        "label": "同步批次号",
        "type": "input",
        "placeholder": "输入同步批次号"
      },
      {
        "key": "f2",
        "label": "同步对象",
        "type": "select",
        "options": [
          "全部"
        ]
      },
      {
        "key": "f3",
        "label": "状态",
        "type": "select",
        "options": [
          "全部"
        ]
      },
      {
        "key": "f4",
        "label": "开始时间",
        "type": "date"
      }
    ],
    "columns": [
      {
        "key": "c1",
        "title": "同步批次号",
        "width": 180
      },
      {
        "key": "c2",
        "title": "同步对象",
        "width": 140
      },
      {
        "key": "c3",
        "title": "同步类型",
        "width": 140
      },
      {
        "key": "c4",
        "title": "开始时间",
        "width": 140
      },
      {
        "key": "c5",
        "title": "结束时间",
        "width": 140
      },
      {
        "key": "c6",
        "title": "状态",
        "width": 140
      },
      {
        "key": "c7",
        "title": "成功数量",
        "width": 140
      },
      {
        "key": "c8",
        "title": "失败数量",
        "width": 140
      },
      {
        "key": "c9",
        "title": "差异数量",
        "width": 140
      },
      {
        "key": "c10",
        "title": "触发方式",
        "width": 140
      },
      {
        "key": "c11",
        "title": "更新时间",
        "width": 140
      },
      {
        "key": "c12",
        "title": "操作",
        "width": 140
      }
    ],
    "rows": [
      {
        "c1": "410001",
        "c2": "产品库存",
        "c3": "全量同步",
        "c4": "2026-04-10 03:00:00",
        "c5": "2026-04-10 03:18:00",
        "c6": "执行成功",
        "c7": "1250",
        "c8": "0",
        "c9": "6",
        "c10": "定时任务",
        "c11": "2026-04-10 03:18:00",
        "c12": "详情",
        "id": "410001"
      },
      {
        "c1": "410002",
        "c2": "库存冻结信息",
        "c3": "增量同步",
        "c4": "2026-04-10 10:00:00",
        "c5": "2026-04-10 10:03:00",
        "c6": "部分成功",
        "c7": "48",
        "c8": "2",
        "c9": "1",
        "c10": "补偿任务",
        "c11": "2026-04-10 10:03:00",
        "c12": "详情",
        "id": "410002"
      },
      {
        "c1": "410003",
        "c2": "价格主数据",
        "c3": "补偿同步",
        "c4": "2026-04-10 15:30:00",
        "c5": "2026-04-10 15:36:00",
        "c6": "执行失败",
        "c7": "0",
        "c8": "35",
        "c9": "0",
        "c10": "手工触发",
        "c11": "2026-04-10 15:36:00",
        "c12": "详情",
        "id": "410003"
      }
    ],
    "sections": [
      {
        "title": "基础信息",
        "fields": [
          {
            "key": "同步批次号",
            "label": "同步批次号",
            "value": "410001"
          },
          {
            "key": "同步对象",
            "label": "同步对象",
            "value": "产品库存"
          },
          {
            "key": "同步类型",
            "label": "同步类型",
            "value": "全量同步"
          },
          {
            "key": "触发方式",
            "label": "触发方式",
            "value": "定时任务"
          },
          {
            "key": "开始时间",
            "label": "开始时间",
            "value": "2026-04-10 03:00:00"
          },
          {
            "key": "结束时间",
            "label": "结束时间",
            "value": "2026-04-10 03:18:00"
          },
          {
            "key": "状态",
            "label": "状态",
            "value": "执行成功"
          },
          {
            "key": "成功数量",
            "label": "成功数量",
            "value": "1250"
          },
          {
            "key": "失败数量",
            "label": "失败数量",
            "value": "0"
          },
          {
            "key": "差异数量",
            "label": "差异数量",
            "value": "6"
          },
          {
            "key": "来源系统",
            "label": "来源系统",
            "value": "SAP"
          },
          {
            "key": "目标系统",
            "label": "目标系统",
            "value": "PS Admin"
          },
          {
            "key": "执行任务名称",
            "label": "执行任务名称",
            "value": "inventory_full_sync_job"
          },
          {
            "key": "执行人",
            "label": "执行人",
            "value": "系统定时同步"
          },
          {
            "key": "异常摘要",
            "label": "异常摘要",
            "value": ""
          },
          {
            "key": "失败明细",
            "label": "失败明细",
            "value": "本批次失败数量为 0，无失败明细。"
          },
          {
            "key": "处理结果",
            "label": "处理结果",
            "value": "同步完成，已更新产品库存数据并记录差异项。"
          },
          {
            "key": "备注",
            "label": "备注",
            "value": ""
          }
        ]
      }
    ]
  },
{
    "path": "/inventory/record",
    "title": "库存记录",
    "breadcrumb": [
      "库存管理",
      "库存记录"
    ],
    "filters": [
      {
        "key": "f1",
        "label": "交易编号",
        "type": "input",
        "placeholder": "输入交易编号"
      },
      {
        "key": "f2",
        "label": "记录类型",
        "type": "select",
        "options": [
          "全部"
        ]
      },
      {
        "key": "f3",
        "label": "产品名称",
        "type": "select",
        "options": [
          "全部"
        ]
      },
      {
        "key": "f4",
        "label": "操作人",
        "type": "date"
      }
    ],
    "columns": [
      {
        "key": "c1",
        "title": "交易编号",
        "width": 180
      },
      {
        "key": "c2",
        "title": "记录类型",
        "width": 140
      },
      {
        "key": "c3",
        "title": "产品编码",
        "width": 140
      },
      {
        "key": "c4",
        "title": "产品名称",
        "width": 140
      },
      {
        "key": "c5",
        "title": "仓库/位置",
        "width": 140
      },
      {
        "key": "c6",
        "title": "变动数量",
        "width": 140
      },
      {
        "key": "c7",
        "title": "变动方向",
        "width": 140
      },
      {
        "key": "c8",
        "title": "变动前数量",
        "width": 140
      },
      {
        "key": "c9",
        "title": "变动后数量",
        "width": 140
      },
      {
        "key": "c10",
        "title": "业务来源类型",
        "width": 140
      },
      {
        "key": "c11",
        "title": "来源单号",
        "width": 140
      },
      {
        "key": "c12",
        "title": "操作时间",
        "width": 140
      },
      {
        "key": "c13",
        "title": "操作人",
        "width": 140
      },
      {
        "key": "c14",
        "title": "备注",
        "width": 140
      },
      {
        "key": "c15",
        "title": "详情",
        "width": 140
      }
    ],
    "rows": [
      {
        "c1": "510001",
        "c2": "入库",
        "c3": "GM-SN-00128",
        "c4": "GENTLE MONSTER LANG 01",
        "c5": "办公室仓 / C002-1020",
        "c6": "10",
        "c7": "增加",
        "c8": "25",
        "c9": "35",
        "c10": "申请单",
        "c11": "310009",
        "c12": "2026-04-10 09:15:00",
        "c13": "张敏",
        "c14": "维修补货入库",
        "c15": "详情",
        "id": "510001"
      },
      {
        "c1": "510002",
        "c2": "冻结",
        "c3": "GM-PT-00056",
        "c4": "镜腿配件-黑色",
        "c5": "PS仓 / C001-1117",
        "c6": "2",
        "c7": "冻结",
        "c8": "18",
        "c9": "16",
        "c10": "出库单",
        "c11": "OUT20260410001",
        "c12": "2026-04-10 10:20:00",
        "c13": "李晨",
        "c14": "维修领用冻结",
        "c15": "详情",
        "id": "510002"
      },
      {
        "c1": "510003",
        "c2": "库存调整",
        "c3": "GM-LS-00321",
        "c4": "镜片组件-透明",
        "c5": "大仓 / C001-1110",
        "c6": "3",
        "c7": "释放",
        "c8": "12",
        "c9": "15",
        "c10": "差异处理",
        "c11": "610002",
        "c12": "2026-04-10 11:05:00",
        "c13": "王雪",
        "c14": "冻结未释放修正",
        "c15": "详情",
        "id": "510003"
      }
    ],
    "sections": [
      {
        "title": "基础信息",
        "fields": [
          {
            "key": "交易编号",
            "label": "交易编号",
            "value": "510001"
          },
          {
            "key": "记录类型",
            "label": "记录类型",
            "value": "入库"
          },
          {
            "key": "产品编码",
            "label": "产品编码",
            "value": "GM-SN-00128"
          },
          {
            "key": "产品名称",
            "label": "产品名称",
            "value": "GENTLE MONSTER LANG 01"
          },
          {
            "key": "仓库位置",
            "label": "仓库/位置",
            "value": "办公室仓 / C002-1020"
          },
          {
            "key": "变动数量",
            "label": "变动数量",
            "value": "10"
          },
          {
            "key": "变动方向",
            "label": "变动方向",
            "value": "增加"
          },
          {
            "key": "变动前数量",
            "label": "变动前数量",
            "value": "25"
          },
          {
            "key": "变动后数量",
            "label": "变动后数量",
            "value": "35"
          },
          {
            "key": "业务来源类型",
            "label": "业务来源类型",
            "value": "申请单"
          },
          {
            "key": "来源单号",
            "label": "来源单号",
            "value": "310009"
          },
          {
            "key": "操作时间",
            "label": "操作时间",
            "value": "2026-04-10 09:15:00"
          },
          {
            "key": "操作人",
            "label": "操作人",
            "value": "张敏"
          },
          {
            "key": "备注",
            "label": "备注",
            "value": "维修补货入库"
          }
        ]
      }
    ]
  }
]
