import { Select, Tag } from 'antd'
import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'

const appFormSelectStyle: CSSProperties & Record<string, string> = {
  '--ant-select-height': '40px',
  '--ant-select-padding-horizontal': '11px',
  '--ant-select-padding-vertical': '8px',
  '--ant-select-background-color': '#f5f7fa',
}

export type ProductOption = {
  value: string
  label: string
  code: string
  category: string
  stock: number
}

// 默认产品选项数据
export const defaultProductOptions: ProductOption[] = [
  { value: 'JUDE-01', label: 'JUDE-01', code: 'P-JD01', category: 'SUNGLASS COMBI', stock: 150 },
  { value: 'LIBERTY X-02', label: 'LIBERTY X-02', code: 'P-LX02', category: 'SUNGLASS METAL', stock: 89 },
  { value: 'GM Sunglasses A01', label: 'GM Sunglasses A01', code: 'P000123', category: 'SUNGLASS ACETATE', stock: 230 },
  { value: 'GM Sunglasses B02', label: 'GM Sunglasses B02', code: 'P000124', category: 'Accessories', stock: 3 },
  { value: 'GM Sunglasses C03', label: 'GM Sunglasses C03', code: 'P000125', category: 'Limited Edition', stock: 0 },
]

// 产品搜索选择组件
export function ProductSearchSelect({
  value,
  onChange,
  placeholder = '搜索产品...',
  options = defaultProductOptions,
  style,
}: {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  options?: ProductOption[]
  style?: CSSProperties
}) {
  const [innerValue, setInnerValue] = useState(value)
  const mergedValue = innerValue
  const handleChange = (nextValue: string) => {
    setInnerValue(nextValue)
    onChange?.(nextValue)
  }

  useEffect(() => {
    setInnerValue(value)
  }, [value])

  const selectedOption = options.find(p => p.value === mergedValue)

  return (
    <Select
      className="app-form-select"
      style={{ ...appFormSelectStyle, ...style }}
      placeholder={placeholder}
      showSearch
      value={mergedValue || undefined}
      onChange={handleChange}
      optionFilterProp="searchText"
      options={options.map(p => ({
        value: p.value,
        label: p.label,
        searchText: `${p.label} ${p.code} ${p.category}`.toLowerCase(),
      }))}
      optionRender={(option) => {
        const p = options.find(item => item.value === option.value)
        if (!p) return option.label
        // 只有库存小于 5 时才使用 error 样式
        const isLowStock = typeof p.stock === 'number' && p.stock < 5
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontWeight: 500 }}>{p.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8',fontSize:'12px' }}>
              <span style={{ fontFamily: 'monospace' }}>{p.code}</span>
              <span>{p.category}</span>
              {isLowStock ? (
                <Tag color="error">
                  缺货
                </Tag>
              ) : (
                <span style={{ color: '#94a3b8' }}>
                  可用库存: {p.stock}
                </span>
              )}
            </div>
          </div>
        )
      }}
      labelRender={() => selectedOption?.label || placeholder}
    />
  )
}
