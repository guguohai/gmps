import type { ModuleSchema } from './types'

export const userSchemas: ModuleSchema[] = [
{
    "path": "/permission/list",
    "title": "权限列表",
    "breadcrumb": [
      "权限管理",
      "权限列表"
    ],
    "filters": [
      {
        "key": "f1",
        "label": "权限名称",
        "type": "input",
        "placeholder": "输入权限名称"
      },
      {
        "key": "f2",
        "label": "权限类型",
        "type": "select",
        "options": [
          "全部"
        ]
      }
    ],
    "columns": [
      {
        "key": "c1",
        "title": "权限 ID",
        "width": 180
      },
      {
        "key": "c2",
        "title": "权限名称",
        "width": 140
      },
      {
        "key": "c3",
        "title": "权限编码",
        "width": 140
      },
      {
        "key": "c4",
        "title": "权限类型",
        "width": 140
      },
      {
        "key": "c5",
        "title": "所属模块",
        "width": 140
      },
      {
        "key": "c6",
        "title": "描述",
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
        "c1": "PERM-001",
        "c2": "查看工单列表",
        "c3": "ticket:list:view",
        "c4": "菜单权限",
        "c5": "工单管理",
        "c6": "可以查看所有工单列表",
        "c7": "",
        "id": "PERM-001"
      },
      {
        "c1": "PERM-002",
        "c2": "编辑工单",
        "c3": "ticket:edit",
        "c4": "操作权限",
        "c5": "工单管理",
        "c6": "可以编辑和更新工单信息",
        "c7": "",
        "id": "PERM-002"
      },
      {
        "c1": "PERM-003",
        "c2": "管理产品",
        "c3": "product:manage",
        "c4": "操作权限",
        "c5": "产品管理",
        "c6": "可以添加、编辑、删除产品",
        "c7": "查看",
        "id": "PERM-003"
      }
    ],
    "sections": [
      {
        "title": "基础信息",
        "fields": [
          {
            "key": "权限项名称",
            "label": "权限项名称",
            "type": "input",
            "value": "用户管理 - 查看"
          },
          {
            "key": "权限类型",
            "label": "权限类型",
            "type": "select",
            "value": "操作权限",
            "options": [
              "菜单权限",
              "操作权限",
              "数据权限",
              "系统权限"
            ]
          },
          {
            "key": "是否授权",
            "label": "是否授权",
            "type": "select",
            "value": "已授权",
            "options": [
              "已授权",
              "未授权"
            ]
          },
          {
            "key": "备注",
            "label": "备注",
            "type": "textarea",
            "value": "允许查看用户列表和基本信息，不可编辑或删除。"
          }
        ]
      }
    ]
  }
]
