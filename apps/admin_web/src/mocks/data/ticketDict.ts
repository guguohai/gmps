// 工单相关字典/选项数据

export const REPAIR_TYPE_OPTIONS = [
  { value: '电镀', label: '售后服务 - 电镀' },
  { value: '更换', label: '售后服务 - 更换' },
  { value: '抛光', label: '售后服务 - 抛光' },
  { value: '清洗', label: '售后服务 - 清洗' },
]

export const ATTACHED_ITEM_TYPE_OPTIONS = ['定制镜片', '眼镜盒', '眼镜布', '保修卡', '其他']

export const HEADER_OWNER_OPTIONS = ['张经理', '李经理', '王经理', '赵经理']

export const SMS_TEMPLATES = [
  '-',
  '[受理] 门店受理完成',
  '[通知] 配件退回',
  '[判定] 产品更换',
  '[咨询] 合作企业维修延迟通知',
  '[通知] 维修取消',
  '[通知] 到达门店及领取',
  '[通知] 门店领取完成',
]

export const EMAIL_TEMPLATES = [
  '-',
  '[受理]门店已收到受理',
  '[通知]未付款返送',
  '[检查]产品更换',
  '[咨询]合作伙伴修理延迟通知',
  '[检查]维修已取消',
  '[通知] 已抵达门店并接收',
  '[通知]门店取货完成',
]

// TicketDetailPage2 中使用的选项
export const INVENTORY_REQUEST_CATEGORY_OPTIONS = ['-', '产品申请', '补货申请', '调拨申请', '维修领用', '换货申请', '其他']
export const INVENTORY_REQUEST_REASON_CATEGORY_OPTIONS = ['-', '维修使用', '库存补充', '不良置换', '其他']
export const INVENTORY_REQUEST_REASON_SUB_CATEGORY_OPTIONS = ['-', '零件损坏', 'SUNGLASS ACETATE补充', '客户要求', '定期补货']
