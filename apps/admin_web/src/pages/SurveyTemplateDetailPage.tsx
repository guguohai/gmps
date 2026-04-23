import { Breadcrumb, Button, Card, Col, Form, Input, Modal, Popconfirm, Row, Select, Space, Switch, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { ModuleField, ModuleRow, ModuleSchema, ModuleSection } from '../types/module'
import { useI18n } from '../i18n/context'
import { getNavigationBreadcrumbLabels } from '../utils/navigationI18n'
import type { QuestionRow, OptionRow } from '../types/survey'
import { getServiceSurveyTemplateDetail, getServiceSurveyTemplateSections } from '../services/serviceApi'

const { TextArea } = Input

const normalizeFields = (fields: ModuleField[]): ModuleField[] => {
  return fields.map((field) => ({
    ...field,
    type: field.type ?? 'input',
  }))
}

const renderEditableField = (field: ModuleField) => {
  const type = field.type ?? 'input'
  const value = field.value ?? ''

  if (type === 'switch') return <Switch defaultChecked={value === 'ENABLED' || value === '是' || value === 'on'} />
  if (type === 'select') {
    const options = (field.options && field.options.length ? field.options : [value || '']).filter(Boolean)
    return <Select defaultValue={value || options[0]} options={options.map((option) => ({ value: option, label: option }))} style={{ width: '100%' }} />
  }
  if (type === 'textarea') return <TextArea rows={3} defaultValue={value} />
  return <Input defaultValue={value} />
}

const renderReadOnlyField = (field: ModuleField) => {
  const value = Array.isArray(field.value) ? field.value.join(', ') : (field.value ?? '')
  if (field.key === '状态') {
    const isEnabled = value === 'ENABLED' || value === '是' || value === 'on'
    return <Switch checked={isEnabled} disabled />
  }
  return <span>{value || '-'}</span>
}

const normalizeQuestionOrder = (items: QuestionRow[]): QuestionRow[] =>
  items.map((item, index) => ({
    ...item,
    sortOrder: index + 1,
    questionNo: `Q${index + 1}`,
  }))

export function SurveyTemplateDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { messages } = useI18n()
  const [sections, setSections] = useState<ModuleSection[]>([])
  const [loading, setLoading] = useState(true)
  const [detailData, setDetailData] = useState<ModuleRow | null>(null)
  const schema: ModuleSchema = {
    path: '/service/survey-template',
    title: '问卷模板详情',
    breadcrumb: ['服务管理', '问卷模板'],
    filters: [],
    columns: [],
  }
  const basePath = '/service/survey-template'

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    let cancelled = false
    setLoading(true)
    Promise.all([getServiceSurveyTemplateDetail(id), getServiceSurveyTemplateSections()])
      .then(([detailRes, sectionRes]) => {
        if (cancelled) return
        setDetailData(detailRes.data ?? null)
        setSections(sectionRes.data ?? [])
      })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])
  const [questions, setQuestions] = useState<QuestionRow[]>([
    { key: '1', questionNo: 'Q1', questionTitle: '服务态度满意度', questionType: '单选', options: '非常满意,满意,一般,不满意', sortOrder: 1 },
    { key: '2', questionNo: 'Q2', questionTitle: '维修质量评价', questionType: '单选', options: '优秀,良好,一般,差', sortOrder: 2 },
    { key: '3', questionNo: 'Q3', questionTitle: '响应速度评价', questionType: '单选', options: '非常快,快,一般,慢', sortOrder: 3 },
    { key: '4', questionNo: 'Q4', questionTitle: '整体服务推荐度', questionType: '单选', options: '会推荐,可能会,不确定,不会推荐', sortOrder: 4 },
  ])
  const [editingKey, setEditingKey] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<QuestionRow>>({})
  const [optionRows, setOptionRows] = useState<OptionRow[]>([])

  // 题目列表表格列定义
  const questionColumns: ColumnsType<QuestionRow> = [
    { title: '题目编号', dataIndex: 'questionNo', key: 'questionNo', width: 100 },
    { title: '题目标题', dataIndex: 'questionTitle', key: 'questionTitle', width: 240 },
    { title: '题目类型', dataIndex: 'questionType', key: 'questionType', width: 100 },
    { title: '选项配置', dataIndex: 'options', key: 'options', width: 120, ellipsis: true },
    { title: '排序', dataIndex: 'sortOrder', key: 'sortOrder', width: 80 },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm title="确定删除此题目？" onConfirm={() => handleDelete(record.key)}>
            <Button type="link" danger size="small">
              删除
            </Button>
          </Popconfirm>
          <Button type="link" size="small" disabled={record.sortOrder === 1} onClick={() => handleMoveUp(record.key)}>
            上移
          </Button>
          <Button type="link" size="small" onClick={() => handleMoveDown(record.key)}>
            下移
          </Button>
        </Space>
      ),
    },
  ]

  const handleEdit = (record: QuestionRow) => {
    setEditingKey(record.key)
    setEditForm({ ...record })
    // 解析选项字符串为选项行
    const options = record.options.split(',').filter(Boolean)
    const rows: OptionRow[] = options.map((content, index) => ({
      key: `${record.key}-opt-${index}`,
      optionNo: index + 1,
      optionId: `OPT-${record.key}-${String(index + 1).padStart(3, '0')}`,
      optionContent: content.trim(),
    }))
    setOptionRows(rows)
  }

  const handleSave = () => {
    if (editingKey) {
      // 将选项行合并为选项字符串
      const optionsString = optionRows
        .sort((a, b) => a.optionNo - b.optionNo)
        .map((row) => row.optionContent)
        .join(',')
      setQuestions((prev) => normalizeQuestionOrder(prev.map((q) => (q.key === editingKey ? { ...q, ...editForm, options: optionsString } as QuestionRow : q))))
      setEditingKey(null)
      setEditForm({})
      setOptionRows([])
    }
  }

  const handleCancel = () => {
    setEditingKey(null)
    setEditForm({})
    setOptionRows([])
  }

  const handleDelete = (key: string) => {
    setQuestions((prev) => normalizeQuestionOrder(prev.filter((q) => q.key !== key)))
  }

  const handleAdd = () => {
    const newKey = Date.now().toString()
    const newQuestion: QuestionRow = {
      key: newKey,
      questionNo: `Q${questions.length + 1}`,
      questionTitle: '',
      questionType: '单选',
      options: '',
      sortOrder: questions.length + 1,
    }
    setQuestions((prev) => normalizeQuestionOrder([...prev, newQuestion]))
    setEditingKey(newKey)
    setEditForm(newQuestion)
    setOptionRows([])
  }

  const handleMoveUp = (key: string) => {
    setQuestions((prev) => {
      const index = prev.findIndex((q) => q.key === key)
      if (index <= 0) return prev
      const next = [...prev]
      const temp = next[index]
      next[index] = next[index - 1]
      next[index - 1] = temp
      return normalizeQuestionOrder(next)
    })
  }

  const handleMoveDown = (key: string) => {
    setQuestions((prev) => {
      const index = prev.findIndex((q) => q.key === key)
      if (index < 0 || index >= prev.length - 1) return prev
      const next = [...prev]
      const temp = next[index]
      next[index] = next[index + 1]
      next[index + 1] = temp
      return normalizeQuestionOrder(next)
    })
  }

  const mappedSections = useMemo(() => {
    if (!detailData) return sections
    return sections.map((section) => ({
      ...section,
      fields: section.fields.map((field) => {
        const rowValue = detailData[field.key]
        if (typeof rowValue === 'string' || typeof rowValue === 'number') {
          return { ...field, value: String(rowValue) }
        }
        return field
      }),
    }))
  }, [detailData, sections])

  if (loading) return <Card loading style={{ margin: 16 }} />

  const [parentBreadcrumbLabel, currentBreadcrumbLabel] = getNavigationBreadcrumbLabels(messages, basePath, schema.breadcrumb)

  return (
    <div className="app-page-stack">
      <Row className="app-sticky-page-bar" justify="space-between" align="middle">
        <Col>
          <Breadcrumb
            items={[
              { title: parentBreadcrumbLabel },
              { title: <Link to={basePath}>{currentBreadcrumbLabel}</Link> },
              { title: messages.common.detail },
            ]}
          />
        </Col>
        <Col>
          <Space>
            <Button onClick={() => navigate(basePath)}>返回</Button>
            <Button type="primary">保存</Button>
          </Space>
        </Col>
      </Row>

      {/* 基础信息区域 - 过滤掉题目数量字段 */}
      {mappedSections
        .filter((section) => section.title === '基础信息')
        .map((section) => {
          const displayFields = normalizeFields(section.fields)
            .filter((field) => field.key !== '题目数量')
            .sort((a, b) => {
              if (a.label === '模板说明') return 1
              if (b.label === '模板说明') return -1
              return 0
            })

          return (
            <Card key={section.title} title={section.title}>
              <Form layout="vertical">
                <Row gutter={16}>
                  {displayFields.map((field) => {
                    const editable = field.editable !== false
                    const isTemplateDesc = field.label === '模板说明'
                    return (
                      <Col key={`${section.title}-${field.key}-${field.label}`} xs={24} md={isTemplateDesc ? 24 : 12}>
                        <Form.Item label={field.label}>
                          {editable ? renderEditableField(field) : renderReadOnlyField(field)}
                        </Form.Item>
                      </Col>
                    )
                  })}
                </Row>
              </Form>
            </Card>
          )
        })}

      {/* 题目列表区域 */}
      <Card
        title="题目列表"
        extra={
          <Button type="primary" onClick={handleAdd}>
            + 新增题目
          </Button>
        }
      >
        <Table
          rowKey="key"
          columns={questionColumns}
          dataSource={questions}
          pagination={false}
          size="small"
          scroll={{ x: 800 }}
        />
      </Card>

      {/* 编辑弹窗 */}
      <Modal
        title={editingKey ? '编辑题目' : '新增题目'}
        open={!!editingKey}
        onCancel={handleCancel}
        onOk={handleSave}
        mask={{ closable: false }}
        okText="保存"
        cancelText="取消"
        width={700}
      >
        <Form layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="题目编号">
                <Input value={editForm.questionNo} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="题目类型">
                <Select
                  value={editForm.questionType}
                  options={['单选', '多选', '文本', '评分'].map((t) => ({ value: t, label: t }))}
                  onChange={(v) => setEditForm({ ...editForm, questionType: v })}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="题目标题">
                <Input
                  value={editForm.questionTitle}
                  onChange={(e) => setEditForm({ ...editForm, questionTitle: e.target.value })}
                  placeholder="请输入题目标题"
                />
              </Form.Item>
            </Col>
          </Row>

          {/* 选项配置表格 */}
          <Form.Item label="选项配置">
            <Table
              rowKey="key"
              dataSource={optionRows}
              pagination={false}
              size="small"
              columns={[
                {
                  title: '选项序号',
                  dataIndex: 'optionNo',
                  key: 'optionNo',
                  width: 100,
                  render: (value, record) => (
                    <Input
                      type="number"
                      value={value}
                      onChange={(e) => {
                        const newValue = parseInt(e.target.value) || 0
                        setOptionRows(optionRows.map((row) => (row.key === record.key ? { ...row, optionNo: newValue } : row)))
                      }}
                      style={{ width: 80 }}
                    />
                  ),
                },
                {
                  title: '选项内容',
                  dataIndex: 'optionContent',
                  key: 'optionContent',
                  render: (value, record) => (
                    <Input
                      value={value}
                      onChange={(e) => {
                        setOptionRows(optionRows.map((row) => (row.key === record.key ? { ...row, optionContent: e.target.value } : row)))
                      }}
                      placeholder="请输入选项内容"
                    />
                  ),
                },
                {
                  title: '操作',
                  key: 'action',
                  width: 80,
                  render: (_, record) => (
                    <Button
                      type="link"
                      danger
                      size="small"
                      onClick={() => setOptionRows(optionRows.filter((row) => row.key !== record.key))}
                    >
                      删除
                    </Button>
                  ),
                },
              ]}
            />
            <Button
              type="dashed"
              onClick={() => {
                const newOption: OptionRow = {
                  key: `opt-${Date.now()}`,
                  optionNo: optionRows.length + 1,
                  optionId: `OPT-${editingKey}-${String(optionRows.length + 1).padStart(3, '0')}`,
                  optionContent: '',
                }
                setOptionRows([...optionRows, newOption])
              }}
              style={{ marginTop: 8, width: '100%' }}
            >
              + 添加选项
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
