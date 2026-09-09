;(function () {
  let heartbeatTimer = null
  let currentProps = {}

  function render(props = {}) {
    currentProps = props

    const root = props.container
      ? props.container.querySelector('#dashboard-root')
      : document.querySelector('#dashboard-root')

    if (!root) {
      return
    }

    root.innerHTML = `
      <section class="dashboard-app">
        <div class="dashboard-hero">
          <div>
            <span class="dashboard-badge">dashboard</span>
            <h1>经营驾驶舱</h1>
            <p>主应用通过 props 把 shell 名称和全局状态动作对象传到了子应用。</p>
          </div>
          <div class="dashboard-card">
            <p><strong>shell：</strong>${props.shellName || 'standalone'}</p>
            <p><strong>baseRoute：</strong>${props.baseRoute || '/'}</p>
            <p><strong>心跳：</strong><span id="dashboard-heartbeat">等待中</span></p>
          </div>
        </div>

        <div class="dashboard-grid">
          <article class="dashboard-kpi">
            <span>今日交易额</span>
            <strong>¥ 1,245,300</strong>
          </article>
          <article class="dashboard-kpi">
            <span>订单转化率</span>
            <strong>18.2%</strong>
          </article>
          <article class="dashboard-kpi">
            <span>告警数量</span>
            <strong>3</strong>
          </article>
        </div>

        <div class="dashboard-card">
          <h2>通信演示</h2>
          <p>点击下面的按钮，把 dashboard 的动作同步回主应用。</p>
          <div class="dashboard-actions">
            <button id="dashboard-sync" class="dashboard-button">通知主应用：刷新成功</button>
            <button id="dashboard-filter" class="dashboard-button secondary">通知主应用：切换筛选条件</button>
          </div>
          <p class="dashboard-note">切换到 order 路由后，当前子应用的定时器会在 <code>unmount</code> 中清理。</p>
        </div>
      </section>
    `

    root.querySelector('#dashboard-sync')?.addEventListener('click', () => {
      props.actions?.setGlobalState({
        currentSection: 'dashboard',
        userName: 'Alice',
        team: '运营中台',
        lastAction: 'dashboard 子应用完成了一次手动刷新',
      })
    })

    root.querySelector('#dashboard-filter')?.addEventListener('click', () => {
      props.actions?.setGlobalState({
        currentSection: 'dashboard',
        userName: 'Alice',
        team: '运营中台',
        lastAction: 'dashboard 子应用把筛选条件切换为最近 7 天',
      })
    })

    heartbeatTimer = window.setInterval(() => {
      const heartbeat = root.querySelector('#dashboard-heartbeat')
      if (heartbeat) {
        heartbeat.textContent = new Date().toLocaleTimeString()
      }
    }, 1000)
  }

  async function bootstrap() {
    console.log('[subapp-dashboard] bootstrap')
  }

  async function mount(props) {
    console.log('[subapp-dashboard] mount', props)
    render(props)
  }

  async function unmount(props) {
    console.log('[subapp-dashboard] unmount', props)
    window.clearInterval(heartbeatTimer)
    heartbeatTimer = null

    const root = props?.container
      ? props.container.querySelector('#dashboard-root')
      : document.querySelector('#dashboard-root')

    if (root) {
      root.innerHTML = ''
    }

    currentProps = {}
  }

  window['subapp-dashboard'] = {
    bootstrap,
    mount,
    unmount,
  }

  if (!window.__POWERED_BY_QIANKUN__) {
    bootstrap().then(() => mount(currentProps))
  }
})()
