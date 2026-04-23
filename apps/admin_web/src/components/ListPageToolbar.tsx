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
import { TICKET_LIST_SHORTCUT_STATUSES } from '../business/ticketStatus'
import { useI18n } from '../i18n/context'

type ToolbarAction =
  | {
      key: string
      kind: 'button'
      label?: string
      icon?: React.ReactNode
      tone?: 'default' | 'primary' | 'danger'
      iconOnly?: boolean
      className?: string
    }
  | {
      key: string
      kind: 'dropdown'
      label: string
      icon?: React.ReactNode
      tone?: 'default' | 'primary'
      menuItems: MenuProps['items']
      className?: string
    }

const ticketShortcutClassNames = [
  'list-toolbar-status-shortcut-received',
  'list-toolbar-status-shortcut-wait-confirm',
  'list-toolbar-status-shortcut-wait-pay',
  'list-toolbar-status-shortcut-repairing',
  'list-toolbar-status-shortcut-wait-ship',
]

const getButtonClassName = (action: Extract<ToolbarAction, { kind: 'button' }> | Extract<ToolbarAction, { kind: 'dropdown' }>) => {
  const classes = ['list-toolbar-btn']
  if ('iconOnly' in action && action.iconOnly) classes.push('list-toolbar-btn-icon')
  if (action.tone === 'primary') classes.push('list-toolbar-btn-primary')
  if (action.tone === 'danger') classes.push('list-toolbar-btn-danger')
  if (action.className) classes.push(action.className)
  return classes.join(' ')
}

