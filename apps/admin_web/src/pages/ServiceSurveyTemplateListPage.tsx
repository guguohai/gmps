import { EditOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, Form, Input, Row, Select, Space, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ListPageToolbar } from '../components/ListPageToolbar'
import { getServiceSurveyTemplateList } from '../services/serviceApi'
import type { ModuleRow } from '../types/module'

const PAGE_SIZE = 10

type FilterValues = {
  keyword?: string
  status?: string
}

export function ServiceSurveyTemplateListPage() {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [sourceRows, setSourceRows] = useState<ModuleRow[]>([])
  const [filters, setFilters] = useState<FilterValues>({})
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    let cancelled = false
    getServiceSurveyTemplateList()
      .then((res) => { if (!cancelled && res.data) setSourceRows(res.data) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const statusOptions = useMemo(() =>
    Array.from(new Set(sourceRows.map((row) => String(row.status ?? '')).filter(Boolean))).map((value) => ({ label: value, value })),
  [sourceRows])

  const filteredRows = useMemo(() => sourceRows.filter((row) => {
    if (filters.keyword) {
      const kw = filters.keyword.trim().toLowerCase()
      const matchNo = String(row.templateNo ?? '').toLowerCase().includes(kw)
      const matchName = String(row.templateName ?? '').toLowerCase().includes(kw)
      if (!matchNo && !matchName) return false
    }
    if (filters.status && String(row.status ?? '') !== filters.status) return false
    return true
  }), [filters, sourceRows])

  const dataSource = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredRows.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredRows])

  const columns = useMemo<ColumnsType<ModuleRow>>(() => [
    { title: '模板编号', dataIndex: 'templateNo', key: 'templateNo', width: 160 },
    { title: '模板名称', dataIndex: 'templateName', key: 'templateName', width: 220 },
    { title: '问卷标题', dataIndex: 'title', key: 'title', width: 240 },
    { title: '问题数', dataIndex: 'questionCount', key: 'questionCount', width: 100 },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', width: 180 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 120, render: (v: unknown) => <Tag>{String(v) === 'ENABLED' ? '启用' : String(v ?? '')}</Tag> },
    {
      title: '操作',
      key: 'operation',
      width: 120,
      render: (_, row: ModuleRow) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={(event) => {
            event.stopPropagation()
            navigate('/service/survey-template/' + String(row.id))
          }}
        />
      ),
    },
  ], [navigate])

  const handleFilter = (values: FilterValues) => { setFilters(values); setCurrentPage(1) }
  const handleReset = () => { form.resetFields(); setFilters({}); setCurrentPage(1) }
  if (loading) return <Card loading style={{ margin: 16 }} />

  return (
    <div className="app-page-stack">
      <Row className="app-sticky-page-bar" justify="space-between" align="middle">
        <Col><Breadcrumb items={[{ title: '服务管理' }, { title: '问卷模板' }]} /></Col>
        <Col><ListPageToolbar pathname="/service/survey-template" /></Col>
      </Row>
      <Card style={{ border: '1px solid #f1f5f9' }}>
        <Form form={form} layout="vertical" onFinish={handleFilter}>
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8} lg={6}><Form.Item label="关键字" name="keyword"><Input placeholder="编号/名称" /></Form.Item></Col>
            <Col xs={24} sm={12} md={8} lg={6}><Form.Item label="状态" name="status"><Select allowClear options={statusOptions} /></Form.Item></Col>
            <Col xs={24}><Space><Button type="primary" htmlType="submit">查询</Button><Button onClick={handleReset}>重置</Button></Space></Col>
          </Row>
        </Form>
      </Card>
      <Card style={{ border: '1px solid #f1f5f9' }} styles={{ body: { padding: 0 } }}>
        <Table
          rowKey={(row) => String(row.id)}
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{ current: currentPage, total: filteredRows.length, pageSize: PAGE_SIZE, showSizeChanger: false, onChange: setCurrentPage }}
          onRow={() => ({ style: { cursor: 'pointer' } })}
        />
      </Card>
    </div>
  )
}

