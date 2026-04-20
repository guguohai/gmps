import { Navigate, Route, Routes, useParams, useLocation } from 'react-router-dom'
import { navGroups } from './config/navigation'
import { AppLayout } from './layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { InventoryDiscrepancyDetailPage } from './pages/InventoryDiscrepancyDetailPage'
import { InventoryDiscrepancyListPage } from './pages/InventoryDiscrepancyListPage'
import { InventoryRequestDetailPage } from './pages/InventoryRequestDetailPage'
import { ConsultationDetailPage } from './pages/ConsultationDetailPage'
import { LoginPage } from './pages/LoginPage'
import { StandardDetailPage } from './pages/StandardDetailPage'
import { StandardListPage } from './pages/StandardListPage'
import { SurveyDetailPage } from './pages/SurveyDetailPage'
import { SurveyTemplateDetailPage } from './pages/SurveyTemplateDetailPage'
import { TicketDetailPage } from './pages/TicketDetailPage'
import { TicketDetailPage2 } from './pages/TicketDetailPage2'
import { isAuthenticated } from './services/auth'

// 工单详情路由包装组件，根据id判断使用哪个页面
function TicketDetailWrapper() {
  const { id } = useParams()
  // 第二条数据（id为114088）使用 TicketDetailPage2
  if (id === '114088') {
    return <TicketDetailPage2 />
  }
  return <TicketDetailPage />
}

// 路由守卫组件
function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const authenticated = isAuthenticated()
  
  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  
  return <>{children}</>
}

function App() {
  const allPaths = navGroups.flatMap((g) => g.children.map((c) => c.path))

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RequireAuth><AppLayout /></RequireAuth>}>
        <Route index element={<DashboardPage />} />
        <Route path="inventory/discrepancy" element={<InventoryDiscrepancyListPage />} />
        <Route path="inventory/discrepancy/:id" element={<InventoryDiscrepancyDetailPage />} />
        {allPaths
          .filter((p) => p !== '/' && p !== '/inventory/discrepancy')
          .map((path) => {
            const normalized = path.replace(/^\//, '')
            return (
              <Route key={path}>
                <Route path={normalized} element={<StandardListPage />} />
                <Route
                  path={`${normalized}/:id`}
                  element={
                    path === '/ticket/list' ? <TicketDetailWrapper /> :
                    path === '/inventory/request' ? <InventoryRequestDetailPage /> :
                    path === '/service/consultation' ? <ConsultationDetailPage /> :
                    path === '/service/survey' ? <SurveyDetailPage /> :
                    path === '/service/survey-template' ? <SurveyTemplateDetailPage /> :
                    <StandardDetailPage />
                  }
                />
              </Route>
            )
          })}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