export function ListPageToolbar({
  pathname,
  onAction,
  ticketStatusValue,
  onTicketStatusChange,
}: {
  pathname: string
  onAction?: (key: string) => void
  ticketStatusValue?: string
  onTicketStatusChange?: (status: string) => void
}) {
  const { messages } = useI18n()
  const { helpers } = useTicketStatus()

  const defaultPrintItems: MenuProps['items'] = [
    { key: 'barcode', label: messages.common.batchBarcodePrint },
    { key: 'delivery', label: messages.common.batchDeliveryPrint },
  ]

  const toolbarActionMap: Record<string, ToolbarAction[]> = {
    '/ticket/list': [
      {
        key: 'print',
        kind: 'dropdown',
        label: messages.common.print,
        icon: <PrinterOutlined />,
        menuItems: defaultPrintItems,
      },
      { key: 'download', kind: 'button', icon: <DownloadOutlined />, iconOnly: true },
      { key: 'edit', kind: 'button', label: messages.common.edit, icon: <EditOutlined /> },
      { key: 'create', kind: 'button', label: messages.common.add, icon: <PlusOutlined />, tone: 'primary' },
      { key: 'delete', kind: 'button', icon: <DeleteOutlined />, iconOnly: true, tone: 'danger' },
    ],
    '/inventory/discrepancy': [
      { key: 'download', kind: 'button', label: messages.common.export, icon: <DownloadOutlined /> },
      { key: 'refresh', kind: 'button', icon: <ReloadOutlined />, iconOnly: true },
    ],
    '/inventory/request': [
      { key: 'edit', kind: 'button', label: messages.common.edit, icon: <EditOutlined /> },
      { key: 'download', kind: 'button', label: messages.common.export, icon: <DownloadOutlined /> },
      { key: 'refresh', kind: 'button', icon: <ReloadOutlined />, iconOnly: true },
      { key: 'delete', kind: 'button', label: messages.common.delete, icon: <DeleteOutlined />, tone: 'danger' },
    ],
    '/inventory/sync': [
      { key: 'download', kind: 'button', label: messages.common.export, icon: <DownloadOutlined /> },
      { key: 'refresh', kind: 'button', icon: <ReloadOutlined />, iconOnly: true },
    ],
    '/inventory/record': [
      { key: 'download', kind: 'button', label: messages.common.export, icon: <DownloadOutlined /> },
      { key: 'refresh', kind: 'button', icon: <ReloadOutlined />, iconOnly: true },
    ],
    '/parts/list': [
      { key: 'download', kind: 'button', label: messages.common.export, icon: <DownloadOutlined /> },
    ],
    '/parts/request': [
      { key: 'create', kind: 'button', label: messages.common.newRequest, icon: <PlusOutlined />, tone: 'primary', iconOnly: true },
      { key: 'download', kind: 'button', label: messages.common.export, icon: <DownloadOutlined /> },
    ],
    '/service/survey': [
      { key: 'download', kind: 'button', label: messages.common.exportExcel, icon: <DownloadOutlined /> },
    ],
    '/service/consultation': [
      { key: 'create', kind: 'button', label: messages.common.newItem, icon: <PlusOutlined />, tone: 'primary' },
      { key: 'download', kind: 'button', label: messages.common.exportExcel, icon: <DownloadOutlined /> },
    ],
    '/service/notice': [
      { key: 'download', kind: 'button', label: messages.common.export, icon: <DownloadOutlined /> },
      { key: 'refresh', kind: 'button', icon: <ReloadOutlined />, iconOnly: true },
    ],
    '/permission/user': [
      { key: 'download', kind: 'button', icon: <DownloadOutlined />, iconOnly: true },
      { key: 'refresh', kind: 'button', icon: <ReloadOutlined />, iconOnly: true },
      { key: 'create', kind: 'button', label: messages.common.add, icon: <PlusOutlined />, tone: 'primary' },
    ],
    '/permission/role': [
      { key: 'download', kind: 'button', icon: <DownloadOutlined />, iconOnly: true },
      { key: 'refresh', kind: 'button', icon: <ReloadOutlined />, iconOnly: true },
      { key: 'create', kind: 'button', label: messages.common.add, icon: <PlusOutlined />, tone: 'primary' },
    ],
    '/permission/list': [
      { key: 'create', kind: 'button', label: messages.common.add, icon: <PlusOutlined />, tone: 'primary' },
    ],
    '/config/dict': [
      { key: 'create', kind: 'button', label: messages.common.newDict, icon: <PlusOutlined />, tone: 'primary' },
    ],
    '/config/template': [
      { key: 'create', kind: 'button', label: messages.common.newTemplate, icon: <PlusOutlined />, tone: 'primary' },
    ],
    '/config/status': [
      { key: 'create', kind: 'button', label: messages.common.newStatus, icon: <PlusOutlined />, tone: 'primary' },
    ],
    '/product/list': [
      { key: 'download', kind: 'button', label: messages.common.export, icon: <DownloadOutlined /> },
      { key: 'upload', kind: 'button', label: messages.common.upload, icon: <UploadOutlined /> },
      { key: 'edit', kind: 'button', label: messages.common.edit, icon: <EditOutlined /> },
      { key: 'refresh', kind: 'button', icon: <ReloadOutlined />, iconOnly: true, tone: 'primary' },
    ],
  }

  const actions = toolbarActionMap[pathname] ?? [{ key: 'refresh', kind: 'button', label: messages.common.refreshData, icon: <ReloadOutlined /> }]
  const handleAction = onAction ?? (() => undefined)

  const ticketStatusOptions = TICKET_LIST_SHORTCUT_STATUSES.map((status, index) => ({
    key: `ticketStatus_${index + 1}`,
    status,
    label: helpers?.TICKET_STATUS_LABEL_MAP?.[status] ?? status,
    className: ticketShortcutClassNames[index] ?? '',
  }))

  return (
    <Space size={6} align="center">
      {pathname === '/ticket/list' ? (
        <div className="list-toolbar-status-shortcuts">
          {ticketStatusOptions.map((item) => (
            <Button
              key={item.key}
              type="default"
              className={`list-toolbar-status-shortcut ${item.className}${ticketStatusValue === item.status ? ' is-active' : ''}`}
              onClick={() => {
                onTicketStatusChange?.(item.status)
                handleAction(item.key)
              }}
            >
              {item.label}
            </Button>
          ))}
        </div>
      ) : null}
      {actions.map((action) => {
        if (action.kind === 'dropdown') {
          return (
            <Dropdown
              key={action.key}
              trigger={['click']}
              menu={{
                items: action.menuItems,
                onClick: ({ key }) => handleAction(String(key)),
              }}
            >
              <Button className={`${getButtonClassName(action)} list-toolbar-dropdown-btn`}>
                <Space size={6}>
                  {action.icon}
                  <span>{action.label}</span>
                  <DownOutlined className="app-dropdown-menu-arrow" />
                </Space>
              </Button>
            </Dropdown>
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
