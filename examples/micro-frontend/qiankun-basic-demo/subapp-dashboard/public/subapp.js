/**
 * [subapp-dashboard] 子应用入口（经典 script，非构建产物）
 *
 * 对应专栏：
 *   · 《第 5 篇：qiankun 深度解析（下）》§二 子应用改造三步走：导出生命周期 / 暴露全局变量 / 处理路由基座
 *   · 《第 4 篇：qiankun 深度解析（上）》§7 生命周期、§6 HTML Entry、§5.4 副作用清理
 *
 * 阅读顺序：
 *   1. 文件底部：把生命周期挂到 window 全局  → 【第 5 篇 §2.2】
 *   2. 三个生命周期 bootstrap / mount / unmount → 【第 4 篇 §7】
 *   3. render 里读 props、回写全局状态        → 【第 4 篇 §2 / §8】
 *   4. unmount 里清理定时器                   → 【第 4 篇 §7、第 5 篇 §5.4】
 */
;(function () {
  // 【第 4 篇 §7】这个定时器是 mount 期间创建的副作用，必须在 unmount 里对称清掉，
  // 否则反复切换子应用后会越积越多。它也是第 5 篇 §4.2 验证点 4 的演示对象。
  let heartbeatTimer = null

  // 【第 5 篇 §2.1】缓存每次 mount 收到的 props：
  // 当子应用脱离 qiankun 独立运行（见文件底部 __POWERED_BY_QIANKUN__ 分支）时，用它兜底。
  let currentProps = {}

  function render(props = {}) {
    currentProps = props

    // 【第 5 篇 §2.1 / 第 4 篇 §6】
    // 微前端环境下用 props.container（qiankun 传入的挂载容器，即主应用的 #micro-container 内部）；
    // 独立运行时退化为查自己页面里的根节点。这就是「既能独立运行、也能被挂载运行」的写法。
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

    // 【第 4 篇 §2 第 4 层「通信层」/ §8】子应用侧的写入口：
    // props.actions 是主应用 initGlobalState 后透传下来的通信对象，
    // 调用 setGlobalState 会广播给所有订阅者，主应用顶部卡片因此实时变化（第 5 篇 §4.2 验证点 3）。
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

    // 【第 4 篇 §7 / 第 5 篇 §5.4】在这里创建定时器，就必须在 unmount 里负责回收——
    // 「框架负责隔离（JS 沙箱），业务负责清理」。它是本 demo 演示生命周期释放的关键伏笔。
    heartbeatTimer = window.setInterval(() => {
      const heartbeat = root.querySelector('#dashboard-heartbeat')
      if (heartbeat) {
        heartbeat.textContent = new Date().toLocaleTimeString()
      }
    }, 1000)
  }

  // 【第 4 篇 §7】bootstrap：应用首次初始化时调用，通常只执行一次。
  // 适合放一次性的初始化逻辑，不建议在这里操作 DOM。
  async function bootstrap() {
    console.log('[subapp-dashboard] bootstrap')
  }

  // 【第 4 篇 §7】mount：每次进入该子应用时调用，会反复执行。
  // 渲染页面、绑定事件、启动定时器都放在这里；对应地，副作用要在 unmount 里反向释放。
  async function mount(props) {
    console.log('[subapp-dashboard] mount', props)
    render(props)
  }

  // 【第 4 篇 §7】unmount：离开该子应用时调用，负责把 mount 期间留下的现场清干净。
  // 第 5 篇 §5.4「生命周期未清理」讲的就是漏掉这一环的后果：页面越来越卡、事件重复触发。
  async function unmount(props) {
    console.log('[subapp-dashboard] unmount', props)

    // 清理定时器：第 5 篇 §4.2 验证点 4——切走再切回，心跳会重新开始。
    window.clearInterval(heartbeatTimer)
    heartbeatTimer = null

    // 清空 DOM：卸载挂载期间渲染出来的内容。
    const root = props?.container
      ? props.container.querySelector('#dashboard-root')
      : document.querySelector('#dashboard-root')

    if (root) {
      root.innerHTML = ''
    }

    currentProps = {}
  }

  // 【第 5 篇 §2.2】子应用改造的关键一步：把生命周期暴露成全局对象。
  // qiankun 拿到入口脚本执行后的全局变量来取生命周期；这正是 webpack `library: 'subapp-dashboard'`
  // + `libraryTarget: 'umd'` 的手写等价形态（第 5 篇 §2.2 给了 webpack 版本）。
  window['subapp-dashboard'] = {
    bootstrap,
    mount,
    unmount,
  }

  // 【第 5 篇 §2.1 / §5.5】独立运行分支：
  // 没有 __POWERED_BY_QIANKUN__ 说明当前是直接访问子应用（如 http://localhost:7101），
  // 此时自己启动一遍；被 qiankun 接管时则什么都不做，等主应用按时机调用生命周期。
  if (!window.__POWERED_BY_QIANKUN__) {
    bootstrap().then(() => mount(currentProps))
  }
})()
