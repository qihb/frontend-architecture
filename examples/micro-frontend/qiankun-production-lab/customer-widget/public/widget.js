;(function () {
  function render(props = {}) {
    const root = props.container
      ? props.container.querySelector('#widget-root')
      : document.querySelector('#widget-root')

    if (!root) {
      return
    }

    root.innerHTML = `
      <section class="customer-widget">
        <article class="customer-widget-card">
          <span class="customer-widget-badge">loadMicroApp</span>
          <h2>客户画像 Widget</h2>
          <p>这个子应用不是整页应用，而是主应用右侧的一块局部功能区。</p>
          <dl>
            <dt>客户名称</dt>
            <dd>${props.customerName || '未传入'}</dd>
            <dt>健康分</dt>
            <dd>${props.score || 0}</dd>
            <dt>适用场景</dt>
            <dd>客户详情页、运营侧边栏、仪表盘插槽</dd>
          </dl>
        </article>
      </section>
    `
  }

  async function bootstrap() {
    console.log('[customer-widget] bootstrap')
  }

  async function mount(props) {
    console.log('[customer-widget] mount', props)
    render(props)
  }

  async function unmount(props) {
    console.log('[customer-widget] unmount', props)
    const root = props?.container
      ? props.container.querySelector('#widget-root')
      : document.querySelector('#widget-root')

    if (root) {
      root.innerHTML = ''
    }
  }

  window['customer-widget'] = {
    bootstrap,
    mount,
    unmount,
  }

  if (!window.__POWERED_BY_QIANKUN__) {
    bootstrap().then(() => mount({ customerName: 'Widget 独立模式', score: 72 }))
  }
})()
