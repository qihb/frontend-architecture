/* ==========================================================================
 * PortalLayout：主应用核心框架布局
 * --------------------------------------------------------------------------
 * 【关键设计决策】
 * 1. 子应用挂载容器 #micro-app-stage 放在此组件中（而非 MicroAppPage 内）
 *    原因：singular 模式下容器随路由组件销毁会导致 qiankun 无法正确执行
 *    unmount，引发应用残留或切换空白（详见 Lessons Learned）
 * 2. 顶部 Header 固定高度 64px，防止布局塌缩
 * 3. 菜单和路由访问权限由 menuConfig + authStore 联动控制
 * ========================================================================== */
import {
  AppstoreOutlined,
  DashboardOutlined,
  LogoutOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { Avatar, Button, Layout, Menu, Select, Space, Spin, Tag, Typography } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo } from 'react'

import { MICRO_APPS } from '../config/microApps'
import { ROLE_HOME, ROLE_LABELS, canAccessRoute } from '../config/menuConfig'
/* 启动时立即注册 qiankun 子应用（幂等，内部有 registered flag 保证只执行一次） */
import { ensureMicroAppsRegistered } from '../qiankun/registerApps'
import { useAuthStore } from '../store/authStore'

/* 组件顶层即执行注册：确保 qiankun 生命周期在 React 渲染前就绪 */
ensureMicroAppsRegistered()

const { Content, Header, Sider } = Layout

/**
 * 判断当前路由是否匹配某个整页子应用
 * 用于控制 #micro-app-stage 容器是否渲染
 */
function isMicroAppRoute(pathname) {
  return MICRO_APPS.some((item) => pathname.startsWith(item.activePrefix))
}

/* 菜单图标映射表：按 menuConfig 中 key 对应 Ant Design 图标 */
const ICONS = {
  analytics: <AppstoreOutlined />,
  approvals: <SafetyCertificateOutlined />,
  customer360: <TeamOutlined />,
  customers: <TeamOutlined />,
  dashboard: <DashboardOutlined />,
  settings: <SettingOutlined />,
}

