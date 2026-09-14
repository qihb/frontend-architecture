/* ==========================================================================
 * risk-control-widget：风控信息局部 Widget
 * --------------------------------------------------------------------------
 * 与 customer-widget 成对出现，挂载在客户360页面右侧插槽位。
 * 两个 Widget 拿到的是同一份 buildWidgetProps 返回的上下文，
 * 保证客户信息 / 授信额度 / 风险信号的一致性。
 *
 * Props 契约（WidgetProps 的风控字段）：
 *   - creditSummary.amount / available / dueDays
 *   - riskSignals: string[]
 *
 * 挂载点：主应用 #risk-widget-slot（浅蓝色虚线边框标识）
 * ========================================================================== */
;(function () {
  /** 根节点查找：与 customer-widget 逻辑一致 */
  function getRoot(props) {
    return props.container
      ? props.container.querySelector('#risk-widget-root')
      : document.querySelector('#risk-widget-root')
  }

  /** 渲染风控卡：授信摘要 + 逾期天数 + 风险信号列表 */
  function render(props = {}) {
    const root = getRoot(props)

    if (!root) {
      return
    }

    if (!props.customerId) {
      root.innerHTML = '<div class="risk-loading">等待客户上下文...</div>'
      return
    }

    const signals = props.riskSignals || []
    const creditSummary = props.creditSummary || {}

    root.innerHTML = `
      <section class="risk-widget">
        <article class="risk-card">
          <span class="risk-badge">风控 Widget</span>
          <h2>${props.customerName}</h2>
          <dl>
            <dt>授信总额</dt>
            <dd>${creditSummary.amount || '--'}</dd>
            <dt>可用额度</dt>
            <dd>${creditSummary.available || '--'}</dd>
            <dt>逾期天数</dt>
            <dd>${creditSummary.dueDays || 0} 天</dd>
          </dl>
          <h3>风险信号</h3>
          <ul class="risk-list">
            ${signals.map((item) => `<li>${item}</li>`).join('') || '<li>暂无风险</li>'}
          </ul>
        </article>
      </section>
    `
  }

  /** qiankun 生命周期 1：首次加载 */
  async function bootstrap() {
    console.log('[risk-control-widget] bootstrap')
  }

  /** qiankun 生命周期 2：Customer360Page loadMicroApp 时触发 */
  async function mount(props) {
    console.log('[risk-control-widget] mount', props)
    render(props)
  }

  /** qiankun 生命周期 3：
   *  - 客户切换时 unmount
   *  - 离开 /customer-360 路由时父组件遍历 microAppRef 清理
   */
  async function unmount(props) {
    console.log('[risk-control-widget] unmount', props)
    const root = getRoot(props)

    if (root) {
      root.innerHTML = ''
    }
  }

  /* 三件套挂在 window['risk-control-widget']，名称必须与 loadMicroApp.name 一致 */
  window['risk-control-widget'] = {
    bootstrap,
    mount,
    unmount,
  }

  /* 独立运行模式：http://localhost:7205 直接访问 */
  if (!window.__POWERED_BY_QIANKUN__) {
    bootstrap().then(() =>
      mount({
        customerId: 'CUST-1001',
        customerName: '华东医械集团',
        creditSummary: {
          amount: 860000,
          available: 250000,
          dueDays: 6,
        },
        riskSignals: ['回款波动', '区域授信接近阈值'],
      }),
    )
  }
})()
