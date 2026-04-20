import type { ColumnsType } from 'antd/es/table'

export type ModuleTableMock = {
  title: string
  description: string
  columns: ColumnsType<Record<string, string | number>>
  data: Record<string, string | number>[]
}

const inventoryRequestColumns: ColumnsType<Record<string, string | number>> = [
  { title: '申请单编号', dataIndex: 'no', key: 'no', width: 180 },
  { title: '申请来源', dataIndex: 'source', key: 'source', width: 120 },
  { title: '来源单号', dataIndex: 'sourceNo', key: 'sourceNo', width: 180 },
  { title: '申请人', dataIndex: 'applicant', key: 'applicant', width: 120 },
  { title: '处理方式', dataIndex: 'action', key: 'action', width: 120 },
  { title: '执行状态', dataIndex: 'execStatus', key: 'execStatus', width: 120 },
  { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 180 },
]

const inventoryRequestData = [
  {
    key: '1',
    no: '310001',
    source: '售后工单',
    sourceNo: 'ST202604110018',
    applicant: '陈雨桐',
    action: '出库执行',
    execStatus: '待执行',
    updatedAt: '2026-04-12 10:02',
  },
  {
    key: '2',
    no: '310014',
    source: '门店申请',
    sourceNo: 'MSR-SHPTGL-20260411-07',
    applicant: '唐嘉蔚',
    action: '出库执行',
    execStatus: '已完成',
    updatedAt: '2026-04-11 18:35',
  },
  {
    key: '3',
    no: '310009',
    source: '库存调拨需求',
    sourceNo: 'TRF-NE-SH-20260410-03',
    applicant: '林浩然',
    action: '调拨执行',
    execStatus: '执行中',
    updatedAt: '2026-04-12 08:55',
  },
]

const genericColumns: ColumnsType<Record<string, string | number>> = [
  { title: '编号', dataIndex: 'no', key: 'no', width: 180 },
  { title: '名称', dataIndex: 'name', key: 'name', width: 240 },
  { title: '负责人', dataIndex: 'owner', key: 'owner', width: 140 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 120 },
  { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 180 },
]

const genericData = [
  { key: '1', no: 'GM-ITEM-001', name: '华东维修中心流程', owner: '张敏', status: '进行中', updatedAt: '2026-04-12 09:30' },
  { key: '2', no: 'GM-ITEM-002', name: '上海前滩门店补货', owner: '王雪', status: '待处理', updatedAt: '2026-04-12 09:00' },
  { key: '3', no: 'GM-ITEM-003', name: '总仓A区盘点同步', owner: '李晨', status: '已完成', updatedAt: '2026-04-11 18:12' },
]

export const moduleMockMap: Record<string, ModuleTableMock> = {
  '/ticket/list': {
    title: '工单列表',
    description: '售后工单全链路处理列表（Mock 数据）',
    columns: genericColumns,
    data: genericData,
  },
  '/product/list': {
    title: '产品列表',
    description: '产品档案与售后关联信息（Mock 数据）',
    columns: genericColumns,
    data: genericData,
  },
  '/inventory/request': {
    title: '库存申请单',
    description: '统一承接库存申请、审核与执行（Mock 数据）',
    columns: inventoryRequestColumns,
    data: inventoryRequestData,
  },
}

export const defaultModuleMock: ModuleTableMock = {
  title: '模块页面',
  description: '该模块已接入路由，当前使用通用 Mock 数据。',
  columns: genericColumns,
  data: genericData,
}
