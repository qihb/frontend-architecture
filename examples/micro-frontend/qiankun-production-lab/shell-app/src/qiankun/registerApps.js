/* ==========================================================================
 * qiankun 注册中心：负责子应用注册、启动、重挂载触发
 * --------------------------------------------------------------------------
 * 核心知识点：
 * 1. 幂等性：registered / started 两个 flag 保证函数只执行一次副作用
 * 2. 动态 props：传函数而非对象，每次 mount 时从 store 取最新状态
 * 3. singular 模式：同一时刻只渲染一个子应用（整页场景），但要注意
 *    容器不能随 React 组件卸载而销毁，否则会导致 unmount 异常
 * 4. remount 机制：history.replaceState + PopStateEvent 手动触发路由
 *    重匹配，解决 prepareRouteData 异步完成后 qiankun 没感知到的问题
 * ========================================================================== */
import { registerMicroApps, start } from 'qiankun'

import { MICRO_APPS } from '../config/microApps'
import { useAuthStore } from '../store/authStore'

/* 幂等标记：确保 registerMicroApps 只被调用一次 */
let registered = false
/* 幂等标记：确保 qiankun.start() 只被调用一次 */
let started = false

/**
 * 主动触发路由跳转（供子应用回调使用）
 * 使用 pushState + 手动派发 popstate，确保 qiankun 的路由监听器能捕获到
 */
function pushRoute(pathname) {
  window.history.pushState({}, '', pathname)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

/**
 * 构建注入到子应用的共享 Props
 * 【重要】每次子应用 mount 时都会重新执行此函数，从 authStore 取最新状态
 *
 * @param {string} name - 子应用名称（对应 MICRO_APPS 中的 name 字段）
 * @returns {object} 共享上下文：token / 角色 / 租户 / 预取数据 / 回调
 */
function buildSharedProps(name) {
  /* 直接通过 getState() 取快照，避免依赖 React 订阅，保证在非 React 上下文中也能用 */
  const state = useAuthStore.getState()

  /* 应用名 → 预取数据 的映射：不同整页子应用吃不同业务域的前置摘要 */
  const preloadMap = {
    'legacy-crm-vue2': state.preloadData.customers,
    'approval-react': state.preloadData.approvals,
    'analytics-vue3': state.preloadData.analytics,
  }

  return {
    /* 登录态上下文：子应用请求业务接口时带在 header 里 */
    token: state.token,
    /* 当前角色：子应用按角色决定展示哪些模块 / 按钮 */
    role: state.role,
    /* 多租户 / 组织上下文：数据权限过滤用 */
    tenantId: state.tenantId,
    orgId: state.orgId,
    /* 用户基本信息：子应用顶部栏展示姓名、头像等 */
    userInfo: state.userInfo,
    /* 主应用在进入路由前预取的业务摘要数据
       （由 prepareRouteData 触发，存入 preloadData 对应 key）*/
    preloadData: preloadMap[name] ?? {},
    /**
     * 子应用 → 父应用 的回调：客户列表里点击「查看客户360」
     * 子应用不自己跳路由，而是委托父应用：先写入选中客户 ID，再跳转
     */
    onCustomerSelect: (customerId) => {
      useAuthStore.getState().setSelectedCustomerId(customerId)
      pushRoute('/customer-360')
    },
  }
}

/**
 * 确保 qiankun 子应用已被注册（幂等）
 * 在 PortalLayout 顶层 import 后立即调用，确保早于任何渲染
 */
export function ensureMicroAppsRegistered() {
  if (!registered) {
    /* 把配置表 MICRO_APPS 转成 qiankun 要求的 registerMicroApps 入参格式 */
    registerMicroApps(
      MICRO_APPS.map((item) => ({
        name: item.name,
        entry: item.entry,
        container: `#${item.containerId}`,
        /* activeRule 用函数形式：方便以后做更复杂的匹配逻辑（如带 query 参数） */
        activeRule: (location) => location.pathname.startsWith(item.activePrefix),
        /* 【关键】props 传函数，不传对象字面量
           每次 qiankun 触发 mount 前都会重新执行，保证 token/role/preloadData 最新 */
        props: () => buildSharedProps(item.name),
      })),
    )

    registered = true
  }
}

/**
 * 确保 qiankun 已启动（幂等）
 * 不能在注册时立即 start：需要等 React 把 #micro-app-stage 渲染到 DOM 中
 * 所以在 MicroAppPage 的 useEffect 里首次调用
 */
export function ensureQiankunStarted() {
  if (started) {
    return
  }

  start({
    /* 预取：浏览器空闲时下载其他子应用的 entry 资源，切换更快 */
    prefetch: true,
    /* 单例模式：同一时间只挂载一个整页子应用，性能和生命周期都更可控 */
    singular: true,
    /* 沙箱：开启实验性样式隔离（给子应用样式加选择器前缀），减少样式冲突 */
    sandbox: {
      experimentalStyleIsolation: true,
    },
  })

  started = true
}

/**
 * 【关键修复】重新触发当前路由对应的子应用挂载
 * 使用场景：
 *   prepareRouteData 是异步的，qiankun 首次匹配 activeRule 时
 *   props.preloadData 还是空的；等数据回来后，需要强制 qiankun 再跑一遍
 *   路由匹配逻辑，重新执行 mount（带着新 props）。
 *
 * 实现方式：
 *   history.replaceState 只改状态不产生历史记录，再手动派发
 *   PopStateEvent 让 qiankun 内部路由监听捕获到变化。
 */
export function remountCurrentMicroApp() {
  if (!started) {
    return
  }

  const { pathname, search, hash } = window.location
  window.history.replaceState({}, '', `${pathname}${search}${hash}`)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
