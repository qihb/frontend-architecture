import './style.css'
import { initGlobalState, registerMicroApps, start } from 'qiankun'

const app = document.querySelector('#app')
const initialState = {
  userName: 'Alice',
  team: '运营中台',
  currentSection: 'dashboard',
  lastAction: '等待子应用回传动作',
}

const actions = initGlobalState(initialState)

function normalizeRoute(pathname) {
  if (pathname.startsWith('/order')) {
    return 'order'
  }

  return 'dashboard'
}

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

  actions.setGlobalState({
    ...initialState,
    currentSection: section,
    lastAction:
      section === 'dashboard' ? '主应用切换到 dashboard' : '主应用切换到 order',
  })
}

renderShell()

if (location.pathname === '/') {
  history.replaceState(null, '', '/dashboard')
}

actions.onGlobalStateChange((state) => {
  renderGlobalState(state)
}, true)

registerMicroApps([
  {
    name: 'subapp-dashboard',
    entry: 'http://localhost:7101',
    container: '#micro-container',
    activeRule: (location) => location.pathname.startsWith('/dashboard'),
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

start({
  prefetch: 'all',
})

window.addEventListener('popstate', syncRoute)
syncRoute()
