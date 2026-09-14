/* ==========================================================================
 * router：React Router v7 路由配置 + 登录态守卫
 * --------------------------------------------------------------------------
 * 路由结构：
 *   /                     → RootRedirect（根路径转发）
 *   /login                → LoginPage（登录页，无权限校验）
 *   /                     → ProtectedLayout（外层守卫）
 *     ├─ /dashboard       → DashboardPage（主应用原生）
 *     ├─ /customers/*     → MicroAppPage（整页子应用：legacy-crm-vue2）
 *     ├─ /approvals/*     → MicroAppPage（整页子应用：approval-react）
 *     ├─ /analytics/*     → MicroAppPage（整页子应用：analytics-vue3）
 *     ├─ /customer-360    → Customer360Page（主应用编排 + 双 Widget）
 *     └─ /settings        → SettingsPage（主应用原生）
 *
 * 关键点：子应用路由使用通配符 /*，让 qiankun 自己在内部接管子路由
 * ========================================================================== */
import { Navigate, createBrowserRouter, useLocation } from 'react-router-dom'

import { ROLE_HOME } from '../config/menuConfig'
import PortalLayout from '../layouts/PortalLayout'
import Customer360Page from '../pages/Customer360Page'
import DashboardPage from '../pages/DashboardPage'
import LoginPage from '../pages/LoginPage'
import MicroAppPage from '../pages/MicroAppPage'
import SettingsPage from '../pages/SettingsPage'
import { useAuthStore } from '../store/authStore'

/**
 * 根路径 / 的重定向组件
 * - 未登录 → 去登录页
 * - 已登录 → 去当前角色的 ROLE_HOME（销售经理默认去客户中心，财务去审批中心…）
 */
function RootRedirect() {
  const role = useAuthStore((state) => state.role)
  const token = useAuthStore((state) => state.token)

  if (!token) {
    return <Navigate replace to="/login" />
  }

  return <Navigate replace to={ROLE_HOME[role] ?? '/dashboard'} />
}

/**
 * 受保护路由的外层 Layout 守卫
 * 没有 token 就跳回 /login，并把 from 信息放在 state 中（登录后可原路返回）
 * 通过校验才渲染 PortalLayout，Outlet 渲染子路由页面
 */
function ProtectedLayout() {
  const location = useLocation()
  const token = useAuthStore((state) => state.token)

  if (!token) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />
  }

  return <PortalLayout />
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedLayout />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      /* 整页子应用路由：使用通配符 /*
         qiankun 会监听 pathname 变化，在 /customers/xxx 时挂载 legacy-crm-vue2
         MicroAppPage 本身不包含挂载容器，只负责展示介绍卡和触发前置数据预取 */
      {
        path: '/customers/*',
        element: (
          <MicroAppPage
            description="模拟 Vue2/Webpack 存量 CRM 被主应用整页编排。"
            title="客户中心"
          />
        ),
      },
      {
        path: '/approvals/*',
        element: (
          <MicroAppPage
            description="父应用先补齐审批上下文，再挂载流程与授信审批系统。"
            title="审批中心"
          />
        ),
      },
      {
        path: '/analytics/*',
        element: (
          <MicroAppPage
            description="现代 Vue3/Vite 数据域也纳入统一菜单与权限体系。"
            title="运营分析"
          />
        ),
      },
      {
        path: '/customer-360',
        element: <Customer360Page />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
    ],
  },
])
