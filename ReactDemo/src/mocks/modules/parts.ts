import type { ModuleSchema } from './types'

export const partsSchemas: ModuleSchema[] = [
{
    "path": "/parts/list",
    "title": "小零件列表",
    "breadcrumb": [
      "小零件管理",
      "小零件列表"
    ],
    "filters": [
      {
        "key": "f1",
        "label": "小零件 ID",
        "type": "input",
        "placeholder": "输入小零件 ID"
      },
      {
        "key": "f2",
        "label": "小零件名称",
        "type": "select",
        "options": [
          "全部"
        ]
      },
      {
        "key": "f3",
        "label": "颜色",
        "type": "select",
        "options": [
          "全部"
        ]
      },
      {
        "key": "f4",
        "label": "规格",
        "type": "date"
      }
    ],
    "columns": [
      {
        "key": "c1",
        "title": "小零件ID",
        "width": 180
      },
      {
        "key": "c2",
        "title": "小零件名称",
        "width": 140
      },
      {
        "key": "c3",
        "title": "数量",
        "width": 140
      },
      {
        "key": "c4",
        "title": "颜色",
        "width": 140
      },
      {
        "key": "c5",
        "title": "规格",
        "width": 140
      },
      {
        "key": "c6",
        "title": "存放位置",
        "width": 140
      },
      {
        "key": "c7",
        "title": "操作",
        "width": 140
      }
    ],
    "rows": [
      {
        "c1": "100001",
        "c2": "钛合金鼻托 (Titanium Nose Pad)",
        "c3": "500",
        "c4": "银色 (Silver)",
        "c5": "12mm",
        "c6": "A1, 1/A01",
        "c7": "查看",
        "id": "100001"
      },
      {
        "c1": "100002",
        "c2": "定制镜腿螺丝 (Temple Screw)",
        "c3": "1200",
        "c4": "金色 (Gold)",
        "c5": "1.2×3.5mm",
        "c6": "B2, 3/B12",
        "c7": "查看",
        "id": "100002"
      },
      {
        "c1": "100003",
        "c2": "HER系列 镜腿内衬套",
        "c3": "350",
        "c4": "黑色 (Black)",
        "c5": "145mm 适用",
        "c6": "C1, 2/C05",
        "c7": "查看",
        "id": "100003"
      }
    ],
    "sections": [
      {
        "title": "基础信息",
        "fields": [
          {
            "key": "小零件名称",
            "label": "小零件名称",
            "type": "input",
            "value": "钛合金鼻托 (Titanium Nose Pad)"
          },
          {
            "key": "总数量",
            "label": "总数量",
            "type": "number",
            "value": "150"
          },
          {
            "key": "存放位置",
            "label": "存放位置",
            "type": "input",
            "value": "A-102-05"
          }
        ]
      }
    ]
  },
{
    "path": "/parts/request",
    "title": "申请单",
    "breadcrumb": [
      "小零件管理",
      "申请单"
    ],
    "filters": [
      {
        "key": "f1",
        "label": "请求时间",
        "type": "input",
        "placeholder": "输入请求时间"
      },
      {
        "key": "f2",
        "label": "请求负责人",
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
        "label": "门店类型",
        "type": "date"
      }
    ],
    "columns": [
      {
        "key": "c1",
        "title": "请求时间",
        "width": 180
      },
      {
        "key": "c2",
        "title": "请求负责人",
        "width": 140
      },
      {
        "key": "c3",
        "title": "门店类型",
        "width": 140
      },
      {
        "key": "c4",
        "title": "门店名称",
        "width": 140
      },
      {
        "key": "c5",
        "title": "产品名称",
        "width": 140
      },
      {
        "key": "c6",
        "title": "小零件名称",
        "width": 140
      },
      {
        "key": "c7",
        "title": "小零件存放位置",
        "width": 140
      },
      {
        "key": "c8",
        "title": "颜色",
        "width": 140
      },
      {
        "key": "c9",
        "title": "数量",
        "width": 140
      },
      {
        "key": "c10",
        "title": "状态",
        "width": 140
      },
      {
        "key": "c11",
        "title": "操作",
        "width": 140
      }
    ],
    "rows": [
      {
        "c1": "2024-03-24 14:15",
        "c2": "Sarah Johnson",
        "c3": "百货",
        "c4": "北京SKP店",
        "c5": "Bold Series B-01",
        "c6": "鼻托 (Nose Pads)",
        "c7": "C-03-12",
        "c8": "透明 (Clear)",
        "c9": "100",
        "c10": "已通过",
        "c11": "查看",
        "id": "2024-03-24 14:15"
      },
      {
        "c1": "2024-03-24 16:45",
        "c2": "Emma Davis",
        "c3": "免税店",
        "c4": "三亚海棠湾免税店",
        "c5": "LILIT 01",
        "c6": "镜片 (Lens)",
        "c7": "L-05-02",
        "c8": "渐变灰 (Grey Gradient)",
        "c9": "15",
        "c10": "已拒绝",
        "c11": "查看",
        "id": "2024-03-24 16:45"
      }
    ],
    "sections": [
      {
        "title": "基础信息",
        "fields": [
          {
            "key": "进度状态",
            "label": "进度状态",
            "type": "select",
            "value": "等待出库",
            "options": [
              "数量变动出库",
              "等待库存入库",
              "等待出库",
              "出库完成",
              "特殊注意事项",
              "无法出库"
            ]
          },
          {
            "key": "请求负责人",
            "label": "请求负责人",
            "type": "input",
            "value": ""
          },
          {
            "key": "门店类型",
            "label": "门店类型",
            "type": "select",
            "value": "旗舰店",
            "options": [
              "旗舰店",
              "百货",
              "商场",
              "免税店",
              "眼镜店",
              "买手店",
              "集合店",
              "官方线上商城",
              "海外法人（子公司）",
              "海外法人（合资公司）",
              "PS",
              "其他"
            ]
          },
          {
            "key": "门店名称",
            "label": "门店名称",
            "type": "input",
            "value": "搜索门店..."
          },
          {
            "key": "产品名称",
            "label": "产品名称",
            "type": "input",
            "value": "搜索产品..."
          },
          {
            "key": "小零件名称",
            "label": "小零件名称",
            "type": "input",
            "value": "搜索小零件..."
          },
          {
            "key": "小零件存放位置",
            "label": "小零件存放位置",
            "type": "input",
            "value": "A-12-05"
          },
          {
            "key": "颜色",
            "label": "颜色",
            "type": "select",
            "value": "黑色 (Black)",
            "options": [
              "黑色 (Black)",
              "玳瑁色 (Tortoise)",
              "金色 (Gold)",
              "银色 (Silver)",
              "透明 (Clear)",
              "灰色 (Grey)"
            ]
          },
          {
            "key": "数量",
            "label": "数量",
            "type": "select",
            "value": "20",
            "options": [
              "1",
              "3",
              "5",
              "10",
              "20",
              "30",
              "50"
            ]
          },
          {
            "key": "附加需求事项",
            "label": "附加需求事项",
            "type": "textarea",
            "value": "需要尽快配送，门店库存告急。"
          }
        ]
      }
    ]
  }
]
