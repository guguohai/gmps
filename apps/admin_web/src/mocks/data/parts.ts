import type { ModuleRow, ModuleSection } from '../../types/module'

export const PARTS_LIST_ROWS: ModuleRow[] = [
  {
    partId: '100001',
    partName: '钛合金鼻托 (Titanium Nose Pad)',
    quantity: '500',
    color: '银色 (Silver)',
    spec: '12mm',
    location: 'A1, 1/A01',
    quantityConfig: [
      { storeType: '旗舰店', quantity1: 1, quantity2: 3, quantity3: 5, quantity4: 10, quantity5: 30, quantity6: 50 },
      { storeType: '百货', quantity1: 1, quantity2: 2, quantity3: 4, quantity4: 8, quantity5: 16, quantity6: 32 },
    ],
    action: '查看',
    id: '100001',
  },
  {
    partId: '100002',
    partName: '定制镜腿螺丝 (Temple Screw)',
    quantity: '1200',
    color: '金色 (Gold)',
    spec: '1.2×3.5mm',
    location: 'B2, 3/B12',
    quantityConfig: [
      { storeType: '旗舰店', quantity1: 2, quantity2: 4, quantity3: 6, quantity4: 12, quantity5: 24, quantity6: 48 },
      { storeType: '免税店', quantity1: 1, quantity2: 3, quantity3: 5, quantity4: 8, quantity5: 15, quantity6: 30 },
    ],
    action: '查看',
    id: '100002',
  },
  {
    partId: '100003',
    partName: 'HER系列 镜腿内衬套',
    quantity: '350',
    color: '黑色 (Black)',
    spec: '145mm 适用',
    location: 'C1, 2/C05',
    quantityConfig: [
      { storeType: '眼镜店', quantity1: 1, quantity2: 2, quantity3: 3, quantity4: 5, quantity5: 10, quantity6: 20 },
    ],
    action: '查看',
    id: '100003',
  },
]

export const PARTS_LIST_SECTIONS: ModuleSection[] = [
  {
    title: '基础信息',
    fields: [
      {
        key: '小零件名称',
        label: '小零件名称',
        type: 'input',
        value: '钛合金鼻托 (Titanium Nose Pad)',
      },
      {
        key: '总数量',
        label: '总数量',
        type: 'number',
        value: '150',
      },
      {
        key: '存放位置',
        label: '存放位置',
        type: 'input',
        value: 'A-102-05',
      },
    ],
  },
]

export const PARTS_REQUEST_ROWS: ModuleRow[] = [
  {
    requestTime: '2026-03-24 14:15',
    requester: 'Sarah Johnson',
    storeType: '百货',
    storeName: '北京SKP店',
    productName: 'Bold Series B-01',
    partName: '鼻托 (Nose Pads)',
    partLocation: 'C-03-12',
    color: '透明 (Clear)',
    quantity: '100',
    status: '已通过',
    action: '查看',
    id: '2026-03-24 14:15',
  },
  {
    requestTime: '2026-03-24 16:45',
    requester: 'Emma Davis',
    storeType: '免税店',
    storeName: '三亚海棠湾免税店',
    productName: 'LILIT 01',
    partName: '镜片 (Lens)',
    partLocation: 'L-05-02',
    color: '渐变灰 (Grey Gradient)',
    quantity: '15',
    status: '已拒绝',
    action: '查看',
    id: '2026-03-24 16:45',
  },
]

export const PARTS_REQUEST_SECTIONS: ModuleSection[] = [
  {
    title: '基础信息',
    fields: [
      {
        key: '进度状态',
        label: '进度状态',
        type: 'select',
        value: '待出库',
        options: [
          '待出库',
          '已出库',
          '已完成',
          '已关闭',
        ],
      },
      {
        key: '请求负责人',
        label: '请求负责人',
        type: 'input',
        value: '',
      },
      {
        key: '门店类型',
        label: '门店类型',
        type: 'select',
        value: '旗舰店',
        options: [
          '旗舰店',
          '百货',
          '商场',
          '免税店',
          '眼镜店',
          '买手店',
          '集合店',
          '官方线上商城',
          '海外法人（子公司）',
          '海外法人（合资公司）',
          'PS',
          '其他',
        ],
      },
      {
        key: '门店名称',
        label: '门店名称',
        type: 'input',
        value: '搜索门店...',
      },
      {
        key: '产品名称',
        label: '产品名称',
        type: 'searchSelect',
        value: '',
        options: [
          'LILIT 01',
          'LILIT 02',
          'MOLSION M3001',
          'BOLON BL7050',
          'RAYBAN RX7140',
        ],
      },
      {
        key: '小零件名称',
        label: '小零件名称',
        type: 'input',
        value: '搜索小零件...',
      },
      {
        key: '小零件存放位置',
        label: '小零件存放位置',
        type: 'input',
        value: 'A-12-05',
      },
      {
        key: '颜色',
        label: '颜色',
        type: 'select',
        value: '黑色 (Black)',
        options: [
          '黑色 (Black)',
          '玳瑁色 (Tortoise)',
          '金色 (Gold)',
          '银色 (Silver)',
          '透明 (Clear)',
          '灰色 (Grey)',
        ],
      },
      {
        key: '数量',
        label: '数量',
        type: 'select',
        value: '20',
        options: ['1', '3', '5', '10', '20', '30', '50'],
      },
      {
        key: '附加需求事项',
        label: '附加需求事项',
        type: 'textarea',
        value: '需要尽快配送，门店库存告急。',
      },
    ],
  },
]
