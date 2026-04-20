import { DownOutlined, EditOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, DatePicker, Form, Input, Modal, Row, Select, Space, Switch, Table, Tag } from 'antd'
import type { TableProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ListPageToolbar } from '../components/ListPageToolbar'
import { navGroups } from '../config/navigation'
import { useI18n } from '../i18n/context'
import { getSchema, getList, type ModuleNestedRow, type ModuleRow, type ModuleSchema } from '../services/api'

const statusToneMap: Record<string, string> = {
  PENDING: 'default',
  SUBMITTED: 'success',
  EXPIRED: 'warning',
  INVALID: 'error',
  ENABLED: 'success',
  DISABLED: 'default',
  已完成: 'green',
  完成: 'green',
  审核通过: 'green',
  正常: 'green',
  已通过: 'success',
  已到货: 'blue',
  处理中: 'blue',
  执行中: 'blue',
  待处理: 'orange',
  待审核: 'orange',
  待执行: 'orange',
  待客户确认: 'orange',
  待确认: 'orange',
  免审核: 'cyan',
  偏低: 'orange',
  已确认: 'success',
  已拒绝: 'error',
  执行失败: 'red',
  审核拒绝: 'red',
  不足: 'red',
  预警: 'red',
  已关闭: 'default',
  // 申请单进度状态
  进度处理中: 'blue',
}

const STOCKOUT_LABEL = '缺货'

const toNumber = (value: string | number | undefined) => {
  if (typeof value === 'number') return value
  const normalized = String(value ?? '')
    .replace(/,/g, '')
    .trim()
  return Number(normalized) || 0
}

const getInventoryStatus = (value: string | number | undefined) => (toNumber(value) < 5 ? STOCKOUT_LABEL : '-')

function buildProductTreeRows(rows: ModuleRow[]): ModuleRow[] {
  return rows.map((row) => {
    const details = Array.isArray(row.warehouseDetails) ? (row.warehouseDetails as ModuleNestedRow[]) : []

    const children: ModuleRow[] = details.map((detail) => ({
      id: String(detail.key ?? detail.warehouse ?? row.id),
      isWarehouseDetail: true,
      warehouseName: String(detail.warehouse ?? ''),
      warehouseLocation: String(detail.location ?? ''),
      c1: '',
      c2: '',
      c3: '',
      c4: '',
      c5: '',
      c6: '',
      c7: '',
      c8: '',
      c9: String(detail.warehouse ?? ''),
      c10: String(detail.localTotal ?? ''),
      c11: String(detail.frozen ?? ''),
      c12: String(detail.transfer ?? ''),
      c13: String(detail.available ?? ''),
      c14: getInventoryStatus(detail.available as string | number | undefined),
    }))

    return {
      ...row,
      children,
    }
  })
}

