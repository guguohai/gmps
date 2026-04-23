import { useEffect, useMemo, useState } from 'react'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Card, Col, Form, Input, Row, Select, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DetailPageBase } from '../components/DetailPageBase'
import { useParams } from 'react-router-dom'
import type { ModuleField, ModuleNestedRow, ModuleRow, ModuleSchema, ModuleSection } from '../types/module'
import { normalizeFields } from '../utils/detailRender'
import { getProductDetail, getProductSections } from '../services/productApi'

const PRODUCT_INVENTORY_KEYS = new Set(['库存分布', '本地总库存', '冻结库存', '调拨中', '可用库存', '安全库存状态'])
const PRODUCT_FACTORY_LABELS = new Set(['生产工厂 1', '生产工厂 2', '生产工厂 3'])
const MAX_PRODUCT_FACTORY_COUNT = 3
const EMPTY_FACTORY_VALUE = '-'

const toNumber = (value: string | number | undefined) => {
  if (typeof value === 'number') return value
  const normalized = String(value ?? '').replace(/,/g, '').trim()
  return Number(normalized) || 0
}

const getInventoryStatus = (value: string | number | undefined) => (toNumber(value) < 5 ? '缺货' : '-')

export function ProductDetailPage() {
  const { id } = useParams()
  const [sections, setSections] = useState<ModuleSection[]>([])
  const [detailData, setDetailData] = useState<ModuleRow | null>(null)
  const [loading, setLoading] = useState(true)
  const schema: ModuleSchema = {
    path: '/product/list',
    title: '产品详情',
    breadcrumb: ['产品管理', '产品信息列表'],
    filters: [],
    columns: [],
  }
  const basePath = '/product/list'

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    Promise.all([getProductDetail(id), getProductSections()])
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

  const currentRow = useMemo(() => detailData as ModuleRow | undefined, [detailData])

  const sourceInventoryRows = useMemo(
    () => (Array.isArray(currentRow?.warehouseDetails) ? (currentRow!.warehouseDetails as ModuleNestedRow[]) : []),
    [currentRow]
  )

  const [editedInventoryRows] = useState<ModuleNestedRow[] | null>(null)
  const [editedFactoryValues, setEditedFactoryValues] = useState<string[] | null>(null)
  const [userVisibleFactoryCount, setUserVisibleFactoryCount] = useState<number | null>(null)

  const inventoryRows = editedInventoryRows ?? sourceInventoryRows

  const productFactoryFields = useMemo(() => {
    return normalizeFields(sections.flatMap((section) => section.fields)).filter((field) =>
      PRODUCT_FACTORY_LABELS.has(field.label.trim())
    )
  }, [sections])

  const productFactoryOptions = useMemo<string[]>(() => {
    return Array.from(
      new Set(
        productFactoryFields.flatMap((field) => {
          const rawOptions =
            field.options && field.options.length
              ? field.options
              : [Array.isArray(field.value) ? field.value.join(',') : (field.value ?? '')]
          return rawOptions.map((option) => String(option).trim()).filter(Boolean)
        })
      )
    )
  }, [productFactoryFields])

  const defaultFactoryValues = useMemo(() => {
    return productFactoryFields.map((field) => {
      const val = Array.isArray(field.value) ? field.value.join(',') : (field.value ?? '')
      return val
    })
  }, [productFactoryFields])

  const productFactoryValues = editedFactoryValues ?? defaultFactoryValues

  const defaultVisibleFactoryCount = useMemo(() => Math.min(2, Math.max(defaultFactoryValues.length, 2)), [defaultFactoryValues])
  const visibleFactoryCount = userVisibleFactoryCount ?? defaultVisibleFactoryCount
  const visibleFactoryValues = useMemo(
    () => productFactoryValues.slice(0, visibleFactoryCount),
    [productFactoryValues, visibleFactoryCount]
  )
  const selectedFactoryValues = useMemo(
    () => new Set(visibleFactoryValues.filter((value) => value && value !== EMPTY_FACTORY_VALUE)),
    [visibleFactoryValues]
  )

  const filteredSections = useMemo(() => {
    return sections.map((section) => ({
      ...section,
      fields: section.fields.filter((field) => {
        const label = field.label.trim()
        return !PRODUCT_INVENTORY_KEYS.has(label) && !PRODUCT_FACTORY_LABELS.has(label)
      }),
    }))
  }, [sections])

  const inventoryColumns: ColumnsType<ModuleNestedRow> = [
    { title: '仓名', dataIndex: 'warehouse', key: 'warehouse', width: 140 },
    {
      title: '库位',
      dataIndex: 'location',
      key: 'location',
      width: 160,
      render: (value: string | number) => <Input value={String(value ?? '')} readOnly />,
    },
    {
      title: '本地总库存',
      dataIndex: 'localTotal',
      key: 'localTotal',
      width: 130,
      align: 'center',
      render: (value: string | number) => <span>{toNumber(value).toLocaleString()}</span>,
    },
    {
      title: '冻结库存',
      dataIndex: 'frozen',
      key: 'frozen',
      width: 130,
      align: 'center',
      render: (value: string | number) => <span>{toNumber(value).toLocaleString()}</span>,
    },
    {
      title: '调拨中',
      dataIndex: 'transfer',
      key: 'transfer',
      width: 130,
      align: 'center',
      render: (value: string | number) => <span>{toNumber(value).toLocaleString()}</span>,
    },
    {
      title: '可用库存',
      dataIndex: 'available',
      key: 'available',
      width: 130,
      align: 'center',
      render: (value: string | number) => <span>{toNumber(value).toLocaleString()}</span>,
    },
    {
      title: '库存状态',
      key: 'stockStatus',
      width: 120,
      align: 'center',
      render: (_, record: ModuleNestedRow) => <span>{getInventoryStatus(record.available as string | number)}</span>,
    },
  ]

  const inventoryTotals = useMemo(
    () => ({
      localTotal: inventoryRows.reduce((sum, row) => sum + toNumber(row.localTotal as string | number | undefined), 0),
      frozen: inventoryRows.reduce((sum, row) => sum + toNumber(row.frozen as string | number | undefined), 0),
      transfer: inventoryRows.reduce((sum, row) => sum + toNumber(row.transfer as string | number | undefined), 0),
      available: inventoryRows.reduce((sum, row) => sum + toNumber(row.available as string | number | undefined), 0),
    }),
    [inventoryRows]
  )

  const renderProductField = (field: ModuleField) => {
    const strValue = Array.isArray(field.value) ? field.value.join(',') : (field.value ?? '')
    return <span>{strValue || '-'}</span>
  }

  return (
    <DetailPageBase
      schema={schema}
      sections={filteredSections}
      basePath={basePath}
      loading={loading}
      renderField={(field) => renderProductField(field)}
    >
      {productFactoryFields.length > 0 ? (
        <Card title="生产信息">
          <Form layout="vertical">
            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item label="生产工厂" style={{ marginBottom: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                    {visibleFactoryValues.map((value, factoryIndex) => (
                      <div key={`factory-${factoryIndex}`} style={{ flex: '1 1 150px', minWidth: 150, maxWidth: 300 }}>
                        <Select
                          value={value || productFactoryOptions[0]}
                          options={productFactoryOptions.map((option) => ({
                            value: option,
                            label: option,
                            disabled: option !== value && option !== EMPTY_FACTORY_VALUE && selectedFactoryValues.has(option),
                          }))}
                          onChange={(nextValue) =>
                            setEditedFactoryValues((prev) => {
                              const next = [...(prev ?? defaultFactoryValues)]
                              next[factoryIndex] = String(nextValue)
                              return next
                            })
                          }
                        />
                      </div>
                    ))}
                    <Button
                      style={{ width: 32, paddingInline: 0, flex: '0 0 auto' }}
                      onClick={() => setUserVisibleFactoryCount((count) => Math.max(1, (count ?? defaultVisibleFactoryCount) - 1))}
                      disabled={visibleFactoryCount <= 1}
                      icon={<MinusOutlined />}
                    />
                    <Button
                      style={{ width: 32, paddingInline: 0, flex: '0 0 auto' }}
                      onClick={() => setUserVisibleFactoryCount((count) => Math.min(MAX_PRODUCT_FACTORY_COUNT, (count ?? defaultVisibleFactoryCount) + 1))}
                      disabled={visibleFactoryCount >= MAX_PRODUCT_FACTORY_COUNT}
                      icon={<PlusOutlined />}
                    />
                  </div>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      ) : null}

      <Card title="库存信息">
        <Table
          rowKey={(row) => String(row.key ?? `${row.warehouse}-${row.location}`)}
          columns={inventoryColumns}
          dataSource={inventoryRows}
          pagination={false}
          scroll={{ x: 940 }}
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={2}>
                合计
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="center">
                {inventoryTotals.localTotal.toLocaleString()}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} align="center">
                {inventoryTotals.frozen.toLocaleString()}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} align="center">
                {inventoryTotals.transfer.toLocaleString()}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5} align="center">
                {inventoryTotals.available.toLocaleString()}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6} align="center">
                -
              </Table.Summary.Cell>
            </Table.Summary.Row>
          )}
        />
      </Card>
    </DetailPageBase>
  )
}
