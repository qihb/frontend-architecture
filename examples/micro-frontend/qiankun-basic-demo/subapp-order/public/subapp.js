;(function () {
  let currentProps = {}

  function render(props = {}) {
    currentProps = props

    const root = props.container
      ? props.container.querySelector('#order-root')
      : document.querySelector('#order-root')

    if (!root) {
      return
    }

    root.innerHTML = `
      <section class="order-app">
        <div class="order-shell">
          <article class="order-main">
            <span class="order-tag">order</span>
            <h1>订单中心</h1>
            <p>这个子应用模拟一个典型业务页，点击按钮会把订单处理结果同步给主应用。</p>

            <ul class="order-list">
              <li>
                <div class="order-item">
                  <div>
                    <span>订单编号</span>
                    <strong>#A20260909001</strong>
                  </div>
                  <div>待审核</div>
                </div>
              </li>
              <li>
                <div class="order-item">
                  <div>
                    <span>订单编号</span>
                    <strong>#A20260909002</strong>
                  </div>
                  <div>处理中</div>
                </div>
              </li>
            </ul>

            <div class="order-actions">
              <button id="order-approve" class="order-button">通知主应用：订单审核通过</button>
              <button id="order-escalate" class="order-button secondary">通知主应用：需要人工介入</button>
            </div>
          </article>

          <aside class="order-side">
            <h2>接入信息</h2>
            <p><strong>shell：</strong>${props.shellName || 'standalone'}</p>
            <p><strong>baseRoute：</strong>${props.baseRoute || '/'}</p>
            <p><strong>通信方式：</strong>props.actions.setGlobalState</p>
          </aside>
        </div>
      </section>
    `

    root.querySelector('#order-approve')?.addEventListener('click', () => {
      props.actions?.setGlobalState({
        currentSection: 'order',
        userName: 'Alice',
        team: '运营中台',
        lastAction: 'order 子应用将 #A20260909001 标记为审核通过',
      })
    })

    root.querySelector('#order-escalate')?.addEventListener('click', () => {
      props.actions?.setGlobalState({
        currentSection: 'order',
        userName: 'Alice',
        team: '运营中台',
        lastAction: 'order 子应用将 #A20260909002 升级为人工处理',
      })
    })
  }

  async function bootstrap() {
    console.log('[subapp-order] bootstrap')
  }

  async function mount(props) {
    console.log('[subapp-order] mount', props)
    render(props)
  }

  async function unmount(props) {
    console.log('[subapp-order] unmount', props)

    const root = props?.container
      ? props.container.querySelector('#order-root')
      : document.querySelector('#order-root')

    if (root) {
      root.innerHTML = ''
    }

    currentProps = {}
  }

  window['subapp-order'] = {
    bootstrap,
    mount,
    unmount,
  }

  if (!window.__POWERED_BY_QIANKUN__) {
    bootstrap().then(() => mount(currentProps))
  }
})()
