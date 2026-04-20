import { Card, Table, Typography } from 'antd'
import { useLocation } from 'react-router-dom'
import { defaultModuleMock, moduleMockMap } from '../mocks/moduleMock'

const { Paragraph, Title } = Typography

export function ModuleTablePage() {
  const { pathname } = useLocation()
  const mock = moduleMockMap[pathname] ?? {
    ...defaultModuleMock,
    title: pathname,
  }

  return (
    <Card>
      <Title level={4}>{mock.title}</Title>
      <Paragraph type="secondary">{mock.description}</Paragraph>
      <Table
        rowKey="key"
        columns={mock.columns}
        dataSource={mock.data}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 960 }}
      />
    </Card>
  )
}
