import type { ModuleRow, ModuleSection } from '../../types/module'

export const INVENTORY_REQUEST_ROWS: ModuleRow[] = [
      {
        "ticketId": "115001",
        "requestTime": "2026-04-10 09:18",
        "progressStatus": "处理中",
        "requester": "陈雨桐",
        "productCode": "GM-2024-001",
        "productName": "GM 智能眼镜 Pro",
        "location": "C001-1117",
        "requestQty": "2",
        "processor": "周晨曦",
        "triggerMethod": "查看",
        "id": "INV-REQ-2026041001"
      },
      {
        "ticketId": "114088",
        "requestTime": "2026-04-11 14:26",
        "progressStatus": "待处理",
        "requester": "唐嘉蔚",
        "productCode": "GM-2024-015",
        "productName": "GM 太阳镜 Classic",
        "location": "C002-1020",
        "requestQty": "5",
        "processor": "-",
        "triggerMethod": "查看",
        "id": "INV-REQ-2026041002"
      },
      {
        "ticketId": "114042",
        "requestTime": "2026-04-09 11:05",
        "progressStatus": "已完成",
        "requester": "林浩然",
        "productCode": "GM-2023-089",
        "productName": "GM 光学镜架 Titanium",
        "location": "C001-1117",
        "requestQty": "3",
        "processor": "马会宁",
        "triggerMethod": "查看",
        "id": "INV-REQ-2026040901"
      },
      {
        "ticketId": "113205",
        "requestTime": "2026-04-08 15:30",
        "progressStatus": "已关闭",
        "requester": "苏芮",
        "productCode": "GM-2024-032",
        "productName": "GM 运动眼镜 Active",
        "location": "C001-1117",
        "requestQty": "1",
        "processor": "宋逸凡",
        "triggerMethod": "查看",
        "id": "INV-REQ-2026040801"
      },
      {
        "ticketId": "113100",
        "requestTime": "2026-04-07 10:00",
        "progressStatus": "已完成",
        "requester": "张晓峰",
        "productCode": "GM-2024-056",
        "productName": "GM 蓝光护目镜 Office",
        "location": "C002-1020",
        "requestQty": "4",
        "processor": "周晨曦",
        "triggerMethod": "查看",
        "id": "INV-REQ-2026040701"
      }
    ]

export const INVENTORY_SYNC_ROWS: ModuleRow[] = [
      {
        "batchNo": "410001",
        "syncTarget": "产品库存",
        "syncType": "全量同步",
        "startTime": "2026-04-10 03:00:00",
        "endTime": "2026-04-10 03:18:00",
        "status": "执行成功",
        "successCount": "1250",
        "failCount": "0",
        "diffCount": "6",
        "triggerMethod": "定时任务",
        "action": "2026-04-10 03:18:00",
        "operation": "详情",
        "id": "410001"
      },
      {
        "batchNo": "410002",
        "syncTarget": "库存冻结信息",
        "syncType": "增量同步",
        "startTime": "2026-04-10 10:00:00",
        "endTime": "2026-04-10 10:03:00",
        "status": "部分成功",
        "successCount": "48",
        "failCount": "2",
        "diffCount": "1",
        "triggerMethod": "补偿任务",
        "action": "2026-04-10 10:03:00",
        "operation": "详情",
        "id": "410002"
      },
      {
        "batchNo": "410003",
        "syncTarget": "价格主数据",
        "syncType": "补偿同步",
        "startTime": "2026-04-10 15:30:00",
        "endTime": "2026-04-10 15:36:00",
        "status": "执行失败",
        "successCount": "0",
        "failCount": "35",
        "diffCount": "0",
        "triggerMethod": "手工触发",
        "action": "2026-04-10 15:36:00",
        "operation": "详情",
        "id": "410003"
      }
    ]

export const INVENTORY_RECORD_ROWS: ModuleRow[] = [
      {
        "recordNo": "510001",
        "recordTime": "入库",
        "quantity": "GM-SN-00128",
        "productName": "GENTLE MONSTER LANG 01",
        "recordType": "办公室仓 / C002-1020",
        "operator": "10",
        "action": "增加",
        "beforeQty": "25",
        "afterQty": "35",
        "sourceType": "申请单",
        "sourceNo": "310009",
        "operateTime": "2026-04-10 09:15:00",
        "operatorName": "张敏",
        "remark": "维修补货入库",
        "detail": "详情",
        "id": "510001"
      },
      {
        "recordNo": "510002",
        "recordTime": "冻结",
        "quantity": "GM-PT-00056",
        "productName": "镜腿配件-黑色",
        "recordType": "PS仓 / C001-1117",
        "operator": "2",
        "action": "冻结",
        "beforeQty": "18",
        "afterQty": "16",
        "sourceType": "出库单",
        "sourceNo": "OUT20260410001",
        "operateTime": "2026-04-10 10:20:00",
        "operatorName": "李晨",
        "remark": "维修领用冻结",
        "detail": "详情",
        "id": "510002"
      },
      {
        "recordNo": "510003",
        "recordTime": "库存调整",
        "quantity": "GM-LS-00321",
        "productName": "镜片组件-透明",
        "recordType": "大仓 / C001-1110",
        "operator": "3",
        "action": "释放",
        "beforeQty": "12",
        "afterQty": "15",
        "sourceType": "差异处理",
        "sourceNo": "610002",
        "operateTime": "2026-04-10 11:05:00",
        "operatorName": "王雪",
        "remark": "冻结未释放修正",
        "detail": "详情",
        "id": "510003"
      }
    ]

export const INVENTORY_REQUEST_SECTIONS: ModuleSection[] = [
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
            "value": "C001-1117",
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

export const INVENTORY_SYNC_SECTIONS: ModuleSection[] = [
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

export const INVENTORY_RECORD_SECTIONS: ModuleSection[] = [
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
