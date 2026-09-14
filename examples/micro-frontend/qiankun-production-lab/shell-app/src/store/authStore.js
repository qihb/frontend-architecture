/* ==========================================================================
 * authStore：全局状态中心（基于 Zustand）
 * --------------------------------------------------------------------------
 * 职责拆分：
 * 1. 登录态管理：token / role / userInfo / 租户组织
 * 2. 权限菜单：menus 按角色动态生成
 * 3. 前置数据：preloadData 缓存每个业务域的摘要数据，避免重复请求
 * 4. 跨页面共享：selectedCustomerId（CRM → 客户360 传参）
 *
 * Zustand 好处：
 * - 脱离 React 上下文也能用（useAuthStore.getState()）
 *   这在 qiankun 的 buildSharedProps 中非常关键
 * - 轻量，不需要 Provider 包裹
 * ========================================================================== */
import { create } from 'zustand'

import { ROLE_HOME, buildMenusForRole } from '../config/menuConfig'
import { getAnalyticsBootstrapData } from '../services/analyticsService'
import { getApprovalBootstrapData } from '../services/approvalService'
import { getMenuPermissions, getUserProfile } from '../services/authService'
import { getCustomerBootstrapData } from '../services/customerService'

/* 前置数据的初始空结构：缓存三个业务域 */
const EMPTY_PRELOAD = {
  analytics: null,
  approvals: null,
  customers: null,
}

/** 根据角色生成 mock token（真实项目中是后端签发的 JWT） */
const makeToken = (role) => `mock-token-${role}`

export const useAuthStore = create((set, get) => ({
  /* -------------------- 状态字段 -------------------- */
  token: '',                        /* 登录令牌（子应用请求时通过 props 拿） */
  role: '',                         /* 当前角色编码：platform_admin / sales_manager 等 */
  menus: [],                        /* 当前角色可见的菜单数组（渲染左侧 Sider） */
  userInfo: null,                   /* 用户基本信息：id / name / roleLabel */
  tenantId: '',                     /* 租户 ID（多租户数据隔离） */
  orgId: '',                        /* 组织 ID（更细粒度的数据权限） */
  bootstrapLoading: false,          /* 登录 / 切换角色时的全局 Loading */
  routeLoading: false,              /* 进入某个业务路由时的前置数据 Loading */
  preloadData: EMPTY_PRELOAD,       /* 缓存各业务域的前置摘要数据（MicroAppPage 读取） */
  selectedCustomerId: 'CUST-1001',  /* 跨页面共享：当前选中的客户 ID（CRM → 360） */
  customer360Data: null,            /* 客户360页面聚合好的上下文（渲染摘要卡用） */

  /* -------------------- 登录 / 角色切换 -------------------- */

  /**
   * 登录：本质上等价于激活某个角色
   * LoginPage 调用，返回该角色的默认首页 URL
   */
  login: async (role) => {
    const home = await get().activateRole(role)
    return home
  },

  /**
   * 切换角色：顶部 Header 的 Select 调用
   * 实现上与 login 复用同一段逻辑（activateRole）
   */
  switchRole: async (role) => {
    const home = await get().activateRole(role)
    return home
  },

  /**
   * 激活某个角色：登录 + 切换角色 都走这里
   * 流程：
   *   1. 写 role/token，开 bootstrapLoading
   *   2. 并行请求用户资料 + 菜单权限
   *   3. 写入 menus/userInfo/tenantId/orgId，关 Loading
   *   4. 返回该角色默认首页
   */
  activateRole: async (role) => {
    set({
      bootstrapLoading: true,
      role,
      token: makeToken(role),
      /* 切角色必须清空所有缓存，避免 A 角色数据泄漏给 B 角色 */
      preloadData: EMPTY_PRELOAD,
      customer360Data: null,
    })

    /* 【三层权限模型】
       登录后需要同时拿两种信息才能渲染主应用：
       - 用户资料（能展示姓名/头像/所属租户）
       - 菜单权限（能决定左侧菜单有哪些菜单项）
       真实项目中这两个接口通常是同一个「当前用户信息」接口拆分出来的
    */
    const [profileResponse, menuResponse] = await Promise.all([
      getUserProfile(role),
      getMenuPermissions(role),
    ])

    set({
      bootstrapLoading: false,
      menus: menuResponse.data.menus,
      userInfo: {
        id: profileResponse.data.id,
        name: profileResponse.data.name,
        roleLabel: profileResponse.data.roleLabel,
      },
      tenantId: profileResponse.data.tenantId,
      orgId: profileResponse.data.orgId,
    })

    /* 返回角色默认首页，给 navigate 跳转用 */
    return ROLE_HOME[role]
  },

  /* -------------------- 退出登录 -------------------- */
  logout: () =>
    set({
      token: '',
      role: '',
      menus: [],
      userInfo: null,
      tenantId: '',
      orgId: '',
      bootstrapLoading: false,
      routeLoading: false,
      preloadData: EMPTY_PRELOAD,
      customer360Data: null,
      selectedCustomerId: 'CUST-1001',
    }),

  /* -------------------- 业务前置数据预取 -------------------- */

  /**
   * 【关键方法】根据路由预取对应业务域的前置数据
   * 调用时机：
   *   - handleMenuClick（点击菜单时）
   *   - MicroAppPage useEffect（兜底：直接敲 URL 进来）
   *
   * 核心机制：
   *   1. 用 pathname 前缀匹配是 customers / approvals / analytics 哪个域
   *   2. 已有缓存（existing !== null）就直接返回，不重复请求
   *   3. 否则开 routeLoading → 调 service → 存缓存 → 关 routeLoading
   *   4. MicroAppPage 监听 routeLoading 变 false 就触发 qiankun remount
   *
   * 这样做的效果：
   *   子应用 mount 时 buildSharedProps(name) 从 getState() 拿到的
   *   preloadData[name] 已经有值了，不需要子应用自己查
   */
  prepareRouteData: async (pathname) => {
    const { preloadData, role } = get()

    if (!role) {
      return null
    }

    /* 路由前缀 → 业务域 fetcher 的匹配表
       新增整页子应用时，在这里加一条即可 */
    const fetchers = [
      {
        key: 'customers',
        match: pathname.startsWith('/customers'),
        existing: preloadData.customers,
        load: () => getCustomerBootstrapData(role),
      },
      {
        key: 'approvals',
        match: pathname.startsWith('/approvals'),
        existing: preloadData.approvals,
        load: () => getApprovalBootstrapData(role),
      },
      {
        key: 'analytics',
        match: pathname.startsWith('/analytics'),
        existing: preloadData.analytics,
        load: () => getAnalyticsBootstrapData(role),
      },
    ]

    const target = fetchers.find((item) => item.match)

    /* 不是业务域路由（比如 /dashboard /settings）直接不处理 */
    if (!target) {
      return null
    }

    /* 缓存命中：直接返回（切换角色时 preloadData 会被重置，所以不会串数据） */
    if (target.existing) {
      return target.existing
    }

    set({ routeLoading: true })
    const response = await target.load()

    set((state) => ({
      routeLoading: false,
      preloadData: {
        ...state.preloadData,
        [target.key]: response.data,
      },
    }))

    return response.data
  },

  /* -------------------- 其他 setter（预留） -------------------- */
  setMenus: (menus) => set({ menus }),
  resetMenusByRole: (role) => set({ menus: buildMenusForRole(role) }),
  setSelectedCustomerId: (selectedCustomerId) => set({ selectedCustomerId }),
  setCustomer360Data: (customer360Data) => set({ customer360Data }),
}))
