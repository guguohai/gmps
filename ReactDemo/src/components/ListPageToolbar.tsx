import {
  DeleteOutlined,
  DownloadOutlined,
  DownOutlined,
  EditOutlined,
  PlusOutlined,
  PrinterOutlined,
  ReloadOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { Button, Dropdown, Space } from 'antd'
import type { MenuProps } from 'antd'

type ToolbarAction =
  | {
      key: string
      kind: 'button'
      label?: string
      icon?: React.ReactNode
      tone?: 'default' | 'primary' | 'danger'
      iconOnly?: boolean
    }
  | {
      key: string
      kind: 'dropdown'
      label: string
      icon?: React.ReactNode
      tone?: 'default' | 'primary'
      menuItems: MenuProps['items']
    }

const defaultPrintItems: MenuProps['items'] = [
  { key: 'barcode', label: '条码批量打印' },
  { key: 'delivery', label: '运单打印' },
]

const toolbarActionMap: Record<string, ToolbarAction[]> = {
  '/ticket/list': [
    {
      key: 'print',
      kind: 'dropdown',
      label: '打印',
      icon: <PrinterOutlined />,
      menuItems: defaultPrintItems,
    },
    { key: 'download', kind: 'button', icon: <DownloadOutlined />, iconOnly: true },
    { key: 'refresh', kind: 'button', icon: <ReloadOutlined />, iconOnly: true },
    { key: 'create', kind: 'button', label: '新增', icon: <PlusOutlined />, tone: 'primary' },
    { key: 'delete', kind: 'button', icon: <DeleteOutlined />, iconOnly: true, tone: 'danger' },
  ],
  '/inventory/discrepancy': [
    { key: 'refresh', kind: 'button', label: '刷新数据', icon: <ReloadOutlined /> },
    { key: 'create', kind: 'button', icon: <PlusOutlined />, iconOnly: true },
  ],
  '/inventory/request': [
    { key: 'download', kind: 'button', label: '导出', icon: <DownloadOutlined /> },
    { key: 'refresh', kind: 'button', label: '刷新', icon: <ReloadOutlined /> },
    { key: 'delete', kind: 'button', label: '删除', icon: <DeleteOutlined />, tone: 'danger' },
  ],
  '/inventory/sync': [
    { key: 'download', kind: 'button', label: '导出', icon: <DownloadOutlined /> },
    { key: 'refresh', kind: 'button', icon: <ReloadOutlined />, iconOnly: true },
  ],
  '/inventory/record': [
    { key: 'download', kind: 'button', label: '导出', icon: <DownloadOutlined /> },
    { key: 'refresh', kind: 'button', icon: <ReloadOutlined />, iconOnly: true },
  ],
  '/parts/list': [
    { key: 'create', kind: 'button', label: '新增', icon: <PlusOutlined />, tone: 'primary' },
  ],
  '/parts/request': [
    { key: 'create', kind: 'button', label: '新建申请', icon: <PlusOutlined />, tone: 'primary' },
    { key: 'download', kind: 'button', label: '导出', icon: <DownloadOutlined /> },
  ],
  '/service/survey': [
    { key: 'download', kind: 'button', label: '导出Excel', icon: <DownloadOutlined /> },
  ],
  '/service/consultation': [
    { key: 'create', kind: 'button', label: '新增事项', icon: <PlusOutlined />, tone: 'primary' },
    { key: 'download', kind: 'button', label: '导出Excel', icon: <DownloadOutlined /> },
  ],
  '/service/notice': [
    { key: 'download', kind: 'button', label: '导出', icon: <DownloadOutlined /> },
    { key: 'refresh', kind: 'button', icon: <ReloadOutlined />, iconOnly: true },
  ],
  '/permission/user': [
    { key: 'download', kind: 'button', icon: <DownloadOutlined />, iconOnly: true },
    { key: 'refresh', kind: 'button', icon: <ReloadOutlined />, iconOnly: true },
    { key: 'create', kind: 'button', label: '新增', icon: <PlusOutlined />, tone: 'primary' },
  ],
  '/permission/role': [
    { key: 'download', kind: 'button', icon: <DownloadOutlined />, iconOnly: true },
    { key: 'refresh', kind: 'button', icon: <ReloadOutlined />, iconOnly: true },
    { key: 'create', kind: 'button', label: '新增', icon: <PlusOutlined />, tone: 'primary' },
  ],
  '/permission/list': [
    { key: 'create', kind: 'button', label: '新增', icon: <PlusOutlined />, tone: 'primary' },
  ],
  '/config/dict': [
    { key: 'create', kind: 'button', label: '新增字典', icon: <PlusOutlined />, tone: 'primary' },
  ],
  '/config/template': [
    { key: 'create', kind: 'button', label: '新增模板', icon: <PlusOutlined />, tone: 'primary' },
  ],
  '/config/status': [
    { key: 'create', kind: 'button', label: '新增状态', icon: <PlusOutlined />, tone: 'primary' },
  ],
  '/product/list': [
    { key: 'download', kind: 'button', label: '导出', icon: <DownloadOutlined /> },
    { key: 'upload', kind: 'button', label: '上传', icon: <UploadOutlined /> },
    { key: 'edit', kind: 'button', label: '编辑', icon: <EditOutlined /> },
    { key: 'refresh', kind: 'button', label: '刷新', icon: <ReloadOutlined />, tone: 'primary' },
  ],
}

const getButtonClassName = (action: Extract<ToolbarAction, { kind: 'button' }> | Extract<ToolbarAction, { kind: 'dropdown' }>) => {
  const classes = ['list-toolbar-btn']
  if ('iconOnly' in action && action.iconOnly) classes.push('list-toolbar-btn-icon')
  if (action.tone === 'primary') classes.push('list-toolbar-btn-primary')
  if (action.tone === 'danger') classes.push('list-toolbar-btn-danger')
  return classes.join(' ')
}

export function ListPageToolbar({
  pathname,
  onAction,
}: {
  pathname: string
  onAction?: (key: string) => void
}) {
  const actions = toolbarActionMap[pathname] ?? [{ key: 'refresh', kind: 'button', label: '刷新数据', icon: <ReloadOutlined /> }]
  const handleAction = onAction ?? (() => undefined)

  return (
    <Space size={8}>
      {actions.map((action) => {
        if (action.kind === 'dropdown') {
          return (
            <Dropdown.Button
              key={action.key}
              trigger={['click']}
              menu={{
                items: action.menuItems,
                onClick: ({ key }) => handleAction(String(key)),
              }}
              icon={<DownOutlined className="app-dropdown-menu-arrow" />}
              className="list-toolbar-dropdown-btn"
            >
              <Space size={6}>
                {action.icon}
                <span>{action.label}</span>
              </Space>
            </Dropdown.Button>
          )
        }

        return (
          <Button key={action.key} className={getButtonClassName(action)} icon={action.icon} onClick={() => handleAction(action.key)}>
            {action.iconOnly ? null : action.label}
          </Button>
        )
      })}
    </Space>
  )
}
