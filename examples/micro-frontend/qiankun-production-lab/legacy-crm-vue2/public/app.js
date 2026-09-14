/* ==========================================================================
 * legacy-crm-vue2：客户中心子应用（模拟 Vue2/Webpack 存量系统）
 * --------------------------------------------------------------------------
 * 【qiankun 子应用三件套】所有子应用都必须暴露三个异步生命周期函数：
 *   bootstrap(props) → 首次加载时执行一次（做一次性初始化）
 *   mount(props)     → 路由命中时执行（把自己渲染到 props.container 内）
 *   unmount(props)   → 路由离开时执行（清空 DOM + 销毁实例）
 *
 * 这三个函数要挂到 window['应用名'] 上，qiankun fetch HTML 后解析执行拿到
 *
 * 独立运行 vs 被 qiankun 接入：
 *   window.__POWERED_BY_QIANKUN__ === true 时，不自己执行 mount，
 *   只暴露生命周期对象，等待 qiankun 调用
 * ========================================================================== */
;(function () {
  /* Mock 客户列表数据：真实项目中是子应用拿到 token 后再请求客户列表接口 */
  const CUSTOMER_ROWS = [
    {
      id: 'CUST-1001',
      name: '华东医械集团',
      owner: '李晨',
      level: 'A',
      status: '跟进中',
      lastFollowUp: '今天 10:30',
    },
    {
      id: 'CUST-1002',
      name: '北区零售联盟',
      owner: '周宁',
      level: 'B',
      status: '待续约',
      lastFollowUp: '昨天 17:12',
    },
    {
      id: 'CUST-1003',
      name: '华南制造客户',
      owner: '王珊',
      level: 'A',
      status: '已签约',
      lastFollowUp: '周二 14:06',
    },
  ]

  /**
   * 获取根挂载节点
   * - 被 qiankun 接入时：props.container 是 #micro-app-stage 的 DOM 引用，
   *   需要在其内部查找 #legacy-crm-root（index.html 里声明的）
   * - 独立运行时：直接在 document 查找
   */
  function getRoot(props) {
    return props.container
      ? props.container.querySelector('#legacy-crm-root')
      : document.querySelector('#legacy-crm-root')
  }

  /**
   * 从父应用注入的 preloadData 里取统计数据
   * 取不到就降级到默认值，保证独立运行也能渲染
   */
  function getStats(props) {
    return props.preloadData && props.preloadData.stats
      ? props.preloadData.stats
      : {
          monthlyNew: 128,
          focused: 42,
          renewal: 9,
        }
  }

  /**
   * 渲染业务内容
   * - 没有拿到 token / userInfo 时渲染「等待父应用上下文」
   *   （父应用 prepareRouteData 异步完成后会再 remount 一次，这时就有值了）
   * - 有上下文后渲染完整 CRM：顶部 Header + 指标卡 + 客户列表 + 详情摘要
   */
  function render(props = {}) {
    const root = getRoot(props)

    if (!root) {
      return
    }

    /* 首次 mount 可能主应用还没把 preloadData 准备好，显示等待状态
       第二次 remount 触发时 buildSharedProps 已经能取到缓存数据 */
    if (!props.token || !props.userInfo) {
      root.innerHTML = '<div class="crm-loading">等待父应用上下文...</div>'
      return
    }

    const stats = getStats(props)
    const detail = CUSTOMER_ROWS[0]

    root.innerHTML = `
      <section class="crm-app">
        <header class="crm-header">
          <div>
            <span class="crm-tag">Vue2 / Webpack 存量系统</span>
            <h1>客户中心</h1>
            <p>主应用已注入 token、角色、租户、组织与客户域摘要数据。</p>
          </div>
          <aside class="crm-context">
            <h2>父应用上下文</h2>
            <ul>
              <li>角色：${props.role || '-'}</li>
              <li>租户：${props.tenantId || '-'}</li>
              <li>组织：${props.orgId || '-'}</li>
            </ul>
          </aside>
        </header>

        <div class="crm-metrics">
          <article><strong>${stats.monthlyNew}</strong><span>本月新增客户</span></article>
          <article><strong>${stats.focused}</strong><span>重点跟进客户</span></article>
          <article><strong>${stats.renewal}</strong><span>待续约客户</span></article>
        </div>

        <div class="crm-body">
          <section class="crm-table-wrap">
            <h2>客户列表</h2>
            <table class="crm-table">
              <thead>
                <tr>
                  <th>客户ID</th>
                  <th>客户名称</th>
                  <th>负责人</th>
                  <th>等级</th>
                  <th>状态</th>
                  <th>最近跟进</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                ${CUSTOMER_ROWS.map(
                  (row) => `
                    <tr>
                      <td>${row.id}</td>
                      <td>${row.name}</td>
                      <td>${row.owner}</td>
                      <td><span class="crm-level level-${row.level.toLowerCase()}">${row.level}</span></td>
                      <td>${row.status}</td>
                      <td>${row.lastFollowUp}</td>
                      <td>
                        <button class="crm-action" data-customer-id="${row.id}">
                          查看客户360
                        </button>
                      </td>
                    </tr>
                  `,
                ).join('')}
              </tbody>
            </table>
          </section>

          <aside class="crm-detail">
            <h2>重点客户摘要</h2>
            <dl>
              <dt>客户名称</dt>
              <dd>${detail.name}</dd>
              <dt>客户等级</dt>
              <dd>${detail.level}</dd>
              <dt>负责人</dt>
              <dd>${detail.owner}</dd>
              <dt>下一步建议</dt>
              <dd>完成季度续约评估，并推进高潜产品打包销售。</dd>
            </dl>
          </aside>
        </div>
      </section>
    `

    /* 「查看客户360」按钮点击事件绑定：
       子应用自己不做路由跳转，而是调用父应用通过 props 注入的回调函数，
       由父应用统一管理路由和 selectedCustomerId 状态
       （保证子应用无路由依赖，解耦） */
    root.querySelectorAll('[data-customer-id]').forEach((button) => {
      button.addEventListener('click', () => {
        const customerId = button.getAttribute('data-customer-id')
        if (customerId) {
          props.onCustomerSelect && props.onCustomerSelect(customerId)
        }
      })
    })
  }

  /** qiankun 生命周期 1：首次加载时调用，一次性初始化（埋点、CDN 前缀等） */
  async function bootstrap() {
    console.log('[legacy-crm-vue2] bootstrap')
  }

  /** qiankun 生命周期 2：每次路由命中时调用，把自己渲染到 props.container 内 */
  async function mount(props) {
    console.log('[legacy-crm-vue2] mount', props)
    render(props)
  }

  /** qiankun 生命周期 3：路由离开时调用，清空 DOM（Vue2 项目还要解绑事件、销毁 watcher） */
  async function unmount(props) {
    console.log('[legacy-crm-vue2] unmount', props)
    const root = getRoot(props)
    if (root) {
      root.innerHTML = ''
    }
  }

  /* 把三个生命周期函数挂到 window['子应用名'] 上，名称必须和 microApps.js 配置一致 */
  window['legacy-crm-vue2'] = {
    bootstrap,
    mount,
    unmount,
  }

  /* 独立运行模式：直接敲 localhost:7201 时走这里，提供 mock props 让页面能自己渲染
     方便子应用脱离主应用单独调试 UI */
  if (!window.__POWERED_BY_QIANKUN__) {
    bootstrap().then(() =>
      mount({
        token: 'standalone-crm-token',
        role: 'sales_manager',
        tenantId: 'tenant-east',
        orgId: 'org-east-01',
        userInfo: {
          id: 'u_001',
          name: '李晨',
        },
        preloadData: {
          stats: {
            monthlyNew: 128,
            focused: 42,
            renewal: 9,
          },
        },
        onCustomerSelect: function (customerId) {
          window.alert(`跳转客户360：${customerId}`)
        },
      }),
    )
  }
})()
