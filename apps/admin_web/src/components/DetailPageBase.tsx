import { Breadcrumb, Button, Card, Col, Form, Row, Space } from 'antd'
import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { ModuleField, ModuleSection, ModuleSchema } from '../types/module'
import { useI18n } from '../i18n/context'
import { getNavigationBreadcrumbLabels } from '../utils/navigationI18n'
import { normalizeFields, renderEditableField, renderReadOnlyField } from '../utils/detailRender'

export interface DetailPageBaseProps {
  schema: ModuleSchema | null
  sections: ModuleSection[]
  basePath: string
  loading: boolean
  children?: ReactNode
  renderField?: (field: ModuleField, sectionTitle: string) => ReactNode
}

export function DetailPageBase({ schema, sections, basePath, loading, children, renderField }: DetailPageBaseProps) {
  const navigate = useNavigate()
  const { messages } = useI18n()

  if (loading || !schema) {
    return <Card loading style={{ margin: 16 }} />
  }

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

      {sections.map((section) => (
        <Card key={section.title} title={section.title}>
          <Form layout="vertical">
            <Row gutter={16}>
              {normalizeFields(section.fields).map((field) => (
                <Col key={`${section.title}-${field.key}-${field.label}`} xs={24} md={field.type === 'textarea' ? 24 : 12}>
                  <Form.Item label={field.label}>
                    {renderField ? renderField(field, section.title) : field.editable === false ? renderReadOnlyField(field) : renderEditableField(field)}
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Form>
        </Card>
      ))}

      {children}
    </div>
  )
}
