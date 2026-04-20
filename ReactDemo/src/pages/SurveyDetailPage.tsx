import { Breadcrumb, Button, Card, Col, DatePicker, Form, Input, Row, Select, Space, Switch, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { ModuleField, ModuleRow } from '../services/api'
import { useModuleData } from '../hooks/useModuleData'
import { useI18n } from '../i18n/context'
import { getNavigationBreadcrumbLabels } from '../utils/navigationI18n'

const { TextArea } = Input

// 填报结果行类型
type SurveyResultRow = {
  key: string
  questionNo: string
  questionTitle: string
  answer: string
  submitTime: string
}

const SURVEY_FIELD_ORDER = [
  '工单编号',
  '问卷编号',
  '问卷模板',
  '问卷标题',
  '问卷说明',
  '问卷状态',
  '截止时间',
  '是否允许提交',
  '题目数量',
  '创建时间',
  '更新时间',
]

const ENABLED_SURVEY_TEMPLATES = ['售后满意度回访问卷', '客户确认问卷', '配送体验调查', '售后流程反馈']

const SURVEY_RESULT_DATA_MAP: Record<string, SurveyResultRow[]> = {
  'SVY-202401-002': [
    { key: '1', questionNo: 'Q1', questionTitle: '整体服务是否满意', answer: '满意', submitTime: '2024-01-18 10:31:00' },
    { key: '2', questionNo: 'Q2', questionTitle: '维修速度是否符合预期', answer: '符合预期', submitTime: '2024-01-18 10:31:00' },
    { key: '3', questionNo: 'Q3', questionTitle: '是否愿意再次选择本服务', answer: '愿意', submitTime: '2024-01-18 10:31:00' },
  ],
}

const normalizeFields = (fields: ModuleField[]): ModuleField[] => {
  return fields.map((field) => ({
    ...field,
    type: field.type ?? 'input',
  }))
}

const parseDateValue = (value: string) => {
  if (!value) return undefined
  const normalized = value.includes('T') ? value : value.replace(' ', 'T')
  const parsed = dayjs(normalized)
  return parsed.isValid() ? parsed : undefined
}

const isSwitchOn = (value: string) => {
  const normalized = value.trim().toLowerCase()
  return normalized === 'on' || normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === '是'
}

const renderEditableField = (field: ModuleField) => {
  const type = field.type ?? 'input'
  const value = Array.isArray(field.value) ? field.value.join(',') : (field.value ?? '')

  if (type === 'switch') return <Switch defaultChecked={isSwitchOn(value)} />
  if (type === 'select') {
    const options = (field.options && field.options.length ? field.options : [value || '']).filter(Boolean)
    return <Select defaultValue={value || options[0]} options={options.map((option) => ({ value: option, label: option }))} style={{ width: '100%' }} />
  }
  if (type === 'date') return <DatePicker showTime style={{ width: '100%' }} defaultValue={parseDateValue(value)} />
  if (type === 'textarea') return <TextArea rows={3} defaultValue={value} />
  return <Input defaultValue={value} />
}

const renderReadOnlyField = (field: ModuleField) => {
  const value = Array.isArray(field.value) ? field.value.join(', ') : (field.value ?? '')
  if (field.key === '问卷状态') {
    const colorMap: Record<string, string> = {
      PENDING: 'default',
      SUBMITTED: 'success',
      EXPIRED: 'warning',
      INVALID: 'error',
    }
    const labelMap: Record<string, string> = {
      PENDING: '待填写',
      SUBMITTED: '已提交',
      EXPIRED: '已过期',
      INVALID: '已失效',
    }
    return <Tag color={colorMap[String(value)] || 'default'}>{labelMap[String(value)] || value}</Tag>
  }
  return <span>{value || '-'}</span>
}

export function SurveyDetailPage() {
  const navigate = useNavigate()
  const { messages } = useI18n()
  const { schema, sections, basePath, detailData, detailId } = useModuleData()

  const currentRow = useMemo(() => {
    if (detailData) return detailData
    if (!schema) return null
    return (schema.rows.find((row) => String(row.id) === detailId) ?? schema.rows[0] ?? null) as ModuleRow | null
  }, [detailData, detailId, schema])

  const surveyNo = String(currentRow?.c2 ?? '')
  const surveyStatus = String(currentRow?.c5 ?? '')
  const surveyResultData = SURVEY_RESULT_DATA_MAP[surveyNo] ?? []

  const basicSections = useMemo(() => {
    const baseSection = sections.find((section) => section.title === '基础信息')
    if (!baseSection) return []

    const rowValueMap: Record<string, string> = {
      工单编号: String(currentRow?.c1 ?? ''),
      问卷编号: surveyNo,
      问卷模板: String(currentRow?.c3 ?? ''),
      问卷标题: String(currentRow?.c4 ?? ''),
      问卷说明: String(currentRow?.surveyDesc ?? ''),
      问卷状态: surveyStatus,
      截止时间: String(currentRow?.c6 ?? ''),
      是否允许提交: String(currentRow?.c7 ?? ''),
      题目数量: String(currentRow?.questionCount ?? surveyResultData.length),
      创建时间: String(currentRow?.createTime ?? ''),
      更新时间: String(currentRow?.c8 ?? ''),
    }

    const normalizedFields = normalizeFields(baseSection.fields).map((field) => {
      const label = field.label
      const nextField: ModuleField = {
        ...field,
        value: rowValueMap[label] ?? field.value,
      }

      if (label === '工单编号' || label === '问卷编号' || label === '题目数量' || label === '创建时间' || label === '更新时间') {
        nextField.type = 'text'
        nextField.editable = false
      } else if (label === '问卷状态') {
        nextField.type = 'text'
        nextField.editable = false
      } else if (label === '问卷模板') {
        nextField.type = 'select'
        nextField.options = ENABLED_SURVEY_TEMPLATES
        nextField.editable = true
      } else if (label === '问卷标题') {
        nextField.type = 'input'
        nextField.editable = true
      } else if (label === '问卷说明') {
        nextField.type = 'textarea'
        nextField.editable = true
      } else if (label === '截止时间') {
        nextField.type = 'date'
        nextField.editable = true
      } else if (label === '是否允许提交') {
        nextField.type = 'switch'
        nextField.value = isSwitchOn(String(nextField.value ?? '')) ? 'on' : 'off'
        nextField.editable = true
      }

      return nextField
    })

    const fieldByLabel = new Map(normalizedFields.map((field) => [field.label, field]))
    const orderedFields = SURVEY_FIELD_ORDER.map((label) => fieldByLabel.get(label)).filter(Boolean) as ModuleField[]
    const extraFields = normalizedFields.filter((field) => !SURVEY_FIELD_ORDER.includes(field.label))

    return [{ ...baseSection, fields: [...orderedFields, ...extraFields] }]
  }, [currentRow, sections, surveyNo, surveyResultData.length, surveyStatus])

  // 填报结果数据
  const resultColumns: ColumnsType<SurveyResultRow> = [
    { title: '题目编号', dataIndex: 'questionNo', key: 'questionNo', width: 100 },
    { title: '题目标题', dataIndex: 'questionTitle', key: 'questionTitle', width: 200 },
    { title: '用户答案', dataIndex: 'answer', key: 'answer', render: (value) => <span>{value || '-'}</span> },
    { title: '提交时间', dataIndex: 'submitTime', key: 'submitTime', width: 160 },
  ]

  if (!schema) {
    return <Card loading style={{ margin: 16 }} />
  }

  const [parentBreadcrumbLabel, currentBreadcrumbLabel] = getNavigationBreadcrumbLabels(messages, basePath, schema.breadcrumb)

  return (
    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
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

      {/* 基础信息区域 */}
      {basicSections
        .map((section) => (
          <Card key={section.title} title={section.title}>
            <Form layout="vertical">
              <Row gutter={16}>
                {normalizeFields(section.fields).map((field) => {
                  const editable = field.editable !== false
                  return (
                    <Col key={`${section.title}-${field.key}-${field.label}`} xs={24} md={12}>
                      <Form.Item label={field.label}>
                        {editable ? renderEditableField(field) : renderReadOnlyField(field)}
                      </Form.Item>
                    </Col>
                  )
                })}
              </Row>
            </Form>
          </Card>
        ))}

      {/* 填报结果区域 - 仅在 SUBMITTED 状态展示 */}
      {surveyStatus === 'SUBMITTED' && (
        <Card title="填报结果">
          <Table
            rowKey="key"
            columns={resultColumns}
            dataSource={surveyResultData}
            pagination={false}
            size="small"
            scroll={{ x: 600 }}
          />
        </Card>
      )}
    </Space>
  )
}