export function StandardListPage() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { messages } = useI18n()
  const [filterForm] = Form.useForm()
  const [schema, setSchema] = useState<ModuleSchema | null>(null)
  const [dataSource, setDataSource] = useState<ModuleRow[]>([])
  const [sourceRows, setSourceRows] = useState<ModuleRow[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [filtersExpanded, setFiltersExpanded] = useState(false)

  // 批量编辑弹框状态
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editProgressStatus, setEditProgressStatus] = useState<string>('待处理')
  const [editHandleTime, setEditHandleTime] = useState<dayjs.Dayjs>(dayjs())
  const [editHandler, setEditHandler] = useState<string>('当前用户')
  const isSurveyList = pathname === '/service/survey'

  // 加载页面配置和数据
  useEffect(() => {
    let cancelled = false
    
    async function loadData() {
      setLoading(true)
      try {
        // 并行请求 schema 和列表数据
        const [schemaRes, listRes] = await Promise.all([
          getSchema(pathname),
          getList(pathname, { page: 1, pageSize: 10 })
        ])
        
        if (cancelled) return
        
        if (schemaRes.code === 200 && schemaRes.data) {
          setSchema(schemaRes.data)
          setSourceRows(schemaRes.data.rows)
          const defaultFilterValues = Object.fromEntries(
            (schemaRes.data.filters ?? [])
              .filter((filter) => filter.type === 'select' && (filter.options?.length ?? 0) > 0)
              .map((filter) => [filter.key, filter.options![0]]),
          )
          filterForm.setFieldsValue(defaultFilterValues)
        }
        
        if (listRes.code === 200 && listRes.data) {
          const rows = listRes.data.list
          if (pathname === '/service/survey' && schemaRes.code === 200 && schemaRes.data) {
            setDataSource(schemaRes.data.rows)
          } else if (pathname === '/product/list') {
            // 产品列表需要构建树形数据
            setDataSource(buildProductTreeRows(rows))
          } else {
            setDataSource(rows)
          }
        }
      } catch (err) {
        console.error('加载数据失败:', err)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    
    loadData()
    
    return () => {
      cancelled = true
    }
  }, [filterForm, pathname])

  const enableCheckboxSelection = ['/ticket/list', '/product/list', '/inventory/request'].includes(pathname)
  const enableProductExpand = pathname === '/product/list'
  const canToggleFilters = (schema?.filters.length ?? 0) > 4
  const currentNavGroup = navGroups.find((group) => group.children.some((child) => child.path === pathname))
  const currentNavItem = currentNavGroup?.children.find((child) => child.path === pathname)
  const breadcrumbItems = [
    {
      title: currentNavGroup
        ? messages.navigation[currentNavGroup.key as keyof typeof messages.navigation] ?? currentNavGroup.label
        : schema?.breadcrumb[0],
    },
    {
      title: currentNavItem
        ? messages.navigation[currentNavItem.key as keyof typeof messages.navigation] ?? currentNavItem.label
        : schema?.breadcrumb[1],
    },
  ]

  const visibleFilters = useMemo(() => {
    if (!schema) return []
    if (!canToggleFilters || filtersExpanded) return schema.filters
    return schema.filters.slice(0, 4)
  }, [canToggleFilters, filtersExpanded, schema])

  const columns = useMemo<ColumnsType<ModuleRow>>(() => {
    if (!schema) return []

    const mapped = schema.columns.map((col) => ({
      title: col.title,
      dataIndex: col.key,
      key: col.key,
      width: col.width,
      align: col.align,
      render: (value: string | number | boolean | ModuleNestedRow[] | ModuleRow[] | undefined, row: ModuleRow) => {
        const str = String(value ?? '').trim()
        const isStatusCol = /状态|结果|Status|Result/i.test(col.title)
        const isLinkCol = /编号|单号|ID|编码|操作|Number|Action/i.test(col.title)
        const isWarehouseDetail = row.isWarehouseDetail === true
        const onlyViewCanNavigate = pathname === '/product/list'
        const isConsultationList = pathname === '/service/consultation'
        const isSurveyList = pathname === '/service/survey'
        const isSurveyTemplateList = pathname === '/service/survey-template'

        if (isWarehouseDetail && col.key === 'c9') {
          const warehouseName = String(row.warehouseName ?? '')
          const warehouseLocation = String(row.warehouseLocation ?? '')
          return `${warehouseName}：${warehouseLocation}`
        }

        if (pathname === '/product/list' && col.key === 'c14') {
          const inventoryStatus = getInventoryStatus(row.c13 as string | number | undefined)
          return inventoryStatus === STOCKOUT_LABEL ? <Tag color="error">{inventoryStatus}</Tag> : inventoryStatus
        }

        if (isConsultationList && col.title === '操作') {
          return (
            <Space size={12}>
              <a
                onClick={(event) => {
                  event.stopPropagation()
                  navigate(`${pathname}/${row.id}`)
                }}
              >
                查看
              </a>
              <a
                onClick={(event) => {
                  event.stopPropagation()
                  navigate(`${pathname}/${row.id}`)
                }}
              >
                编辑
              </a>
            </Space>
          )
        }

        if (isSurveyList && col.title === '操作') {
          const status = String(row.c5 ?? '')
          const editDisabled = status === 'SUBMITTED' || status === 'INVALID'
          return (
            <Space size={12}>
              <a
                onClick={(event) => {
                  event.stopPropagation()
                  navigate(`${pathname}/${row.id}`)
                }}
              >
                查看
              </a>
              {editDisabled ? (
                <span style={{ color: '#94a3b8', cursor: 'not-allowed' }}>编辑</span>
              ) : (
                <a
                  onClick={(event) => {
                    event.stopPropagation()
                    navigate(`${pathname}/${row.id}`)
                  }}
                >
                  编辑
                </a>
              )}
            </Space>
          )
        }

        if (isSurveyTemplateList && col.title === '操作') {
          return (
            <Space size={12}>
              <a
                onClick={(event) => {
                  event.stopPropagation()
                  navigate(`${pathname}/${row.id}`)
                }}
              >
                查看
              </a>
              <a
                onClick={(event) => {
                  event.stopPropagation()
                  navigate(`${pathname}/${row.id}`)
                }}
              >
                编辑
              </a>
            </Space>
          )
        }

        if (isSurveyTemplateList && col.title === '状态') {
          return <Switch checked={str === 'ENABLED'} disabled />
        }

        if (isSurveyList && col.title === '是否允许提交') {
          const yes = /^(是|yes|true|1)$/i.test(str)
          return <Tag color={yes ? 'success' : 'default'}>{yes ? '是' : '否'}</Tag>
        }

        if (isStatusCol && str) {
          return <Tag color={statusToneMap[str] ?? 'default'}>{str}</Tag>
        }

        if (col.title === '客户产品寄回地址') {
          return (
            <span
              title={str}
              style={{
                display: 'block',
                maxWidth: col.width ?? 220,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {str}
            </span>
          )
        }

        if (col.title === '模板说明') {
          return (
            <span
              title={str}
              style={{
                display: 'block',
                maxWidth: col.width ?? 320,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {str}
            </span>
          )
        }

        if (isLinkCol && str && !isWarehouseDetail) {
          // 申请单列表：工单ID列跳转工单详情
          if (pathname === '/inventory/request' && col.key === 'c1') {
            return (
              <a
                onClick={(event) => {
                  event.stopPropagation()
                  navigate(`/ticket/list/${str}`)
                }}
              >
                {str}
              </a>
            )
          }
          if (isConsultationList && col.key === 'c1') {
            return (
              <a
                onClick={(event) => {
                  event.stopPropagation()
                  navigate(`/ticket/list/${str}`)
                }}
              >
                {str}
              </a>
            )
          }
          const canJump = /查看|详情|View|Detail/i.test(str) || (!onlyViewCanNavigate && /编号|单号|ID|编码|Number/i.test(col.title))
          if (canJump) {
            return (
              <a
                onClick={(event) => {
                  event.stopPropagation()
                  navigate(`${pathname}/${row.id}`)
                }}
              >
                {str}
              </a>
            )
          }
        }

        return str
      },
    }))

    const hasOperation = schema.columns.some((column) => column.title.includes('操作'))
    if (hasOperation) return mapped

    return [
      ...mapped,
      {
        title: '操作',
        key: 'action',
        width: 80,
        fixed: 'right',
        align: 'center',
        render: (_, row) => {
          if (row.isWarehouseDetail) return ''

          return (
            <a
              onClick={(event) => {
                event.stopPropagation()
                navigate(`${pathname}/${row.id}`)
              }}
            >
              查看
            </a>
          )
        },
      },
    ]
  }, [navigate, pathname, schema])

  const rowSelection = useMemo<TableProps<ModuleRow>['rowSelection']>(() => {
    if (!enableCheckboxSelection) return undefined

    return {
      selectedRowKeys,
      onChange: (keys) => setSelectedRowKeys(keys.map(String)),
      getCheckboxProps: (record) => ({
        disabled: record.isWarehouseDetail === true,
      }),
      renderCell: (_checked, record, _index, originNode) => (record.isWarehouseDetail ? null : originNode),
    }
  }, [enableCheckboxSelection, selectedRowKeys])

  const applySurveyFilters = (rows: ModuleRow[]) => {
    const values = filterForm.getFieldsValue() as Record<string, unknown>
    const normalize = (value: unknown) => String(value ?? '').trim().toLowerCase()

    const deadline = values.f1
    const keyword = normalize(values.f2)
    const customerName = normalize(values.f3)
    const phone = normalize(values.f4)
    const productModel = normalize(values.f5)
    const purchasePlace = String(values.f6 ?? '').trim()
    const complaintReason = String(values.f7 ?? '').trim()

    return rows.filter((row) => {
      if (deadline && dayjs.isDayjs(deadline)) {
        const rowDeadline = String(row.c6 ?? '')
        if (!rowDeadline.startsWith(deadline.format('YYYY-MM-DD'))) return false
      }

      if (keyword) {
        const target = [row.c1, row.c2, row.c4].map((v) => normalize(v))
        if (!target.some((value) => value.includes(keyword))) return false
      }

      if (customerName && !normalize(row.customerName).includes(customerName)) return false
      if (phone && !normalize(row.phone).includes(phone)) return false
      if (productModel && !normalize(row.productModel).includes(productModel)) return false

      if (purchasePlace && purchasePlace !== '全部' && String(row.purchasePlace ?? '').trim() !== purchasePlace) return false
      if (complaintReason && complaintReason !== '全部' && String(row.complaintReason ?? '').trim() !== complaintReason) return false

      return true
    })
  }

  const handleSearch = () => {
    if (!isSurveyList) return
    setDataSource(applySurveyFilters(sourceRows))
  }

  const exportSurveyRows = (rows: ModuleRow[]) => {
    if (!schema || rows.length === 0) return

    const exportColumns = schema.columns.filter((column) => column.title !== '操作')
    const csvEscape = (value: unknown) => `"${String(value ?? '').replace(/"/g, '""')}"`
    const header = exportColumns.map((column) => csvEscape(column.title)).join(',')
    const body = rows
      .map((row) => exportColumns.map((column) => csvEscape(row[column.key])).join(','))
      .join('\r\n')
    const csv = `\uFEFF${header}\r\n${body}`

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `问卷列表_${dayjs().format('YYYYMMDD_HHmmss')}.csv`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
  }

  const handleToolbarAction = (actionKey: string) => {
    if (isSurveyList && actionKey === 'download') {
      exportSurveyRows(dataSource)
    }
  }

  if (loading) {
    return <Card loading style={{ margin: 16 }} />
  }

  if (!schema) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
          暂无数据
        </div>
      </Card>
    )
  }

  return (
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Breadcrumb items={breadcrumbItems} />
        </Col>
        <Col>
            <Space size={8}>
              {pathname === '/inventory/request' && (
              <Button
                icon={<EditOutlined />}
                disabled={selectedRowKeys.length === 0}
                onClick={() => setEditModalOpen(true)}
              >
                批量编辑{selectedRowKeys.length > 0 ? ` (${selectedRowKeys.length})` : ''}
              </Button>
              )}
              <ListPageToolbar pathname={pathname} onAction={handleToolbarAction} />
            </Space>
          </Col>
        </Row>

      <Card style={{ border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Form layout="vertical" form={filterForm}>
              <Row gutter={16} align="bottom">
                {visibleFilters.map((filter) => (
                  <Col key={filter.key} xs={24} sm={12} lg={6}>
                    <Form.Item label={filter.label} name={filter.key} style={{ marginBottom: 0 }}>
                      {filter.type === 'input' ? <Input placeholder={filter.placeholder} /> : null}
                      {filter.type === 'select' ? (
                        <Select
                          options={(filter.options ?? []).map((value) => ({ value, label: value }))}
                        />
                      ) : null}
                      {filter.type === 'date' ? <DatePicker style={{ width: '100%' }} /> : null}
                    </Form.Item>
                  </Col>
                ))}
              </Row>
            </Form>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              flexShrink: 0,
              paddingTop: 24,
            }}
          >
            <Space size={8}>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} />
              <Button
                icon={filtersExpanded ? <UpOutlined /> : <DownOutlined />}
                onClick={() => setFiltersExpanded((value) => !value)}
                disabled={!canToggleFilters}
              />
            </Space>
          </div>
        </div>
      </Card>

      <Card style={{ border: '1px solid #f1f5f9' }} styles={{ body: { padding: 0 } }}>
        <Table
          rowKey={(row) => String(row.id)}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          expandable={
            enableProductExpand
              ? {
                  rowExpandable: (record) => Array.isArray(record.children) && record.children.length > 0,
                }
              : undefined
          }
          rowSelection={rowSelection}
          scroll={{ x: 1400 }}
          pagination={{ total: 128, pageSize: 10, showSizeChanger: false }}
          onRow={(record) => ({
            style: { cursor: !record.isWarehouseDetail && pathname !== '/product/list' ? 'pointer' : 'default' },
            onClick: () => {
              if (!record.isWarehouseDetail && pathname !== '/product/list') {
                navigate(`${pathname}/${record.id}`)
              }
            },
          })}
        />
      </Card>

      {/* 批量编辑弹框 */}
      <Modal
        title="批量编辑"
        open={editModalOpen}
        onOk={() => {
          // TODO: 调用API保存批量编辑
          console.log('批量编辑保存:', {
            ids: selectedRowKeys,
            progressStatus: editProgressStatus,
            handleTime: editHandleTime.format('YYYY-MM-DD HH:mm:ss'),
            handler: editHandler,
          })
          setEditModalOpen(false)
        }}
        onCancel={() => setEditModalOpen(false)}
        maskClosable={false}
        okText="保存"
        cancelText="取消"
        width={480}
      >
        <Space direction="vertical" size={16} style={{ width: '100%', marginTop: 8 }}>
          <div>
            <div style={{ marginBottom: 8, color: '#64748b' }}>已选工单ID（共 {selectedRowKeys.length} 个）</div>
            <div className="batch-edit-selected-ids" style={{ padding: '8px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', minHeight: 40 }}>
              {selectedRowKeys.length === 0 ? (
                <span style={{ color: '#94a3b8' }}>未选择工单</span>
              ) : (
                <Space size={8} wrap>
                  {selectedRowKeys.map((key) => {
                    const row = dataSource.find((r) => String(r.id) === key)
                    const ticketId = String(row?.c1 || key)
                    return (
                      <Tag
                        key={key}
                        closable
                        color="blue"
                        onClose={() => {
                          setSelectedRowKeys(selectedRowKeys.filter((k) => k !== key))
                        }}
                      >
                        {ticketId}
                      </Tag>
                    )
                  })}
                </Space>
              )}
            </div>
          </div>

          <Form layout="vertical">
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item label="进度状态">
                  <Select
                    value={editProgressStatus}
                    onChange={setEditProgressStatus}
                    options={['待处理', '处理中', '已完成', '已关闭'].map((v) => ({ value: v, label: v }))}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item label="处理人">
                  <Select
                    showSearch
                    value={editHandler}
                    onChange={setEditHandler}
                    options={['当前用户', '张敏', '王雪', '李晨', '马会宁', '周晨曦', '宋逸凡'].map((v) => ({ value: v, label: v }))}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="处理时间">
              <DatePicker
                showTime
                value={editHandleTime}
                onChange={(val) => val && setEditHandleTime(val)}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Form>
        </Space>
      </Modal>
    </Space>
  )
}
