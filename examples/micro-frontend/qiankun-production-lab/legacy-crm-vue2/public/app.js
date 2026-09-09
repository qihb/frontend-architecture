;(function () {
  function render(props = {}) {
    const root = props.container
      ? props.container.querySelector('#legacy-crm-root')
      : document.querySelector('#legacy-crm-root')

    if (!root) {
      return
    }

    root.innerHTML = `
      <section class="legacy-crm">
        <div class="legacy-crm-header">
          <article class="legacy-crm-board">
            <span class="legacy-crm-tag">Vue2 / Webpack 风格旧系统</span>
            <h1>CRM 老系统</h1>
            <p>这里模拟一个多年维护的客户管理系统。重点不是技术多新，而是如何被主应用平滑接入。</p>
            <ul class="legacy-crm-list">
              <li>负责人：${props.owner || '未知团队'}</li>
              <li>接入模式：主应用整页编排</li>
              <li>改造策略：优先导出生命周期，后续再做样式与依赖治理</li>
            </ul>
          </article>
          <aside class="legacy-crm-card">
            <h2>存量项目常见问题</h2>
            <ul class="legacy-crm-list">
              <li>历史样式覆盖主应用</li>
              <li>路由 base 不统一</li>
              <li>全局事件未在卸载时清理</li>
            </ul>
          </aside>
        </div>
      </section>
    `
  }

  async function bootstrap() {
    console.log('[legacy-crm-vue2] bootstrap')
  }

  async function mount(props) {
    console.log('[legacy-crm-vue2] mount', props)
    render(props)
  }

  async function unmount(props) {
    console.log('[legacy-crm-vue2] unmount', props)
    const root = props?.container
      ? props.container.querySelector('#legacy-crm-root')
      : document.querySelector('#legacy-crm-root')

    if (root) {
      root.innerHTML = ''
    }
  }

  window['legacy-crm-vue2'] = {
    bootstrap,
    mount,
    unmount,
  }

  if (!window.__POWERED_BY_QIANKUN__) {
    bootstrap().then(() => mount({ owner: 'CRM 独立模式' }))
  }
})()
