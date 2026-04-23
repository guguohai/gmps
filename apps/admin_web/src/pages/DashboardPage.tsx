import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Col, Row, Space, Table, Tag, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n/context'
import { activityStream, kpiCards, recentServiceRequests, trendData } from '../mocks/data/dashboard'

const { Title, Text } = Typography

function TrendTooltip({
  active,
  payload,
  label,
  serviceVolumeLabel,
}: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
  serviceVolumeLabel: string
}) {
  if (!active || !payload?.length) return null

  return (
    <div
      className="dashboard-trend-tooltip"
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 8px 24px rgba(15,23,42,.08)',
        padding: '10px 12px',
        minWidth: 120,
      }}
    >
      <div style={{ color: '#64748b', marginBottom: 4 }}>{label}</div>
      <div style={{ lineHeight: 1, fontWeight: 700, color: '#1e293b' }}>{payload[0].value}</div>
      <div style={{ color: '#94a3b8', marginTop: 4 }}>{serviceVolumeLabel}</div>
    </div>
  )
}

export function DashboardPage() {
  const navigate = useNavigate()
  const { messages } = useI18n()
  const requestColumns: ColumnsType<(typeof recentServiceRequests)[number]> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (value) => (
        <Text strong style={{ color: '#177ee5' }}>
          {value}
        </Text>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      render: (value) => (
        <Space size={8}>
          <Text>{value}</Text>
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (value: string) => {
        const colorMap: Record<string, string> = {
          'In Progress': 'blue',
          Pending: 'orange',
          Completed: 'green',
        }
        return <Tag color={colorMap[value] ?? 'default'}>{value}</Tag>
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (value: string) => {
        const colorMap: Record<string, string> = {
          High: 'volcano',
          Medium: 'gold',
          Low: 'default',
        }
        return <Tag color={colorMap[value] ?? 'default'}>{value}</Tag>
      },
    },
    { title: 'Assigned To', dataIndex: 'assignee', key: 'assignee' },
  ]

  const iconBg = ['#fff7ed', '#eff6ff', '#faf5ff', '#ecfdf5'] as const
  const iconFill = ['#f97316', '#3b82f6', '#a855f7', '#10b981'] as const
  const toneBg: Record<string, string> = {
    blue: '#3b82f6',
    green: '#10b981',
    orange: '#f59e0b',
    gray: '#cbd5e1',
  }

  const renderKpiIcon = (index: number) => {
    if (index === 0) {
      return (
        <svg width="24" height="24" style={{ fill: iconFill[index], display: 'block' }} focusable="false" aria-hidden="true" viewBox="0 0 24 24">
          <path d="M17 12c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5m1.65 7.35L16.5 17.2V14h1v2.79l1.85 1.85zM18 3h-3.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H6c-1.1 0-2 .9-2 2v15c0 1.1.9 2 2 2h6.11c-.59-.57-1.07-1.25-1.42-2H6V5h2v3h8V5h2v5.08c.71.1 1.38.31 2 .6V5c0-1.1-.9-2-2-2m-6 2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1" />
        </svg>
      )
    }

    if (index === 1) {
      return (
        <svg width="24" height="24" style={{ fill: iconFill[index], display: 'block' }} focusable="false" aria-hidden="true" viewBox="0 0 24 24">
          <path d="M22 10v8h-2v-8zm-2 10v2h2v-2zm-2-2.71C16.53 18.95 14.39 20 12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8v9l7.55-7.55C17.72 3.34 15.02 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10c2.25 0 4.33-.74 6-2z" />
        </svg>
      )
    }

    if (index === 2) {
      return (
        <svg width="24" height="24" style={{ fill: iconFill[index], display: 'block' }} focusable="false" aria-hidden="true" viewBox="0 0 24 24">
          <path d="M15 1H9v2h6zm-4 13h2V8h-2zm8.03-6.61 1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61M12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7" />
        </svg>
      )
    }

    return (
      <svg width="24" height="24" style={{ fill: iconFill[index], display: 'block' }} focusable="false" aria-hidden="true" viewBox="0 0 24 24">
        <path d="M22 5.18 10.59 16.6l-4.24-4.24 1.41-1.41 2.83 2.83 10-10zm-2.21 5.04c.13.57.21 1.17.21 1.78 0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8c1.58 0 3.04.46 4.28 1.25l1.44-1.44C16.1 2.67 14.13 2 12 2 6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10c0-1.19-.22-2.33-.6-3.39z" />
      </svg>
    )
  }

  return (
    <Space orientation="vertical" size={24} style={{ width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={3} style={{ margin: 0, fontWeight: 800 }}>
            {messages.dashboard.title}
          </Title>
          <Text type="secondary">{messages.dashboard.subtitle}</Text>
        </Col>
        <Col>
          <Button type="primary" size="middle" icon={<PlusOutlined />} onClick={() => navigate('/ticket/list/115001')}>
            {messages.dashboard.createTicket}
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {kpiCards.map((card, index) => (
          <Col xs={24} sm={12} lg={6} key={card.key}>
            <Card
              styles={{ body: { padding: 20 } }}
              style={{ border: '1px solid #f1f5f9', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
            >
              <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                <Row justify="space-between" align="middle">
                  <div
                    className="dashboard-kpi-icon"
                    style={{
                      width: 36,
                      height: 36,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: iconBg[index] ?? '#eff6ff',
                      color: iconFill[index] ?? '#177ee5',
                    }}
                  >
                    {renderKpiIcon(index)}
                  </div>
                  <Tag color={card.trend.includes('+') ? 'green' : card.trend.includes('-') ? 'default' : 'blue'}>
                    {card.trend}
                  </Tag>
                </Row>
                <Text type="secondary" style={{ textTransform: 'uppercase', color: '#667085', fontWeight: 500 }}>
                  {card.title}
                </Text>
                <Title level={2} style={{ margin: 0, lineHeight: 1, fontWeight: 600 }}>
                  {card.value}
                </Title>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title={messages.dashboard.serviceVolumeTrends} style={{ border: '1px solid #f1f5f9' }} styles={{ body: { padding: '12px 18px 16px' } }}>
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <ComposedChart data={trendData} margin={{ top: 8, right: 14, bottom: 4, left: 0 }}>
                  <defs>
                    <linearGradient id="volumeBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2f8cff" stopOpacity={1} />
                      <stop offset="100%" stopColor="#5aa8ff" stopOpacity={0.78} />
                    </linearGradient>
                    <linearGradient id="volumeArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid vertical={false} stroke="#e8eef7" strokeDasharray="4 6" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ className: 'dashboard-chart-axis-x' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ className: 'dashboard-chart-axis-y' }} width={34} />
                  <Tooltip cursor={{ fill: 'rgba(59,130,246,0.08)' }} content={<TrendTooltip serviceVolumeLabel={messages.dashboard.serviceVolume} />} />

                  <Area
                    type="monotone"
                    dataKey="volume"
                    stroke="#78b3ff"
                    strokeWidth={2}
                    fill="url(#volumeArea)"
                    dot={false}
                    activeDot={{ r: 4, fill: '#1d4ed8', stroke: '#fff', strokeWidth: 2 }}
                  />
                  <Bar dataKey="volume" fill="url(#volumeBar)" radius={[8, 8, 0, 0]} barSize={28} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title={messages.dashboard.recentServiceRequests} extra={<Button type="link">{messages.dashboard.viewAll}</Button>} style={{ marginTop: 16, border: '1px solid #f1f5f9' }}>
            <Table rowKey="key" columns={requestColumns} dataSource={recentServiceRequests} pagination={false} size="middle" />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title={messages.dashboard.activityStream} style={{ height: '100%', border: '1px solid #f1f5f9' }}>
            <Space orientation="vertical" size={22} style={{ width: '100%' }}>
              {activityStream.map((item) => (
                <div
                  key={item.key}
                  style={{
                    position: 'relative',
                    paddingLeft: 24,
                    borderLeft: '2px solid #f1f5f9',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: -9,
                      top: 0,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      border: '4px solid #fff',
                      background: toneBg[item.tone] ?? '#3b82f6',
                      boxSizing: 'border-box',
                    }}
                  />
                  <div style={{ fontWeight: 700, color: '#26343d' }}>{item.title}</div>
                  <div style={{ color: '#64748b', marginTop: 4 }}>{item.desc}</div>
                  <div style={{ color: '#94a3b8', marginTop: 8, fontWeight: 500 }}>{item.time}</div>
                </div>
              ))}
            </Space>
            <Button block style={{ marginTop: 20, borderColor: '#e2e8f0', color: '#64748b', fontWeight: 700 }}>
              Load more activities
            </Button>
          </Card>
        </Col>
      </Row>
    </Space>
  )
}
