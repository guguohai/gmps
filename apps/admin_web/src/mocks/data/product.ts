import type { ModuleRow, ModuleSection } from '../../types/module'

export const PRODUCT_LIST_ROWS: ModuleRow[] = [
      {
        "productId": "20000001",
        "productName": "HER 01",
        "category": "SUNGLASS COMBI",
        "factory1": "Factory KR",
        "factory2": "Factory CN",
        "factory3": "-",
        "launchDate": "2024-01-15",
        "partWarranty": "5 years",
        "inventoryDist": "PS、3PL",
        "localTotal": "1,420",
        "frozen": "60",
        "transfer": "96",
        "available": "1,264",
        "stockStatus": "-",
        "warehouseDetails": [
          { "key": "20000001-1117", "warehouse": "PS", "location": "C001-1117", "overview": "PS镜像重点库位", "localTotal": "920", "frozen": "42", "transfer": "80", "available": "798", "status": "-" },
          { "key": "20000001-1020", "warehouse": "3PL", "location": "C002-1020", "overview": "3PL收货与日常出入库仓", "localTotal": "500", "frozen": "18", "transfer": "16", "available": "466", "status": "-" }
        ],
        "id": "20000001"
      },
      {
        "productId": "20000002",
        "productName": "DREAMER 17 01",
        "category": "SUNGLASS COMBI",
        "factory1": "Factory KR",
        "factory2": "-",
        "factory3": "-",
        "launchDate": "2024-02-20",
        "partWarranty": "3 years",
        "inventoryDist": "PS、3PL",
        "localTotal": "7",
        "frozen": "2",
        "transfer": "3",
        "available": "2",
        "stockStatus": "缺货",
        "warehouseDetails": [
          { "key": "20000002-1117", "warehouse": "PS", "location": "C001-1117", "overview": "PS镜像重点库位", "localTotal": "4", "frozen": "1", "transfer": "1", "available": "2", "status": "缺货" },
          { "key": "20000002-1020", "warehouse": "3PL", "location": "C002-1020", "overview": "3PL收货与日常出入库仓", "localTotal": "3", "frozen": "1", "transfer": "2", "available": "0", "status": "缺货" }
        ],
        "id": "20000002"
      },
      {
        "productId": "20000003",
        "productName": "LANG 01",
        "category": "SUNGLASS COMBI",
        "factory1": "Factory KR",
        "factory2": "Factory CN",
        "factory3": "Factory KR-B",
        "launchDate": "2024-03-10",
        "partWarranty": "7 years",
        "inventoryDist": "PS、3PL",
        "localTotal": "2,370",
        "frozen": "180",
        "transfer": "120",
        "available": "2,070",
        "stockStatus": "-",
        "warehouseDetails": [
          { "key": "20000003-1117", "warehouse": "PS", "location": "C001-1117", "overview": "PS镜像重点库位", "localTotal": "1,420", "frozen": "84", "transfer": "120", "available": "1,216", "status": "-" },
          { "key": "20000003-1020", "warehouse": "3PL", "location": "C002-1020", "overview": "3PL收货与日常出入库仓", "localTotal": "950", "frozen": "96", "transfer": "0", "available": "854", "status": "-" }
        ],
        "id": "20000003"
      }
    ]

export const PRODUCT_LIST_SECTIONS: ModuleSection[] = [
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
          { "key": "inventoryDistribution", "label": "库存分布", "type": "input", "value": "PS、3PL" },
          { "key": "localTotal", "label": "本地总库存", "type": "input", "value": "1,420" },
          { "key": "frozenStock", "label": "冻结库存", "type": "input", "value": "60" },
          { "key": "transfering", "label": "调拨中", "type": "input", "value": "96" },
          { "key": "availableStock", "label": "可用库存", "type": "input", "value": "1,264" },
          { "key": "stockStatus", "label": "安全库存状态", "type": "input", "value": "-" }
        ]
      }
    ]
