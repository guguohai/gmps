export const kpiCards = [
  { key: 'shipping', title: '今日发货任务', value: 128, trend: '+12%' },
  { key: 'unpaid', title: '待支付订单', value: 45, trend: 'Steady' },
  { key: 'pending_flow', title: '待处理流程', value: 23, trend: '-3%' },
  { key: 'pending_reply', title: '待回复咨询', value: 89, trend: '+5%' },
]

export const trendData = [
  { day: 'Mon', volume: 42 },
  { day: 'Tue', volume: 55 },
  { day: 'Wed', volume: 39 },
  { day: 'Thu', volume: 63 },
  { day: 'Fri', volume: 58 },
  { day: 'Sat', volume: 71 },
  { day: 'Sun', volume: 66 },
]

export const pendingFlows = [
  {
    key: '1',
    flow: '返修工单审批',
    owner: '上海维修中心',
    priority: '高',
    updatedAt: '2026-04-12 10:20',
    status: '待处理',
  },
  {
    key: '2',
    flow: '库存调拨确认',
    owner: '华东中转仓',
    priority: '中',
    updatedAt: '2026-04-12 09:42',
    status: '处理中',
  },
  {
    key: '3',
    flow: '配件补货审核',
    owner: '上海前滩太古里店',
    priority: '中',
    updatedAt: '2026-04-12 09:10',
    status: '待处理',
  },
]

export const quickActions = [
  '新建工单',
  '新建库存申请',
  '同步库存记录',
  '发起差异处理',
]

export const notices = [
  {
    key: '1',
    title: 'SAP 同步窗口维护通知',
    time: '2026-04-12 08:00',
    level: '重要',
  },
  {
    key: '2',
    title: '华东维修中心库存盘点计划',
    time: '2026-04-11 18:30',
    level: '普通',
  },
  {
    key: '3',
    title: '3PL 备货仓发货时效调整',
    time: '2026-04-11 14:05',
    level: '普通',
  },
]

export const recentServiceRequests = [
  {
    key: '1',
    id: '#SR-2041',
    customer: 'David Chen',
    status: 'In Progress',
    priority: 'High',
    assignee: 'Sarah Jenkins',
  },
  {
    key: '2',
    id: '#SR-2040',
    customer: 'Maria Garcia',
    status: 'Pending',
    priority: 'Medium',
    assignee: 'Robert Fox',
  },
  {
    key: '3',
    id: '#SR-2039',
    customer: 'James Wilson',
    status: 'Completed',
    priority: 'Low',
    assignee: 'Sarah Jenkins',
  },
]

export const activityStream = [
  {
    key: '1',
    title: 'Ticket #SR-2041 Updated',
    desc: "Status changed to 'In Progress' by Sarah Jenkins.",
    time: '2 minutes ago',
    tone: 'blue',
  },
  {
    key: '2',
    title: '新增',
    desc: 'Acme Corp signed up via the self-service portal.',
    time: '1 hour ago',
    tone: 'green',
  },
  {
    key: '3',
    title: 'Priority Escalation',
    desc: "Ticket #SR-1988 marked as 'Critical' by system monitor.",
    time: '3 hours ago',
    tone: 'orange',
  },
  {
    key: '4',
    title: 'Weekly Report Generated',
    desc: 'The system has automated the performance summary.',
    time: 'Yesterday',
    tone: 'gray',
  },
  {
    key: '5',
    title: 'Agent Login',
    desc: 'Robert Fox started their shift.',
    time: 'Yesterday',
    tone: 'blue',
  },
]
