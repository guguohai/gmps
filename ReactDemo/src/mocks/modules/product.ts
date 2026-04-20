import type { ModuleSchema } from './types'

export const productSchemas: ModuleSchema[] = [
{
    "path": "/product/list",
    "title": "产品列表",
    "breadcrumb": [
      "产品管理",
      "产品列表"
    ],
    "filters": [
      {
        "key": "f1",
        "label": "产品 ID",
        "type": "input",
        "placeholder": "输入产品 ID"
      },
      {
        "key": "f2",
        "label": "产品名称",
        "type": "input",
        "placeholder": "输入产品名称"
      },
      {
        "key": "f3",
        "label": "产品类别",
        "type": "input",
        "placeholder": "输入产品类别"
      },
      {
        "key": "f4",
        "label": "生产工厂",
        "type": "select",
        "options": [
          "全部",
          "Factory KR",
          "Factory CN",
          "Factory KR-B"
        ]
      },
      {
        "key": "f5",
        "label": "上市日期",
        "type": "date"
      },
      {
        "key": "f6",
        "label": "零件保有期限",
        "type": "input",
        "placeholder": "输入零件保有期限"
      },
      {
        "key": "f7",
        "label": "库存仓",
        "type": "select",
        "options": [
          "全部",
          "大仓（C001-1110）",
          "PS仓（C001-1117）",
          "办公室仓（C002-1020）"
        ]
      },
      {
        "key": "f8",
        "label": "可用库存",
        "type": "input",
        "placeholder": "输入可用库存"
      }
    ],
    "columns": [
      { "key": "c1", "title": "产品 ID", "width": 180 },
      { "key": "c2", "title": "产品名称", "width": 140 },
      { "key": "c3", "title": "产品类别", "width": 140 },
      { "key": "c4", "title": "生产工厂 1", "width": 140 },
      { "key": "c5", "title": "生产工厂 2", "width": 140 },
      { "key": "c6", "title": "生产工厂 3", "width": 140 },
      { "key": "c7", "title": "上市日期", "width": 140 },
      { "key": "c8", "title": "零件保有期限", "width": 140 },
      { "key": "c9", "title": "库存分布", "width": 160 },
      { "key": "c10", "title": "本地总库存", "width": 140 },
      { "key": "c11", "title": "冻结库存", "width": 140 },
      { "key": "c12", "title": "调拨中", "width": 140 },
      { "key": "c13", "title": "可用库存", "width": 120 },
      { "key": "c14", "title": "安全库存状态", "width": 140 }
    ],
    "rows": [
      {
        "c1": "20000001",
        "c2": "HER 01",
        "c3": "SUNGLASS COMBI",
        "c4": "Factory KR",
        "c5": "Factory CN",
        "c6": "-",
        "c7": "2024-01-15",
        "c8": "5 years",
        "c9": "大仓、PS仓、办公室仓",
        "c10": "2,100",
        "c11": "60",
        "c12": "120",
        "c13": "1,920",
        "c14": "-",
        "warehouseDetails": [
          { "key": "20000001-1110", "warehouse": "大仓", "location": "C001-1110", "overview": "SAP主库位", "localTotal": "680", "frozen": "0", "transfer": "24", "available": "656", "status": "-" },
          { "key": "20000001-1117", "warehouse": "PS仓", "location": "C001-1117", "overview": "PS镜像重点库位", "localTotal": "920", "frozen": "42", "transfer": "80", "available": "798", "status": "-" },
          { "key": "20000001-1020", "warehouse": "办公室仓", "location": "C002-1020", "overview": "PS收货与日常出入库仓", "localTotal": "500", "frozen": "18", "transfer": "16", "available": "466", "status": "-" }
        ],
        "id": "20000001"
      },
      {
        "c1": "20000002",
        "c2": "DREAMER 17 01",
        "c3": "SUNGLASS COMBI",
        "c4": "Factory KR",
        "c5": "-",
        "c6": "-",
        "c7": "2024-02-20",
        "c8": "3 years",
        "c9": "大仓、PS仓、办公室仓",
        "c10": "10",
        "c11": "2",
        "c12": "4",
        "c13": "6",
        "c14": "缺货",
        "warehouseDetails": [
          { "key": "20000002-1110", "warehouse": "大仓", "location": "C001-1110", "overview": "SAP主库位", "localTotal": "3", "frozen": "0", "transfer": "1", "available": "2", "status": "缺货" },
          { "key": "20000002-1117", "warehouse": "PS仓", "location": "C001-1117", "overview": "PS镜像重点库位", "localTotal": "4", "frozen": "1", "transfer": "1", "available": "2", "status": "缺货" },
          { "key": "20000002-1020", "warehouse": "办公室仓", "location": "C002-1020", "overview": "PS收货与日常出入库仓", "localTotal": "3", "frozen": "1", "transfer": "2", "available": "0", "status": "缺货" }
        ],
        "id": "20000002"
      },
      {
        "c1": "20000003",
        "c2": "LANG 01",
        "c3": "SUNGLASS COMBI",
        "c4": "Factory KR",
        "c5": "Factory CN",
        "c6": "Factory KR-B",
        "c7": "2024-03-10",
        "c8": "7 years",
        "c9": "大仓、PS仓、办公室仓",
        "c10": "3,550",
        "c11": "180",
        "c12": "215",
        "c13": "3,155",
        "c14": "-",
        "warehouseDetails": [
          { "key": "20000003-1110", "warehouse": "大仓", "location": "C001-1110", "overview": "SAP主库位", "localTotal": "1,180", "frozen": "0", "transfer": "95", "available": "1,085", "status": "-" },
          { "key": "20000003-1117", "warehouse": "PS仓", "location": "C001-1117", "overview": "PS镜像重点库位", "localTotal": "1,420", "frozen": "84", "transfer": "120", "available": "1,216", "status": "-" },
          { "key": "20000003-1020", "warehouse": "办公室仓", "location": "C002-1020", "overview": "PS收货与日常出入库仓", "localTotal": "950", "frozen": "96", "transfer": "0", "available": "854", "status": "-" }
        ],
        "id": "20000003"
      }
    ],
    "sections": [
      {
        "title": "基础信息",
        "fields": [
          { "key": "productId", "label": "产品 ID", "type": "input", "value": "20000001" },
          { "key": "productName", "label": "产品名称", "type": "input", "value": "MOLSION 陌森 SUNGLASS COMBI" },
          { "key": "productCategory", "label": "产品类别", "type": "input", "value": "SUNGLASS COMBI" },
          { "key": "factory1", "label": "生产工厂 1", "type": "select", "value": "Factory KR-01", "options": ["Factory KR-01", "Factory CN-05", "Factory KR-B"] },
          { "key": "factory2", "label": "生产工厂 2", "type": "select", "value": "Factory CN-05", "options": ["Factory KR-01", "Factory CN-05", "Factory KR-B", "-"] },
          { "key": "factory3", "label": "生产工厂 3", "type": "select", "value": "-", "options": ["Factory KR-01", "Factory CN-05", "Factory KR-B", "-"] },
          { "key": "launchDate", "label": "上市日期", "type": "date", "value": "2024-03-15" },
          { "key": "retentionPeriod", "label": "零件保有期限", "type": "input", "value": "5 年" },
          { "key": "inventoryDistribution", "label": "库存分布", "type": "input", "value": "大仓、PS仓、办公室仓" },
          { "key": "localTotal", "label": "本地总库存", "type": "input", "value": "2,100" },
          { "key": "frozenStock", "label": "冻结库存", "type": "input", "value": "60" },
          { "key": "transfering", "label": "调拨中", "type": "input", "value": "120" },
          { "key": "availableStock", "label": "可用库存", "type": "input", "value": "1,920" },
          { "key": "stockStatus", "label": "安全库存状态", "type": "input", "value": "-" }
        ]
      }
    ]
  }
]
