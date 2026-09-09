import './style.css'
import { registerMicroApps, start } from 'qiankun'

document.querySelector('#app').innerHTML = `
  <div class="esm-host">
    <header class="esm-header">
      <div>
        <p class="esm-tag">qiankun 3 实验台</p>
        <h1>ESM 子应用加载验证</h1>
        <p>这个实验只用于验证新版本对原生 ESM / Vite 风格子应用的适配路线。</p>
      </div>
      <div class="esm-note">
        <h2>为什么单独开一组实验？</h2>
        <ul>
          <li>它和 qiankun 2.x 的经典脚本接入路径不同</li>
          <li>更适合拿来验证能力，而不是和老系统直接混在一起</li>
          <li>文章里可以用它解释 3.0 的方向，而不是替代第 5 篇主案例</li>
        </ul>
      </div>
    </header>

    <section class="esm-stage-wrapper">
      <div class="esm-stage-head">
        <h2>esm-app</h2>
        <p>如果实验成功，这里会挂载一个导出原生 ESM 生命周期的子应用。</p>
      </div>
      <div id="esm-stage" class="esm-stage"></div>
    </section>
  </div>
`

// 注意：qiankun 3 rc 对 container 的要求与 2.x 不同。
// 2.x 允许字符串选择器，rc 版本要求传已经解析好的 HTMLElement。
const esmStage = document.querySelector('#esm-stage')

registerMicroApps([
  {
    name: 'esm-app',
    entry: 'http://localhost:7301',
    container: esmStage,
    activeRule: () => true,
    props: {
      experiment: 'esm-sandbox',
    },
  },
])

start({
  prefetch: false,
})
