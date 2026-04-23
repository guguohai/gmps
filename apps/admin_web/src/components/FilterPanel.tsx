import { DownOutlined, SearchOutlined, UpOutlined } from '@ant-design/icons'
import { Button, Card, Col, DatePicker, Form, Input, Row, Select, Space } from 'antd'
import type { FormInstance } from 'antd/es/form'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import type { ModuleSchema } from '../types/module'

const toDatePickerValue = (value: unknown) => {
  if (!value) return undefined
  if (dayjs.isDayjs(value)) return value
  const parsed = dayjs(value as dayjs.ConfigType)
  return parsed.isValid() ? parsed : undefined
}

export function FilterPanel({
  schema,
  form,
  onSearch,
}: {
  schema: ModuleSchema | null
  form: FormInstance
  onSearch?: () => void
}) {
  const [filtersExpanded, setFiltersExpanded] = useState(false)

  const canToggleFilters = (schema?.filters.length ?? 0) > 4
  const visibleFilters = useMemo(() => {
    if (!schema) return []
    if (!canToggleFilters || filtersExpanded) return schema.filters
    return schema.filters.slice(0, 4)
  }, [canToggleFilters, filtersExpanded, schema])

  const showInlineSearchButton = !canToggleFilters && visibleFilters.length < 4

  if (!schema) return null

  return (
    <Card style={{ border: '1px solid #f1f5f9' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <Form layout="vertical" form={form}>
            <Row gutter={16} align="bottom">
              {visibleFilters.map((filter) => (
                <Col key={filter.key} xs={24} sm={12} lg={6}>
                  {filter.type === 'date' ? (
                    <Form.Item
                      label={filter.label}
                      name={filter.key}
                      style={{ marginBottom: 0 }}
                      getValueProps={(value) => ({ value: toDatePickerValue(value) })}
                    >
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  ) : (
                    <Form.Item label={filter.label} name={filter.key} style={{ marginBottom: 0 }}>
                      {filter.type === 'input' ? <Input placeholder={filter.placeholder} /> : null}
                      {filter.type === 'select' ? (
                        <Select
                          options={(filter.options ?? []).map((option) =>
                            typeof option === 'string' ? { value: option, label: option } : option
                          )}
                        />
                      ) : null}
                    </Form.Item>
                  )}
                </Col>
              ))}
              {showInlineSearchButton ? (
                <Col xs={24} sm={12} lg={6}>
                  <Form.Item label=" " style={{ marginBottom: 0 }}>
                    <Button type="primary" icon={<SearchOutlined />} onClick={onSearch} />
                  </Form.Item>
                </Col>
              ) : null}
            </Row>
          </Form>
        </div>

        {!showInlineSearchButton ? (
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
              <Button type="primary" icon={<SearchOutlined />} onClick={onSearch} />
              {canToggleFilters ? (
                <Button
                  icon={filtersExpanded ? <UpOutlined /> : <DownOutlined />}
                  onClick={() => setFiltersExpanded((value) => !value)}
                />
              ) : null}
            </Space>
          </div>
        ) : null}
      </div>
    </Card>
  )
}
