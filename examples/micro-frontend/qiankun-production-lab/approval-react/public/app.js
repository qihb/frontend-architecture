/* ==========================================================================
 * approval-react：审批中心子应用（模拟 React/Webpack 风格新系统）
 * --------------------------------------------------------------------------
 * 结构与 legacy-crm-vue2 一致，但业务语义为审批中心。
 * 展示「父应用按角色和业务上下文先取摘要，再挂载子应用」的模式：
 *   - 财务审批角色 → 进入审批中心时，父应用先取审批摘要
 *   - 子应用从 props.preloadData.stats 读取待办数 / 超时预警数等
 * ========================================================================== */
;(function () {
  /* Mock 审批单据列表：真实项目中需用 props.token 请求自己的审批详情接口 */
  const APPROVAL_ROWS = [
    {
      code: 'AP-2301',
      type: '合同审批',
      applicant: '销售一部',
      priority: '高',
      status: '待财务审核',
    },
    {
      code: 'AP-2302',
      type: '授信提额',
      applicant: '大客户部',
      priority: '中',
      status: '待风控复核',
    },
    {
      code: 'AP-2303',
      type: '退款审批',
      applicant: '华南渠道',
      priority: '低',
      status: '已提交',
    },
  ]

  /** 同 CRM：qiankun 接入时在 props.container 内查，独立运行时直接查 document */
  function getRoot(props) {
    return props.container
      ? props.container.querySelector('#approval-root')
      : document.querySelector('#approval-root')
  }

  /**
   * 渲染审批中心 UI
   * - 等待上下文 → 父应用 preloadData 未就绪时的兜底状态
   * - 有数据后 → 顶部上下文卡 + 三张指标卡 + 审批表格
   */
  function render(props = {}) {
    const root = getRoot(props)

    if (!root) {
      return
    }

    /* 首次 mount 可能 token 还没从父应用注入：等第二次 remount 就有值了 */
    if (!props.token) {
      root.innerHTML = '<div class="approval-loading">等待父应用上下文...</div>'
      return
    }

    /* 从父应用预取数据拿审批摘要（待办数 / 超时预警 / 本周已完成）
       独立运行时降级到默认 mock 数据 */
    const stats = props.preloadData && props.preloadData.stats
      ? props.preloadData.stats
      : [
          { title: '待处理审批', value: 18, desc: '合同、退款、授信审批待办' },
          { title: '超时预警', value: 4, desc: '超过 SLA 的审批流程' },
          { title: '本周已完成', value: 67, desc: '已完成审批单据' },
        ]

    root.innerHTML = `
      <section class="approval-page">
        <header class="approval-header">
          <div>
            <span class="approval-tag">React / Webpack 风格系统</span>
            <h1>审批中心</h1>
            <p>根据父应用传入的角色、租户和摘要数据决定默认模块与看板数据。</p>
          </div>
          <aside class="approval-context">
            <h2>父应用上下文</h2>
            <ul>
              <li>角色：${props.role || '-'}</li>
              <li>租户：${props.tenantId || '-'}</li>
              <li>组织：${props.orgId || '-'}</li>
            </ul>
          </aside>
        </header>

        <div class="approval-cards">
          ${stats
            .map(
              (card) => `
                <article>
                  <strong>${card.value}</strong>
                  <span>${card.title}</span>
                  <p>${card.desc}</p>
                </article>
              `,
            )
            .join('')}
        </div>

        <section class="approval-table-wrap">
          <h2>审批看板</h2>
          <table class="approval-table">
            <thead>
              <tr>
                <th>单号</th>
                <th>类型</th>
                <th>申请部门</th>
                <th>优先级</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              ${APPROVAL_ROWS.map(
                (row) => `
                  <tr>
                    <td>${row.code}</td>
                    <td>${row.type}</td>
                    <td>${row.applicant}</td>
                    <td>${row.priority}</td>
                    <td>${row.status}</td>
                  </tr>
                `,
              ).join('')}
            </tbody>
          </table>
        </section>
      </section>
    `
  }

  /** qiankun 生命周期 1：首次加载一次性初始化 */
  async function bootstrap() {
    console.log('[approval-react] bootstrap')
  }

  /** qiankun 生命周期 2：路由命中时渲染内容 */
  async function mount(props) {
    console.log('[approval-react] mount', props)
    render(props)
  }

  /** qiankun 生命周期 3：路由离开时清空 DOM
   *  React 项目真实场景下还需要 ReactDOM.unmountComponentAtNode(root) */
  async function unmount(props) {
    console.log('[approval-react] unmount', props)
    const root = getRoot(props)

    if (root) {
      root.innerHTML = ''
    }
  }

  /* 暴露三件套到 window['子应用名']，必须与 microApps.js 配置名一致 */
  window['approval-react'] = {
    bootstrap,
    mount,
    unmount,
  }

  /* 独立运行模式：http://localhost:7202 直接访问 */
  if (!window.__POWERED_BY_QIANKUN__) {
    bootstrap().then(() =>
      mount({
        token: 'standalone-approval-token',
        role: 'finance_auditor',
        tenantId: 'tenant-east',
        orgId: 'org-east-01',
        preloadData: {
          stats: [
            { title: '待处理审批', value: 18, desc: '合同、退款、授信审批待办' },
            { title: '超时预警', value: 4, desc: '超过 SLA 的审批流程' },
            { title: '本周已完成', value: 67, desc: '已完成审批单据' },
          ],
        },
      }),
    )
  }
})()
