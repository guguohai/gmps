import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, theme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#177ee5',
          colorBgLayout: '#f5f7fa',
          colorText: '#26343d',
          fontFamily: 'var(--app-font-family)',
        },
        components: {
          Input: {
            colorBgContainer: '#f5f7fa',
            colorBorder: 'transparent',
            activeBorderColor: '#1677ff',
            hoverBorderColor: 'transparent',
            activeShadow: '0 0 0 2px rgba(22,119,255,0.16)',
          },
          Select: {
            colorBgContainer: '#f5f7fa',
            colorBorder: 'transparent',
            activeBorderColor: '#1677ff',
            hoverBorderColor: 'transparent',
            activeOutlineColor: 'rgba(22,119,255,0.16)',
          },
          DatePicker: {
            colorBgContainer: '#f5f7fa',
            colorBorder: 'transparent',
            activeBorderColor: '#1677ff',
            hoverBorderColor: 'transparent',
            activeShadow: '0 0 0 2px rgba(22,119,255,0.16)',
          },
        },
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>,
)
