/**
 * [main-app] 主应用（基座）入口
 *
 * 对应专栏：
 *   · 《第 5 篇：qiankun 深度解析（下）——实战与踩坑》§三 主应用标准接入：registerMicroApps + start
 *   · 《第 4 篇：qiankun 深度解析（上）——原理与架构》§8 主应用注册完整示例
 *
 * 阅读顺序（与第 5 篇 §4.3「关键代码怎么读」一致）：
 *   1. 准备挂载容器              → 【第 4 篇 §2】第 1 层「主应用容器层」
 *   2. initGlobalState 建通信    → 【第 4 篇 §2】第 4 层「通信层」
 *   3. registerMicroApps 注册    → 【第 4 篇 §3.3 / §6】activeRule 与 HTML Entry
 *   4. start 启动编排            → 【第 4 篇 §9】预加载机制
 *
 * 一句话概括主应用要做的事：注册子应用、初始化全局状态、启动 qiankun 运行时（第 4 篇 §8）。
 */
import './style.css'
import { initGlobalState, registerMicroApps, start } from 'qiankun'

// 【第 4 篇 §2】第 1 层「主应用容器层」。
// #app 是主应用自身的壳；真正的子应用挂载容器是 renderShell 里预留的 #micro-container。
const app = document.querySelector('#app')

// 【第 4 篇 §2】第 4 层「通信层」的初始状态。
// 第 5 篇 demo 用它同时演示「主应用 → 子应用」与「子应用 → 主应用」的双向同步。
const initialState = {
  userName: 'Alice',
  team: '运营中台',
  currentSection: 'dashboard',
  lastAction: '等待子应用回传动作',
}

// 【第 4 篇 §2 / §8】initGlobalState 返回的 actions 即全局状态通信对象。
// 它随后会作为 props 的一部分下发给子应用（见 registerMicroApps 的 props.actions）。
// 对应第 5 篇 §4.2 验证点 3：子应用点击按钮 → 顶部「全局状态」卡片实时变化。
const actions = initGlobalState(initialState)

// 【第 5 篇 §2.3 路由基座 / §5.1 路由冲突】
// 子应用内部路由要挂在主应用分配的前缀下（/dashboard、/order）。
// 这里把 pathname 归一化成子应用标识，让主应用自身 UI 与 activeRule 共用同一套判断口径。
function normalizeRoute(pathname) {
  if (pathname.startsWith('/order')) {
    return 'order'
  }

  return 'dashboard'
}

// 【第 4 篇 §2】第 1 层「主应用容器层」：渲染主应用壳，并预留子应用挂载点 #micro-container。
function renderShell() {
  app.innerHTML = `
    <div class="shell">
      <header class="shell-header">
        <div>
          <p class="eyebrow">第五篇配套案例</p>
          <h1>qiankun 最小可运行示例</h1>
          <p class="subtitle">主应用负责注册子应用、同步全局状态，并演示最基础的路由切换。</p>
        </div>
        <div class="state-card">
          <p class="state-title">全局状态</p>
          <div id="global-state" class="state-body"></div>
        </div>
      </header>

      <nav class="nav-tabs" aria-label="微前端路由">
        <button data-route="/dashboard" class="nav-tab">Dashboard</button>
        <button data-route="/order" class="nav-tab">Order</button>
      </nav>

      <main class="layout">
        <aside class="sidebar">
          <h2>本篇要点</h2>
          <ul>
            <li>主应用使用 <code>registerMicroApps</code> 注册两个子应用</li>
            <li>通过 <code>initGlobalState</code> 演示基础通信</li>
            <li>子应用自己导出 <code>bootstrap / mount / unmount</code></li>
            <li>切换路由时观察生命周期释放效果</li>
          </ul>
        </aside>

        <section class="content">
          <div class="route-intro">
            <h2 id="route-title"></h2>
            <p id="route-desc"></p>
          </div>
          <div id="micro-container" class="micro-container"></div>
        </section>
      </main>
    </div>
  `

  // 【第 4 篇 §3.3】路由劫持的触发源之一：手动改写历史记录。
  // 这里用 history.pushState 切路由，pushState 被 qiankun 劫持后会触发 reroute，
  // 从而自动完成「命中 activeRule 的子应用挂载 / 未命中的子应用卸载」。
  app.querySelectorAll('[data-route]').forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-route')
      if (target && location.pathname !== target) {
        history.pushState(null, '', target)
        syncRoute()
      }
    })
  })
}

