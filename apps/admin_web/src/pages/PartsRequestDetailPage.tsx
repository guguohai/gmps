import { useEffect, useMemo, useState } from 'react'
import { DetailPageBase } from '../components/DetailPageBase'
import { useParams } from 'react-router-dom'
import { ProductSearchSelect, defaultProductOptions, type ProductOption } from '../components/ProductSearchSelect'
import { renderEditableField, renderReadOnlyField } from '../utils/detailRender'
import type { ModuleField, ModuleRow, ModuleSchema, ModuleSection } from '../types/module'
import { getPartsRequestDetail, getPartsRequestSections } from '../services/partsApi'

const FIELD_KEY = {
  progressStatus: '进度状态',
  requester: '请求负责人',
  storeType: '门店类型',
  storeName: '门店名称',
  productName: '产品名称',
  partName: '小零件名称',
  partLocation: '小零件存放位置',
  color: '颜色',
  quantity: '数量',
} as const

const PROGRESS_STATUS_OPTIONS = ['待出库', '已出库', '已完成', '已关闭']
const progressStatusMap: Record<string, string> = {
  已通过: '已完成',
  已拒绝: '已关闭',
}

const getRowString = (row: ModuleRow | null, key: string) => {
  const value = row?.[key]
  return typeof value === 'string' || typeof value === 'number' ? String(value) : ''
}

export function PartsRequestDetailPage() {
  const { id } = useParams()
  const [sections, setSections] = useState<ModuleSection[]>([])
  const [detailData, setDetailData] = useState<ModuleRow | null>(null)
  const [loading, setLoading] = useState(true)
  const schema: ModuleSchema = {
    path: '/parts/request',
    title: '小零件申请详情',
    breadcrumb: ['小零件管理', '小零件申请'],
    filters: [],
    columns: [],
  }
  const basePath = '/parts/request'

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    Promise.all([getPartsRequestDetail(id), getPartsRequestSections()])
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

  const mappedSections = useMemo<ModuleSection[]>(() => {
    const rowProgressStatus = getRowString(detailData, 'status')
    const mappedProgressStatus = progressStatusMap[rowProgressStatus] ?? rowProgressStatus
    const normalizedProgressStatus = PROGRESS_STATUS_OPTIONS.includes(mappedProgressStatus) ? mappedProgressStatus : PROGRESS_STATUS_OPTIONS[0]
    const valueByFieldKey: Record<string, string> = {
      [FIELD_KEY.progressStatus]: normalizedProgressStatus,
      [FIELD_KEY.requester]: getRowString(detailData, 'requester'),
      [FIELD_KEY.storeType]: getRowString(detailData, 'storeType'),
      [FIELD_KEY.storeName]: getRowString(detailData, 'storeName'),
      [FIELD_KEY.productName]: getRowString(detailData, 'productName'),
      [FIELD_KEY.partName]: getRowString(detailData, 'partName'),
      [FIELD_KEY.partLocation]: getRowString(detailData, 'partLocation'),
      [FIELD_KEY.color]: getRowString(detailData, 'color'),
      [FIELD_KEY.quantity]: getRowString(detailData, 'quantity'),
    }

    return sections.map((section) => ({
      ...section,
      fields: section.fields.map((field) => {
        if (field.key === FIELD_KEY.progressStatus) {
          return {
            ...field,
            options: PROGRESS_STATUS_OPTIONS,
            value: valueByFieldKey[field.key] || field.value,
          }
        }
        if (Object.prototype.hasOwnProperty.call(valueByFieldKey, field.key)) {
          return { ...field, value: valueByFieldKey[field.key] || field.value }
        }
        return field
      }),
    }))
  }, [detailData, sections])

  const renderField = (field: ModuleField) => {
    if (field.key === FIELD_KEY.productName && field.editable !== false) {
      const fieldValue = Array.isArray(field.value) ? field.value.join(',') : String(field.value ?? '')
      const fromFieldOptions = (field.options ?? []).map<ProductOption>((name, index) => ({
        value: name,
        label: name,
        code: `PARTS-${String(index + 1).padStart(3, '0')}`,
        category: '小零件申请',
        stock: 999,
      }))
      const mergedOptions = [...defaultProductOptions, ...fromFieldOptions]
      const dedupedOptions = Array.from(new Map(mergedOptions.map((option) => [option.value, option])).values())
      if (fieldValue && !dedupedOptions.some((option) => option.value === fieldValue)) {
        dedupedOptions.unshift({
          value: fieldValue,
          label: fieldValue,
          code: 'CURRENT',
          category: '当前产品',
          stock: 999,
        })
      }

      return <ProductSearchSelect value={fieldValue} options={dedupedOptions} placeholder="输入产品名称搜索" style={{ width: '100%' }} />
    }

    return field.editable === false ? renderReadOnlyField(field) : renderEditableField(field)
  }

  return (
    <DetailPageBase
      schema={schema}
      sections={mappedSections}
      basePath={basePath}
      loading={loading}
      renderField={renderField}
    />
  )
}
