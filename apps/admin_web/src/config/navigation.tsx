import type { ReactNode } from 'react'
import boxIcon from '../assets/box.svg'
import boxesIcon from '../assets/boxes.svg'
import commentDotsIcon from '../assets/messages-question.svg'
import dashboardIcon from '../assets/dashboard.svg'
import settingsIcon from '../assets/settings.svg'
import settingsSlidersIcon from '../assets/settings-sliders.svg'
import ticketIcon from '../assets/ticket.svg'
import usersAltIcon from '../assets/users-alt.svg'

export type NavItem = {
  key: string
  label: string
  path: string
}

export type NavGroup = {
  key: string
  label: string
  icon: ReactNode
  children: NavItem[]
}

const menuIcon = (src: string, alt: string) => (
  <img
    src={src}
    alt={alt}
    className="app-nav-menu-icon"
  />
)

export const navGroups: NavGroup[] = [
  {
    key: 'dashboard',
    label: '仪表盘',
    icon: menuIcon(dashboardIcon, 'dashboard'),
    children: [{ key: 'dashboard', label: 'Dashboard', path: '/' }],
  },
  {
    key: 'ticket',
    label: '工单管理',
    icon: menuIcon(ticketIcon, 'ticket'),
    children: [{ key: 'ticket_list', label: '工单列表', path: '/ticket/list' }],
  },
  {
    key: 'product',
    label: '产品管理',
    icon: menuIcon(boxIcon, 'product'),
    children: [{ key: 'product_list', label: '产品列表', path: '/product/list' }],
  },
  {
    key: 'inventory',
    label: '库存管理',
    icon: menuIcon(boxesIcon, 'inventory'),
    children: [
      { key: 'inventory_request', label: '申请单', path: '/inventory/request' },
      { key: 'inventory_diff', label: '差异处理', path: '/inventory/discrepancy' },
      { key: 'inventory_sync', label: '同步日志', path: '/inventory/sync' },
      { key: 'inventory_record', label: '库存记录', path: '/inventory/record' },
    ],
  },
  {
    key: 'parts',
    label: '小零件管理',
    icon: menuIcon(settingsSlidersIcon, 'parts'),
    children: [
      { key: 'parts_list', label: '小零件列表', path: '/parts/list' },
      { key: 'parts_request', label: '小零件申请', path: '/parts/request' },
    ],
  },
  {
    key: 'service',
    label: '服务管理',
    icon: menuIcon(commentDotsIcon, 'service'),
    children: [
      { key: 'service_survey', label: '问卷列表', path: '/service/survey' },
      { key: 'service_survey_template', label: '问卷模板', path: '/service/survey-template' },
      { key: 'service_consult', label: '咨询列表', path: '/service/consultation' },
    ],
  },
  {
    key: 'permission',
    label: '权限管理',
    icon: menuIcon(usersAltIcon, 'permission'),
    children: [
      { key: 'user_list', label: '用户列表', path: '/permission/user' },
      { key: 'role_list', label: '角色列表', path: '/permission/role' },
      { key: 'permission_list', label: '权限列表', path: '/permission/list' },
    ],
  },
  {
    key: 'config',
    label: '系统配置',
    icon: menuIcon(settingsIcon, 'config'),
    children: [
      { key: 'config_dict', label: '数据字典', path: '/config/dict' },
      { key: 'config_template', label: '模板配置', path: '/config/template' },
      { key: 'config_status', label: '状态配置', path: '/config/status' },
    ],
  },
]
