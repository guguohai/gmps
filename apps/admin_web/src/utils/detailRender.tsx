import type { ReactNode } from 'react'
import { DatePicker, Input, InputNumber, Select, Switch } from 'antd'
import dayjs from 'dayjs'
import type { ModuleField } from '../types/module'

const toNumber = (value: string | number | undefined) => {
  if (typeof value === 'number') return value
  const normalized = String(value ?? '').replace(/,/g, '').trim()
  return Number(normalized) || 0
}

const isSwitchOn = (value: string) => {
  const normalized = value.trim().toLowerCase()
  return normalized === 'on' || normalized === 'true' || normalized === '1' || normalized === 'yes' || normalized === '是'
}

const isSwitchLike = (value: string) => {
  const normalized = value.trim().toLowerCase()
  return normalized === 'on' || normalized === 'off' || normalized === 'true' || normalized === 'false' || normalized === '1' || normalized === '0'
}

const parseDateValue = (value: string) => {
  if (!value) return undefined
  const normalized = value.includes('T') ? value : value.replace(' ', 'T')
  const parsed = dayjs(normalized)
  return parsed.isValid() ? parsed : undefined
}

export function normalizeFields(fields: ModuleField[]): ModuleField[] {
  const normalized: ModuleField[] = []
  let skipYesNo = false

  for (const field of fields) {
    const label = field.label.trim()
    if (skipYesNo && (label === '是' || label === '否')) continue

    if (label === '是否需要审核') {
      const fieldValue = Array.isArray(field.value) ? field.value.join(',') : (field.value ?? '')
      normalized.push({ ...field, type: 'switch', value: isSwitchOn(fieldValue) ? 'on' : 'off' })
      skipYesNo = true
      continue
    }

    skipYesNo = false
    normalized.push(field)
  }

  return normalized
}

export function renderEditableField(field: ModuleField): ReactNode {
  const type = field.type
  const strValue = Array.isArray(field.value) ? field.value.join(',') : (field.value ?? '')

  if (!type) return <span>{strValue || '-'}</span>
  if (type === 'switch') return <Switch defaultChecked={isSwitchOn(strValue)} />
  if (type === 'input' && isSwitchLike(strValue)) return <Switch defaultChecked={isSwitchOn(strValue)} />
  if (type === 'number') return <InputNumber style={{ width: '100%' }} defaultValue={toNumber(strValue)} />
  if (type === 'date') return <DatePicker style={{ width: '100%' }} defaultValue={parseDateValue(strValue)} />
  if (type === 'select') {
    const options = (field.options && field.options.length ? field.options : [strValue || '']).filter(Boolean)
    return <Select defaultValue={strValue || options[0]} options={options.map((option) => ({ value: option, label: option }))} />
  }
  if (type === 'searchSelect') {
    const options = (field.options ?? []).map((option) => ({ value: option, label: option }))
    const hasDefaultValue = Boolean(strValue && !/搜索/.test(strValue))
    const placeholder = hasDefaultValue ? '输入关键词搜索' : (strValue || '输入关键词搜索')
    return (
      <Select
        showSearch
        allowClear
        optionFilterProp="label"
        defaultValue={hasDefaultValue ? strValue : undefined}
        placeholder={placeholder}
        options={options}
      />
    )
  }
  if (type === 'multiSelect') {
    const options = field.options ?? []
    const selectedValues = Array.isArray(field.value) ? field.value : [field.value].filter(Boolean)
    return (
      <Select
        mode="multiple"
        defaultValue={selectedValues}
        options={options.map((option) => ({ value: option, label: option }))}
        placeholder="请选择角色"
        style={{ width: '100%' }}
      />
    )
  }
  if (type === 'textarea') return <Input.TextArea rows={3} defaultValue={strValue} />
  return <Input defaultValue={strValue} />
}

export function renderReadOnlyField(field: ModuleField): ReactNode {
  const type = field.type ?? 'input'
  const strValue = Array.isArray(field.value) ? field.value.join(',') : (field.value ?? '')

  if (type === 'switch' || (type === 'input' && isSwitchLike(strValue))) {
    return <span>{isSwitchOn(strValue) ? '是' : '否'}</span>
  }

  return <span>{strValue || '-'}</span>
}
