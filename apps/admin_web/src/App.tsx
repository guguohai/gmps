import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppLayout } from './layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { InventoryDiscrepancyDetailPage } from './pages/InventoryDiscrepancyDetailPage'
import { InventoryDiscrepancyListPage } from './pages/InventoryDiscrepancyListPage'
import { InventoryRequestDetailPage } from './pages/InventoryRequestDetailPage'
import { ConsultationDetailPage } from './pages/ConsultationDetailPage'
import { ConfigDictDetailPage } from './pages/ConfigDictDetailPage'
import { ConfigStatusDetailPage } from './pages/ConfigStatusDetailPage'
import { ConfigTemplateDetailPage } from './pages/ConfigTemplateDetailPage'
import { InventoryRecordDetailPage } from './pages/InventoryRecordDetailPage'
import { InventorySyncDetailPage } from './pages/InventorySyncDetailPage'
import { LoginPage } from './pages/LoginPage'
import { PartsDetailPage } from './pages/PartsDetailPage'
import { PartsRequestDetailPage } from './pages/PartsRequestDetailPage'
import { PermissionListDetailPage } from './pages/PermissionListDetailPage'
import { PermissionRoleDetailPage } from './pages/PermissionRoleDetailPage'
import { PermissionRolePermissionDetailPage } from './pages/PermissionRolePermissionDetailPage'
import { PermissionUserDetailPage } from './pages/PermissionUserDetailPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { SurveyDetailPage } from './pages/SurveyDetailPage'
import { SurveyTemplateDetailPage } from './pages/SurveyTemplateDetailPage'
import { TicketDetailPage } from './pages/TicketDetailPage'
import { ConfigDictListPage } from './pages/ConfigDictListPage'
import { ConfigTemplateListPage } from './pages/ConfigTemplateListPage'
import { ConfigStatusListPage } from './pages/ConfigStatusListPage'
import { InventoryRequestListPage } from './pages/InventoryRequestListPage'
import { InventorySyncListPage } from './pages/InventorySyncListPage'
import { InventoryRecordListPage } from './pages/InventoryRecordListPage'
import { PartsListPage } from './pages/PartsListPage'
import { PartsRequestListPage } from './pages/PartsRequestListPage'
import { ServiceSurveyListPage } from './pages/ServiceSurveyListPage'
import { ServiceSurveyTemplateListPage } from './pages/ServiceSurveyTemplateListPage'
import ConsultationListPage from './pages/ConsultationListPage'
import { PermissionUserListPage } from './pages/PermissionUserListPage'
import { PermissionRoleListPage } from './pages/PermissionRoleListPage'
import { PermissionRolePermissionListPage } from './pages/PermissionRolePermissionListPage'
import { PermissionListPage } from './pages/PermissionListPage'
import { TicketListPage } from './pages/TicketListPage'
import { ProductListPage } from './pages/ProductListPage'
import { isAuthenticated } from './services/auth'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const authenticated = isAuthenticated()

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<RequireAuth><AppLayout /></RequireAuth>}>
        <Route index element={<DashboardPage />} />

        {/* 库存差异 */}
        <Route path="inventory/discrepancy" element={<InventoryDiscrepancyListPage />} />
        <Route path="inventory/discrepancy/:id" element={<InventoryDiscrepancyDetailPage />} />

        {/* 工单 */}
        <Route path="ticket/list" element={<TicketListPage />} />
        <Route path="ticket/list/:id" element={<TicketDetailPage />} />

        {/* 产品 */}
        <Route path="product/list" element={<ProductListPage />} />
        <Route path="product/list/:id" element={<ProductDetailPage />} />

        {/* 库存 */}
        <Route path="inventory/request" element={<InventoryRequestListPage />} />
        <Route path="inventory/request/:id" element={<InventoryRequestDetailPage />} />
        <Route path="inventory/sync" element={<InventorySyncListPage />} />
        <Route path="inventory/sync/:id" element={<InventorySyncDetailPage />} />
        <Route path="inventory/record" element={<InventoryRecordListPage />} />
        <Route path="inventory/record/:id" element={<InventoryRecordDetailPage />} />

        {/* 小零件 */}
        <Route path="parts/list" element={<PartsListPage />} />
        <Route path="parts/list/:id" element={<PartsDetailPage />} />
        <Route path="parts/request" element={<PartsRequestListPage />} />
        <Route path="parts/request/:id" element={<PartsRequestDetailPage />} />

        {/* 服务 */}
        <Route path="service/survey" element={<ServiceSurveyListPage />} />
        <Route path="service/survey/:id" element={<SurveyDetailPage />} />
        <Route path="service/survey-template" element={<ServiceSurveyTemplateListPage />} />
        <Route path="service/survey-template/:id" element={<SurveyTemplateDetailPage />} />
        <Route path="service/consultation" element={<ConsultationListPage />} />
        <Route path="service/consultation/:id" element={<ConsultationDetailPage />} />

        {/* 权限 */}
        <Route path="permission/user" element={<PermissionUserListPage />} />
        <Route path="permission/user/:id" element={<PermissionUserDetailPage />} />
        <Route path="permission/role" element={<PermissionRoleListPage />} />
        <Route path="permission/role/:id" element={<PermissionRoleDetailPage />} />
        <Route path="permission/role-permission" element={<PermissionRolePermissionListPage />} />
        <Route path="permission/role-permission/:id" element={<PermissionRolePermissionDetailPage />} />
        <Route path="permission/list" element={<PermissionListPage />} />
        <Route path="permission/list/:id" element={<PermissionListDetailPage />} />

        {/* 系统配置 */}
        <Route path="config/dict" element={<ConfigDictListPage />} />
        <Route path="config/dict/:id" element={<ConfigDictDetailPage />} />
        <Route path="config/template" element={<ConfigTemplateListPage />} />
        <Route path="config/template/:id" element={<ConfigTemplateDetailPage />} />
        <Route path="config/status" element={<ConfigStatusListPage />} />
        <Route path="config/status/:id" element={<ConfigStatusDetailPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App
