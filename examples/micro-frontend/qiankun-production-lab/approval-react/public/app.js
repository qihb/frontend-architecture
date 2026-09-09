;(function () {
  function render(props = {}) {
    const root = props.container
      ? props.container.querySelector('#approval-root')
      : document.querySelector('#approval-root')

    if (!root) {
      return
    }

    root.innerHTML = `
      <section class="approval-app">
        <div class="approval-shell">
          <article class="approval-card">
            <span class="approval-tag">React / Webpack 风格系统</span>
            <h1>审批中心</h1>
            <p>这个子应用模拟另一支团队维护的流程系统，被主应用按路由加载。</p>
            <table class="approval-table">
              <thead>
                <tr>
                  <th>工单</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#WF-12001</td>
                  <td>待审批</td>
                </tr>
                <tr>
                  <td>#WF-12002</td>
                  <td>审批中</td>
                </tr>
              </tbody>
            </table>
          </article>

          <aside class="approval-card">
            <h2>接入说明</h2>
            <ul>
              <li>场景标识：${props.scenario || 'unknown'}</li>
              <li>负责团队：${props.owner || '未知团队'}</li>
              <li>这类系统通常最先要确认的是路由与资源地址</li>
            </ul>
          </aside>
        </div>
      </section>
    `
  }

  async function bootstrap() {
    console.log('[approval-react] bootstrap')
  }

  async function mount(props) {
    console.log('[approval-react] mount', props)
    render(props)
  }

  async function unmount(props) {
    console.log('[approval-react] unmount', props)
    const root = props?.container
      ? props.container.querySelector('#approval-root')
      : document.querySelector('#approval-root')

    if (root) {
      root.innerHTML = ''
    }
  }

  window['approval-react'] = {
    bootstrap,
    mount,
    unmount,
  }

  if (!window.__POWERED_BY_QIANKUN__) {
    bootstrap().then(() => mount({ owner: '审批中心独立模式' }))
  }
})()
