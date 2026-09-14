/* ==========================================================================
 * analytics-vue3：运营分析子应用（Vue3 + Vite 现代 ESM 技术栈）
 * --------------------------------------------------------------------------
 * 【关键】Vue3 + Vite 是 ESM 模块，不像 Webpack/UMD 那样能天然把生命周期挂到
 * window 上。所以需要 vite-plugin-qiankun 插件做一层桥接：
 *   1. vite.config.js 中启用 qiankun('analytics-vue3')
 *   2. 入口用 renderWithQiankun({...}) 包裹生命周期三件套
 *   3. 用 qiankunWindow.__POWERED_BY_QIANKUN__ 判断是否在 qiankun 环境
 *
 * 同时这个应用也展示了「update」生命周期：父应用热更新时如果需要
 * 把新 props 推给子应用，可以走这个钩子（本案例用 reactive 存了一份共享状态）
 * ========================================================================== */
import { createApp, reactive } from 'vue'
import { qiankunWindow, renderWithQiankun } from 'vite-plugin-qiankun/dist/helper'

import App from './App.vue'
import './style.css'

/**
 * 共享状态：用 Vue reactive 让父应用传入的 props 变为响应式，
 * 后续 update 钩子再调用 applyProps 时，App.vue 里用到这些值的地方会自动重渲染
 */
const microProps = reactive({
  preloadData: null,
  role: '',
  tenantId: '',
})

/* Vue app 实例引用：unmount 时需要 */
let appInstance = null

/** 把新的 props 合并到 reactive 对象上（update 钩子调用） */
function applyProps(props = {}) {
  microProps.preloadData = props.preloadData ?? null
  microProps.role = props.role ?? ''
  microProps.tenantId = props.tenantId ?? ''
}

/**
 * 创建并挂载 Vue 应用
 * 与其他子应用一样：qiankun 接入时在 props.container 内找 #app，
 * 独立运行时直接在 document 找
 */
function render(props = {}) {
  applyProps(props)
  const container = props.container
    ? props.container.querySelector('#app')
    : document.querySelector('#app')

  /* 通过 createApp 的第二个参数把 microProps 作为 props 传给根组件 */
  appInstance = createApp(App, {
    microProps,
  })
  appInstance.mount(container)
}

/* 通过 vite-plugin-qiankun 包装后，生命周期三件套会被正确挂到 window 上
   名称来自 vite.config.js 中 qiankun 插件传入的第一个参数 */
renderWithQiankun({
  /** qiankun 生命周期 2：每次路由命中时 mount */
  mount(props) {
    render(props)
  },
  /** qiankun 生命周期 1：首次加载一次性初始化 */
  bootstrap() {
    console.log('[analytics-vue3] bootstrap')
  },
  /** 额外钩子：父应用 props 变化时推给子应用（案例中未直接用到，保留扩展） */
  update(props) {
    applyProps(props)
  },
  /** qiankun 生命周期 3：路由离开时销毁 Vue 实例 + 清空 DOM */
  unmount(props) {
    const container = props.container
      ? props.container.querySelector('#app')
      : document.querySelector('#app')

    appInstance && appInstance.unmount()
    if (container) {
      container.innerHTML = ''
    }
    appInstance = null
  },
})

/* 独立运行模式：http://localhost:7204 直接访问
   方便 Vue3 子应用脱离主应用单独调试 UI / 走单测 */
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({
    role: 'ops_analyst',
    preloadData: {
      cards: [
        { label: '线索转化率', value: '36.8%' },
        { label: '区域 GMV', value: '1260 万' },
        { label: '渠道新增客户', value: '284' },
      ],
    },
  })
}
