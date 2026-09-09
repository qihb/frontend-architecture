import './style.css'

function render(props = {}) {
  const root = props.container
    ? props.container.querySelector('#app')
    : document.querySelector('#app')

  if (!root) {
    return
  }

  root.innerHTML = `
    <section class="esm-app">
      <div class="esm-card">
        <p class="esm-card-tag">native ESM</p>
        <h1>esm-app</h1>
        <p>这个子应用采用原生 ESM 入口，并导出生命周期函数，专门用来做 qiankun 3 方向验证。</p>
        <ul>
          <li>实验标识：${props.experiment || 'standalone'}</li>
          <li>运行方式：${window.__POWERED_BY_QIANKUN__ ? '被 host 挂载' : '独立运行'}</li>
          <li>目标：验证 ESM 子应用能否被正确发现并挂载</li>
        </ul>
      </div>
    </section>
  `
}

async function bootstrap() {
  console.log('[esm-app] bootstrap')
}

async function mount(props) {
  console.log('[esm-app] mount', props)
  render(props)
}

async function unmount(props) {
  console.log('[esm-app] unmount', props)
  const root = props?.container
    ? props.container.querySelector('#app')
    : document.querySelector('#app')

  if (root) {
    root.innerHTML = ''
  }
}

if (!window.__POWERED_BY_QIANKUN__) {
  bootstrap().then(() => mount({ experiment: 'standalone-esm' }))
}

export { bootstrap, mount, unmount }

window['esm-app'] = {
  bootstrap,
  mount,
  unmount,
}
