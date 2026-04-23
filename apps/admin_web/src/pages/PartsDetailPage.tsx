import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Empty, InputNumber, Select, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { DetailPageBase } from '../components/DetailPageBase'
import { getPartsDetail, getPartsSections } from '../services/partsApi'
import type { ModuleRow, ModuleSchema, ModuleSection } from '../types/module'

const FIELD_KEY = {
  partName: '小零件名称',
  totalQuantity: '总数量',
  location: '存放位置',
} as const

const STORE_TYPE_OPTIONS = [
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
]

const QUANTITY_KEYS = ['quantity1', 'quantity2', 'quantity3', 'quantity4', 'quantity5', 'quantity6'] as const

type QuantityKey = (typeof QUANTITY_KEYS)[number]

type QuantityConfigRow = {
  key: string
  storeType: string
} & Record<QuantityKey, number>

const getRowString = (row: ModuleRow | null, key: string) => {
  const value = row?.[key]
  return typeof value === 'string' || typeof value === 'number' ? String(value) : ''
}

const toNumber = (value: unknown) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  if (typeof value === 'string') {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

const getQuantityConfigRows = (row: ModuleRow | null): QuantityConfigRow[] => {
  const rawRows = row?.quantityConfig
  if (!Array.isArray(rawRows)) return []

  return rawRows.map((item, index) => {
    const record = item as Record<string, unknown>
    return {
      key: String(record.key ?? `${record.storeType ?? 'store'}-${index + 1}`),
      storeType: typeof record.storeType === 'string' ? record.storeType : STORE_TYPE_OPTIONS[0],
      quantity1: toNumber(record.quantity1),
      quantity2: toNumber(record.quantity2),
      quantity3: toNumber(record.quantity3),
      quantity4: toNumber(record.quantity4),
      quantity5: toNumber(record.quantity5),
      quantity6: toNumber(record.quantity6),
    }
  })
}

const createEmptyRow = (rows: QuantityConfigRow[]): QuantityConfigRow => {
  const usedStoreTypes = new Set(rows.map((row) => row.storeType))
  const nextStoreType = STORE_TYPE_OPTIONS.find((storeType) => !usedStoreTypes.has(storeType)) ?? STORE_TYPE_OPTIONS[0]

  return {
    key: `new-${Date.now()}-${rows.length + 1}`,
    storeType: nextStoreType,
    quantity1: 0,
    quantity2: 0,
    quantity3: 0,
    quantity4: 0,
    quantity5: 0,
    quantity6: 0,
  }
}

export function PartsDetailPage() {
  const { id } = useParams()
  const [sections, setSections] = useState<ModuleSection[]>([])
  const [detailData, setDetailData] = useState<ModuleRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantityConfigRows, setQuantityConfigRows] = useState<QuantityConfigRow[]>([])
  const schema: ModuleSchema = {
    path: '/parts/list',
    title: '小零件详情',
    breadcrumb: ['小零件管理', '小零件列表'],
    filters: [],
    columns: [],
  }
  const basePath = '/parts/list'

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    Promise.all([getPartsDetail(id), getPartsSections()])
      .then(([detailRes, sectionRes]) => {
        if (cancelled) return
        setDetailData(detailRes.data ?? null)
        setSections(sectionRes.data ?? [])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id])

  useEffect(() => {
    setQuantityConfigRows(getQuantityConfigRows(detailData))
  }, [detailData])

  const mappedSections = useMemo<ModuleSection[]>(() => {
    const valueByFieldKey: Record<string, string> = {
      [FIELD_KEY.partName]: getRowString(detailData, 'partName'),
      [FIELD_KEY.totalQuantity]: getRowString(detailData, 'quantity'),
      [FIELD_KEY.location]: getRowString(detailData, 'location'),
    }

    return sections.map((section) => ({
      ...section,
      fields: section.fields.map((field) => {
        if (!Object.prototype.hasOwnProperty.call(valueByFieldKey, field.key)) return field
        return {
          ...field,
          value: valueByFieldKey[field.key] || field.value,
        }
      }),
    }))
  }, [detailData, sections])

  const updateConfigRow = (key: string, patch: Partial<QuantityConfigRow>) => {
    setQuantityConfigRows((rows) => rows.map((row) => (row.key === key ? { ...row, ...patch } : row)))
  }

  const removeConfigRow = (key: string) => {
    setQuantityConfigRows((rows) => rows.filter((row) => row.key !== key))
  }

  const addConfigRow = () => {
    setQuantityConfigRows((rows) => [...rows, createEmptyRow(rows)])
  }

  const quantityColumns: ColumnsType<QuantityConfigRow> = [
    {
      title: '门店类型',
      dataIndex: 'storeType',
      key: 'storeType',
      width: 220,
      render: (value: string, record) => {
        const selectedStoreTypes = new Set(quantityConfigRows.map((row) => row.storeType))
        return (
          <Select
            style={{ width: '100%' }}
            value={value}
            options={STORE_TYPE_OPTIONS.map((storeType) => ({
              value: storeType,
              label: storeType,
              disabled: storeType !== value && selectedStoreTypes.has(storeType),
            }))}
            onChange={(nextValue) => updateConfigRow(record.key, { storeType: String(nextValue) })}
          />
        )
      },
    },
    ...QUANTITY_KEYS.map((quantityKey, index) => ({
      title: `数量 ${index + 1}`,
      dataIndex: quantityKey,
      key: quantityKey,
      width: 120,
      render: (value: number, record: QuantityConfigRow) => (
        <InputNumber
          min={0}
          controls={false}
          style={{ width: '100%' }}
          value={value}
          onChange={(nextValue) =>
            updateConfigRow(record.key, { [quantityKey]: typeof nextValue === 'number' ? nextValue : 0 } as Partial<QuantityConfigRow>)
          }
        />
      ),
    })),
    {
      title: '操作',
      key: 'action',
      width: 90,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Button type="link" danger onClick={() => removeConfigRow(record.key)}>
          删除
        </Button>
      ),
    },
  ]

  return (
    <DetailPageBase
      schema={schema}
      sections={mappedSections}
      basePath={basePath}
      loading={loading}
    >
      <Card
        title="数量配置"
        extra={(
          <Button type="primary" icon={<PlusOutlined />} onClick={addConfigRow}>
            添加
          </Button>
        )}
      >
        <Table
          rowKey="key"
          columns={quantityColumns}
          dataSource={quantityConfigRows}
          pagination={false}
          scroll={{ x: 980 }}
          locale={{ emptyText: <Empty description="暂无配置数据" /> }}
        />
      </Card>
    </DetailPageBase>
  )
}