export default function PortalLayout() {
  /* React Router Hooks：获取当前路由和导航能力 */
  const location = useLocation()
  const navigate = useNavigate()

  /* 从 Zustand authStore 订阅需要的状态和动作 */
  const bootstrapLoading = useAuthStore((state) => state.bootstrapLoading)
  const logout = useAuthStore((state) => state.logout)
  const menus = useAuthStore((state) => state.menus)
  const prepareRouteData = useAuthStore((state) => state.prepareRouteData)
  const role = useAuthStore((state) => state.role)
  const switchRole = useAuthStore((state) => state.switchRole)
  const userInfo = useAuthStore((state) => state.userInfo)

  /* ------------------------------------------------------------------
   * 路由权限守卫：
   * 当 role 或 pathname 变化时，检查当前角色是否有权访问当前路由。
   * 无权限时自动跳回该角色的默认首页（ROLE_HOME 映射表）
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (!role) {
      return
    }

    if (!canAccessRoute(role, location.pathname)) {
      navigate(ROLE_HOME[role], { replace: true })
    }
  }, [location.pathname, navigate, role])

  /* ------------------------------------------------------------------
   * 根据当前角色的 menus 动态构建 Ant Design Menu items
   * useMemo 避免每次渲染重新生成数组
   * ------------------------------------------------------------------ */
  const menuItems = useMemo(
    () =>
      menus.map((item) => ({
        key: item.path,
        icon: ICONS[item.key],
        label: item.label,
      })),
    [menus],
  )

  /* ------------------------------------------------------------------
   * 角色切换处理：
   * 1. 调用 switchRole 重置用户信息、菜单、token
   * 2. 预取新角色默认首页的业务上下文
   * 3. 跳转至新角色首页
   * ------------------------------------------------------------------ */
  const handleRoleChange = async (nextRole) => {
    const home = await switchRole(nextRole)
    await prepareRouteData(home)
    navigate(home, { replace: true })
  }

  /* ------------------------------------------------------------------
   * 菜单点击处理：
   * 先预取目标路由的业务前置数据（prepareRouteData 内部会缓存）
   * 再执行路由跳转，确保子应用挂载时 props.preloadData 已就绪
   * ------------------------------------------------------------------ */
  const handleMenuClick = async ({ key }) => {
    await prepareRouteData(key)
    navigate(key)
  }

  return (
    <Layout className="portal-layout">
      {/* 左侧 Sider：主应用框架层，紫色可视化边框标识 */}
      <Sider
        breakpoint="lg"
        className="portal-sider portal-visual-frame"
        data-visual-label="主应用框架 · Sider 菜单"
        width={240}
      >
        <div className="portal-brand">
          <Tag color="blue">Portal Shell</Tag>
          <Typography.Title level={4}>集团运营中台</Typography.Title>
          <Typography.Paragraph>
            登录、权限、菜单、前置数据与微前端编排都由主应用统一承接。
          </Typography.Paragraph>
        </div>
        <Menu
          className="portal-menu"
          items={menuItems}
          mode="inline"
          onClick={handleMenuClick}
          /* 根据 pathname 智能匹配选中项，兼容 /customers/list → /customers 这种前缀场景 */
          selectedKeys={[menus.find((item) => location.pathname.startsWith(item.path.replace(/\/(list|todo|overview)$/, ''))) ?.path ?? location.pathname]}
        />
      </Sider>

      <Layout>
        {/* 顶部 Header：主应用框架层，紫色可视化边框标识 */}
        <Header
          className="portal-header portal-visual-frame"
          data-visual-label="主应用框架 · Header 用户信息"
        >
          <Space size="middle">
            <Avatar style={{ backgroundColor: '#94a3b8', verticalAlign: 'middle' }} size={40}>
              {userInfo?.name?.slice(0, 1) ?? '李'}
            </Avatar>
            {/* 纵向 Flex 布局：姓名在上，角色代码在下，使用等宽字体增强辨识度 */}
            <div className="portal-user-info">
              <strong style={{ display: 'block' }}>{userInfo?.name ?? '未登录'}</strong>
              <div className="portal-role-code">{role}</div>
            </div>
          </Space>

          <Space size="middle">
            {/* 角色快速切换下拉：触发菜单重新生成 + 路由守卫 */}
            <Select
              onChange={handleRoleChange}
              options={Object.entries(ROLE_LABELS).map(([value, label]) => ({
                label,
                value,
              }))}
              value={role}
              style={{ width: 180 }}
            />
            <Button icon={<LogoutOutlined />} onClick={() => {
              logout()
              navigate('/login', { replace: true })
            }}>
              退出
            </Button>
          </Space>
        </Header>

        {/* Content：主应用原生内容 + 子应用挂载容器的承载区 */}
        <Content className="portal-content">
          {bootstrapLoading ? (
            /* 角色切换时的全局 Loading：等待用户信息 + 菜单权限接口返回 */
            <div className="portal-loading">
              <Spin size="large" />
              <p>正在刷新当前角色的权限上下文...</p>
            </div>
          ) : (
            <>
              {/*
                React Outlet：渲染当前路由匹配的主应用页面组件
                - DashboardPage / SettingsPage / Customer360Page 等原生页
                - MicroAppPage（整页子应用包装页，本身不包含挂载容器）
              */}
              <Outlet />

              {/*
                【关键】稳定的子应用挂载容器
                - 只有当路由匹配到整页子应用前缀时才渲染（节省 DOM）
                - 放在 PortalLayout 层，不会随 MicroAppPage 的卸载而销毁
                - 橙色虚线边框标识为整页子应用挂载区
              */}
              {isMicroAppRoute(location.pathname) ? (
                <div id="micro-app-stage" className="micro-app-stage micro-app-stage--stable" />
              ) : null}
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  )
}
