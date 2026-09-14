/* ==========================================================================
 * microApps：整页子应用注册表（qiankun registerMicroApps 的数据来源）
 * --------------------------------------------------------------------------
 * 字段说明：
 * - name:         子应用唯一名称，必须与子应用 window[name] 暴露的生命周期对象一致
 * - entry:        子应用开发服务地址（qiankun 会 fetch 这个 HTML 并解析）
 * - activePrefix: 路由前缀，pathname.startsWith 命中时 qiankun 自动挂载
 * - containerId:  挂载容器的 DOM id，这里统一使用 #micro-app-stage（PortalLayout 中）
 * - title:        中文显示名，用于 MicroAppPage 介绍卡
 * - roles:        能访问此子应用的角色编码列表
 *
 * 【新增一个整页子应用的步骤】
 *   1. 在这里加一条配置 → 2. 在 menuConfig.js 加对应菜单项
 *   → 3. 在 authStore.prepareRouteData 的 fetchers 加对应预取逻辑
 *   → 4. 在 router/index.jsx 的 children 加 /xxx/* 路由指向 MicroAppPage
 * ========================================================================== */
export const MICRO_APPS = [
  {
    name: 'legacy-crm-vue2',
    entry: 'http://localhost:7201',
    activePrefix: '/customers',
    containerId: 'micro-app-stage',
    title: '客户中心',
    roles: ['platform_admin', 'sales_manager'],
  },
  {
    name: 'approval-react',
    entry: 'http://localhost:7202',
    activePrefix: '/approvals',
    containerId: 'micro-app-stage',
    title: '审批中心',
    roles: ['platform_admin', 'finance_auditor'],
  },
  {
    name: 'analytics-vue3',
    entry: 'http://localhost:7204',
    activePrefix: '/analytics',
    containerId: 'micro-app-stage',
    title: '运营分析',
    roles: ['platform_admin', 'sales_manager', 'ops_analyst'],
  },
]

/** 按角色过滤出有权访问的整页子应用（目前未直接使用，保留扩展） */
export function getAvailableAppsForRole(role) {
  return MICRO_APPS.filter((item) => item.roles.includes(role))
}

/** 用 pathname 反查是哪个子应用配置（目前未直接使用，保留扩展） */
export function findMicroAppByPath(pathname) {
  return MICRO_APPS.find((item) => pathname.startsWith(item.activePrefix))
}
