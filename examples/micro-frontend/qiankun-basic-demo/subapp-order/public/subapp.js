/**
 * [subapp-order] 子应用入口（经典 script，非构建产物）
 *
 * 对应专栏：
 *   · 《第 5 篇：qiankun 深度解析（下）》§二 子应用改造三步走：导出生命周期 / 暴露全局变量 / 处理路由基座
 *   · 《第 4 篇：qiankun 深度解析（上）》§7 生命周期、§2 通信层、§3.3 注册时传参
 *
 * 与 dashboard 子应用的区别（可对照阅读）：
 *   · 这里是一个「纯业务页」——没有定时器，unmount 只需清空 DOM，
 *     用来说明「副作用有多少，卸载就要清多少」，不是每个子应用都必须清理定时器。
 *   · 重点是演示 props 传参（shellName / baseRoute / actions）与子应用主动通知主应用。
 */
;(function () {
  // 【第 5 篇 §2.1】缓存 mount 收到的 props，供独立运行分支兜底使用。
  let currentProps = {}

  function render(props = {}) {
    currentProps = props

    // 【第 5 篇 §2.1 / 第 4 篇 §6】
    // 被 qiankun 接管时挂在 props.container 里；独立访问时退化为查自己的根节点。
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

    // 【第 4 篇 §2 第 4 层「通信层」/ §8】子应用侧的写入口同 dashboard 一致：
    // 复用主应用透传下来的 props.actions，把业务结果广播回主应用顶部卡片。
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

  // 【第 4 篇 §7】bootstrap：首次初始化时调用，通常只执行一次。
  async function bootstrap() {
    console.log('[subapp-order] bootstrap')
  }

  // 【第 4 篇 §7】mount：每次进入该子应用时调用，会反复执行。
  async function mount(props) {
    console.log('[subapp-order] mount', props)
    render(props)
  }

  // 【第 4 篇 §7】unmount：离开时调用。这里没有定时器/事件监听需要清理，
  // 因此只需清空 DOM——副作用与清理动作是一一对应的（对照 dashboard 的 clearInterval）。
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

  // 【第 5 篇 §2.2】把生命周期暴露成全局对象，qiankun 依据它来取生命周期函数。
  // 等价于 webpack 配置 `library: 'subapp-order'` + `libraryTarget: 'umd'`。
  window['subapp-order'] = {
    bootstrap,
    mount,
    unmount,
  }

  // 【第 5 篇 §2.1 / §5.5】独立运行分支：非 qiankun 环境（直接访问 7102）时自启动。
  if (!window.__POWERED_BY_QIANKUN__) {
    bootstrap().then(() => mount(currentProps))
  }
})()
