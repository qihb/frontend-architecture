/* ==========================================================================
 * menuConfig：菜单 + 权限 + 路由守卫 配置中心
 * --------------------------------------------------------------------------
 * 设计原则：
 * - 菜单和权限配置数据驱动，新增菜单只改 MENU_ITEMS
 * - 每个菜单项声明 roles 数组，表示哪些角色能看见 / 访问
 * - 菜单项分两种：
 *   type: 'host'  → 主应用原生页（Dashboard / Settings / Customer360 等）
 *   type: 'micro' → 整页子应用（路由前缀匹配）
 * ========================================================================== */

/** 角色编码 → 中文显示名 映射 */
export const ROLE_LABELS = {
  platform_admin: '平台管理员',
  sales_manager: '销售经理',
  finance_auditor: '财务审批',
  ops_analyst: '运营分析师',
}

/**
 * 角色 → 默认首页路由 映射
 * 角色登录后 / 无权限跳转时用这个路由
 */
export const ROLE_HOME = {
  platform_admin: '/dashboard',
  sales_manager: '/customers/list',
  finance_auditor: '/approvals/todo',
  ops_analyst: '/analytics/overview',
}

/**
 * 全量菜单项配置（所有角色可见菜单的全集）
 * 字段说明：
 * - key:     唯一标识，用于 ICONS 映射、渲染
 * - label:   菜单显示文字
 * - path:    点击菜单跳转的路由；整页子应用时带 list/todo/overview
 * - type:    'host' 主应用原生页 | 'micro' 整页子应用路由前缀
 * - appName: 对应 microApps.js 中声明的子应用名（type=micro 时必填）
 * - roles:   有权限的角色编码数组
 */
export const MENU_ITEMS = [
  {
    key: 'dashboard',
    label: '工作台',
    path: '/dashboard',
    type: 'host',
    roles: ['platform_admin', 'sales_manager', 'finance_auditor', 'ops_analyst'],
  },
  {
    key: 'customers',
    label: '客户中心',
    path: '/customers/list',
    type: 'micro',
    appName: 'legacy-crm-vue2',
    roles: ['platform_admin', 'sales_manager'],
  },
  {
    key: 'approvals',
    label: '审批中心',
    path: '/approvals/todo',
    type: 'micro',
    appName: 'approval-react',
    roles: ['platform_admin', 'finance_auditor'],
  },
  {
    key: 'analytics',
    label: '运营分析',
    path: '/analytics/overview',
    type: 'micro',
    appName: 'analytics-vue3',
    roles: ['platform_admin', 'sales_manager', 'ops_analyst'],
  },
  {
    key: 'customer360',
    label: '客户360',
    path: '/customer-360',
    type: 'host',
    roles: ['platform_admin', 'sales_manager', 'finance_auditor', 'ops_analyst'],
  },
  {
    key: 'settings',
    label: '系统设置',
    path: '/settings',
    type: 'host',
    roles: ['platform_admin'],
  },
]

/**
 * 按角色过滤菜单：拿到该角色可见的菜单项子集 */
export function buildMenusForRole(role) {
  return MENU_ITEMS.filter((item) => item.roles.includes(role))
}

/**
 * 路由权限判断：当前角色能否访问 pathname
 * - 完全匹配 item.path → 放行
 * - 把 list/todo/overview 后缀去掉后前缀匹配 → 放行（整页子应用）
 *   例如：/customers/xxx → basePath=/customers → startsWith 命中
 * - 两者都不命中 → 视为越权（PortalLayout 中跳 ROLE_HOME）
 */
export function canAccessRoute(role, pathname) {
  return buildMenusForRole(role).some((item) => {
    if (item.path === pathname) {
      return true
    }

    const basePath = item.path.replace(/\/(list|todo|overview)$/, '')
    return pathname.startsWith(basePath)
  })
}
