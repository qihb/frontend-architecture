/* ==========================================================================
 * customer-widget：客户画像局部 Widget
 * --------------------------------------------------------------------------
 * 与 registerMicroApps（路由驱动、整页）不同，局部 Widget 使用 loadMicroApp
 * 命令式加载：由父应用 Customer360Page 控制何时创建 / 何时 unmount。
 *
 * Props 契约：WidgetProps（见 README 第六章）
 *   - customerId / customerName（基础身份）
 *   - profile.level / profile.score / profile.tags（画像）
 *
 * 挂载点：主应用 #insight-widget-slot（绿色虚线边框标识）
 * ========================================================================== */
;(function () {
  /**
   * 根节点查找：
   * 被 loadMicroApp 加载时 props.container 就是 #insight-widget-slot 本身，
   * 里面还会有一层 qiankun 包的 shadow/div，所以再查自己的 #widget-root
   */
  function getRoot(props) {
    return props.container
      ? props.container.querySelector('#widget-root')
      : document.querySelector('#widget-root')
  }

  /** 渲染客户画像卡片：基础信息 + 等级评分标签 + 建议动作 */
  function render(props = {}) {
    const root = getRoot(props)

    if (!root) {
      return
    }

    /* 父应用 buildWidgetProps 还没返回数据 → 显示等待态 */
    if (!props.customerId) {
      root.innerHTML = '<div class="widget-loading">等待客户上下文...</div>'
      return
    }

    const tags = props.profile && props.profile.tags ? props.profile.tags : []

    root.innerHTML = `
      <section class="customer-widget">
        <article class="customer-widget-card">
          <span class="customer-widget-badge">loadMicroApp</span>
          <h2>${props.customerName}</h2>
          <p>客户评分：${props.profile && props.profile.score ? props.profile.score : '--'}</p>
          <dl>
            <dt>客户编号</dt>
            <dd>${props.customerId}</dd>
            <dt>客户等级</dt>
            <dd>${props.profile && props.profile.level ? props.profile.level : '-'}</dd>
            <dt>客户标签</dt>
            <dd>${tags.join(' / ') || '暂无标签'}</dd>
            <dt>建议动作</dt>
            <dd>优先跟进高潜渠道客户，推进重点产品组合销售。</dd>
          </dl>
        </article>
      </section>
    `
  }

  /** qiankun 生命周期 1：首次加载一次性初始化 */
  async function bootstrap() {
    console.log('[customer-widget] bootstrap')
  }

  /** qiankun 生命周期 2：Customer360Page loadMicroApp 时触发 */
  async function mount(props) {
    console.log('[customer-widget] mount', props)
    render(props)
  }

  /** qiankun 生命周期 3：
   *  - Customer360Page 切换客户时先 unmount 再 mount
   *  - 切走 /customer-360 路由时父组件遍历 microAppRef unmount
   */
  async function unmount(props) {
    console.log('[customer-widget] unmount', props)
    const root = getRoot(props)

    if (root) {
      root.innerHTML = ''
    }
  }

  /* 三件套挂在 window['customer-widget']，必须与 Customer360Page loadMicroApp.name 一致 */
  window['customer-widget'] = {
    bootstrap,
    mount,
    unmount,
  }

  /* 独立运行模式：http://localhost:7203 直接调试 Widget UI */
  if (!window.__POWERED_BY_QIANKUN__) {
    bootstrap().then(() =>
      mount({
        customerId: 'CUST-1001',
        customerName: '华东医械集团',
        profile: {
          level: 'A',
          score: 92,
          tags: ['高潜', '集团客户', '回款稳定'],
        },
      }),
    )
  }
})()