// 【第 4 篇 §2】第 4 层「通信层」的消费端：把全局状态渲染到顶部卡片。
function renderGlobalState(state) {
  const panel = document.querySelector('#global-state')
  if (!panel) {
    return
  }

  panel.innerHTML = `
    <p><strong>当前页面：</strong>${state.currentSection}</p>
    <p><strong>当前用户：</strong>${state.userName}</p>
    <p><strong>所属团队：</strong>${state.team}</p>
    <p><strong>最近动作：</strong>${state.lastAction}</p>
  `
}

// 【第 5 篇 §三】主应用同步自身路由相关的 UI，并主动写一次全局状态。
// 注意区分两条线：子应用的挂载/卸载由 qiankun 依据 activeRule 完成（第 4 篇 §3.3），
// 这里只负责主应用自己的导航高亮与状态广播。
function syncRoute() {
  const section = normalizeRoute(location.pathname)
  const title = document.querySelector('#route-title')
  const desc = document.querySelector('#route-desc')

  if (title && desc) {
    title.textContent = section === 'dashboard' ? 'Dashboard 子应用' : 'Order 子应用'
    desc.textContent =
      section === 'dashboard'
        ? '这个子应用演示主应用传参、定时器清理与回传全局状态。'
        : '这个子应用演示订单详情页面的接入方式与主动通知主应用。'
  }

  document.querySelectorAll('.nav-tab').forEach((button) => {
    const active = button.getAttribute('data-route') === `/${section}`
    button.classList.toggle('is-active', active)
  })

  // 【第 4 篇 §8】主应用侧写全局状态：setGlobalState 会把变更广播给所有订阅者（含子应用）。
  actions.setGlobalState({
    ...initialState,
    currentSection: section,
    lastAction:
      section === 'dashboard' ? '主应用切换到 dashboard' : '主应用切换到 order',
  })
}

renderShell()

// 【第 5 篇 §2.3】默认进入 /dashboard。
// 这里用 replaceState 而不是 pushState，避免在历史记录里多留一条根路径。
if (location.pathname === '/') {
  history.replaceState(null, '', '/dashboard')
}

// 【第 4 篇 §2 / §8】订阅全局状态。
// 第二个参数传 true 表示注册后立即用当前状态执行一次回调，首屏就能把 initialState 渲染出来；
// 之后子应用里的任意一次 setGlobalState，也会再次触发这个回调。
actions.onGlobalStateChange((state) => {
  renderGlobalState(state)
}, true)

// 【第 4 篇 §3.3】路由劫持第一步：注册子应用时声明激活规则。
// 【第 4 篇 §6】entry 指向子应用的 HTML 地址——这就是 qiankun 真正 fetch 并解析的 HTML Entry。
// 【第 5 篇 §三】主应用标准接入的五要素：name / entry / container / activeRule / props。
registerMicroApps([
  {
    name: 'subapp-dashboard',
    // 【第 4 篇 §6】HTML Entry：这里填的不是 JS 地址，而是子应用的入口 HTML。
    // 被请求并解析的那份 HTML 见 subapp-dashboard/public/index.html。
    entry: 'http://localhost:7101',
    // 【第 4 篇 §2】第 1 层：子应用挂载到主应用提供的这个容器里。
    container: '#micro-container',
    // 【第 4 篇 §3.3】函数型 activeRule：pathname 命中 /dashboard 前缀时激活该子应用。
    // 字符串 / 函数 / 数组三种形态的取舍见第 5 篇 §三。
    activeRule: (location) => location.pathname.startsWith('/dashboard'),
    // 【第 4 篇 §2】第 4 层「通信层」：props 是「主应用 → 子应用」的传参通道。
    // baseRoute 对应第 5 篇 §2.3 的「路由基座」，actions 用于子应用反向回写全局状态。
    props: {
      baseRoute: '/dashboard',
      actions,
      shellName: 'main-app',
    },
  },
  {
    name: 'subapp-order',
    entry: 'http://localhost:7102',
    container: '#micro-container',
    activeRule: (location) => location.pathname.startsWith('/order'),
    props: {
      baseRoute: '/order',
      actions,
      shellName: 'main-app',
    },
  },
])

// 【第 4 篇 §9】预加载机制。
// prefetch 默认值是 true（首个子应用 mount 后、浏览器空闲时预取其余子应用）；
// 这里显式配成 'all'，表示 start 之后立即预取全部子应用资源，让首次切换更快。
// 注意它是「体验 vs 带宽」的权衡，子应用很多时不宜盲目全量预取（第 4 篇 §9 结尾）。
start({
  prefetch: 'all',
})

// 【第 4 篇 §3.2 / §3.3】history 模式下浏览器前进/后退会触发 popstate。
// 主应用借此同步自己的导航高亮与全局状态；子应用的挂载切换由 qiankun 内部接管，无需手写。
window.addEventListener('popstate', syncRoute)
syncRoute()
