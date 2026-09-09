import './style.css'
import { loadMicroApp, registerMicroApps, start } from 'qiankun'

const app = document.querySelector('#app')
let widgetMicroApp = null

function renderShell() {
  app.innerHTML = `
    <div class="portal-shell">
      <header class="portal-header">
        <div>
          <p class="portal-tag">番外篇配套案例</p>
          <h1>企业级混合微前端改造实验室</h1>
          <p class="portal-desc">
            这个案例同时模拟老旧 Webpack 子应用、局部嵌入、多应用同屏，以及 Vue3/Vite 新项目的接入决策。
          </p>
        </div>
        <div class="portal-panel">
          <h2>实验目标</h2>
          <ul>
            <li>CRM：模拟存量 Vue2/Webpack 项目</li>
            <li>Approval：模拟 React/Webpack 审批中心</li>
            <li>Widget：通过 <code>loadMicroApp</code> 局部嵌入</li>
            <li>Analytics：独立运行，展示 Vite 子应用的适配分流</li>
          </ul>
        </div>
      </header>

      <section class="portal-callout">
        <strong>路由驱动：</strong>左侧主区域使用 <code>registerMicroApps</code> 控制整页子应用；
        右侧客户画像卡片使用 <code>loadMicroApp</code> 做局部嵌入。
      </section>

      <main class="portal-layout">
        <section class="portal-main">
          <div class="portal-tabs">
            <button class="portal-tab" data-route="/crm">CRM 老系统</button>
            <button class="portal-tab" data-route="/approval">审批中心</button>
          </div>
          <div class="portal-stage">
            <div class="stage-head">
              <div>
                <h2 id="stage-title"></h2>
                <p id="stage-desc"></p>
              </div>
              <a
                id="analytics-link"
                class="analytics-link"
                href="http://localhost:7204"
                target="_blank"
                rel="noreferrer"
              >
                打开 analytics-vue3 独立项目
              </a>
            </div>
            <div id="micro-stage" class="micro-stage"></div>
          </div>
        </section>

        <aside class="portal-side">
          <div class="widget-panel">
            <h2>客户画像 Widget</h2>
            <p>这里不是整页接管，而是把子应用嵌进主应用右侧栏。</p>
            <div id="widget-slot" class="widget-slot"></div>
          </div>

          <div class="decision-panel">
            <h2>生产判断</h2>
            <ul>
              <li>老项目优先先接进来，不要求立刻重构技术栈</li>
              <li>局部功能用 <code>loadMicroApp</code> 比整页切换更自然</li>
              <li>新建 Vue3/Vite 项目先独立演示，再决定是社区插件还是等待 qiankun 3</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  `

  app.querySelectorAll('[data-route]').forEach((button) => {
    button.addEventListener('click', () => {
      const route = button.getAttribute('data-route')
      if (route && location.pathname !== route) {
        history.pushState(null, '', route)
        syncStage()
      }
    })
  })
}

function mountWidget() {
  if (widgetMicroApp) {
    return
  }

  widgetMicroApp = loadMicroApp({
    name: 'customer-widget',
    entry: 'http://localhost:7203',
    container: '#widget-slot',
    props: {
      customerName: '华东大区 KA 客户',
      score: 86,
    },
  })
}

function syncStage() {
  const isApproval = location.pathname.startsWith('/approval')
  const title = document.querySelector('#stage-title')
  const desc = document.querySelector('#stage-desc')

  title.textContent = isApproval ? '审批中心（React / Webpack）' : 'CRM 老系统（Vue2 / Webpack）'
  desc.textContent = isApproval
    ? '演示第二个存量系统如何被主应用整页编排。'
    : '演示最典型的存量系统接入：旧技术栈先跑起来，再慢慢治理。'

  document.querySelectorAll('.portal-tab').forEach((button) => {
    const route = button.getAttribute('data-route')
    button.classList.toggle('is-active', route === (isApproval ? '/approval' : '/crm'))
  })
}

renderShell()

if (location.pathname === '/') {
  history.replaceState(null, '', '/crm')
}

registerMicroApps([
  {
    name: 'legacy-crm-vue2',
    entry: 'http://localhost:7201',
    container: '#micro-stage',
    activeRule: (location) => location.pathname.startsWith('/crm'),
    props: {
      scenario: 'legacy-crm',
      owner: '华东销售团队',
    },
  },
  {
    name: 'approval-react',
    entry: 'http://localhost:7202',
    container: '#micro-stage',
    activeRule: (location) => location.pathname.startsWith('/approval'),
    props: {
      scenario: 'approval-center',
      owner: '流程治理团队',
    },
  },
])

start({
  prefetch: 'all',
})

mountWidget()
window.addEventListener('popstate', syncStage)
syncStage()
