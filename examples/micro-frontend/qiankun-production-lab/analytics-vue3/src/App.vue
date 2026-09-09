<template>
  <section class="analytics-page">
    <header class="analytics-hero">
      <div>
        <p class="analytics-tag">Vue3 + Vite</p>
        <h1>analytics-vue3</h1>
        <p>
          这个项目故意保持独立运行，用来对应文章里“qiankun 2.x 面对现代工程体系时，为什么会出现接入抉择”这一节。
        </p>
      </div>
      <div class="analytics-panel">
        <h2>文章建议</h2>
        <ul>
          <li>如果你还在 qiankun 2.x，先评估社区插件方案</li>
          <li>如果项目允许试验，再看 qiankun 3 的 ESM 路线</li>
          <li>不要为了“统一方案”强行把所有项目都用同一种接法</li>
        </ul>
      </div>
    </header>

    <section class="analytics-grid">
      <article class="analytics-card">
        <h2>现代工程优势</h2>
        <p>Vite 开发体验更轻，HMR 更直接，适合新项目快速迭代。</p>
      </article>
      <article class="analytics-card">
        <h2>接入代价</h2>
        <p>在 qiankun 2.x 中，需要额外处理 ESM、资源路径、沙箱兼容等问题。</p>
      </article>
      <article class="analytics-card">
        <h2>推荐定位</h2>
        <p>在生产上把它作为“待接入候选项目”，而不是直接塞进老系统接入链路。</p>
      </article>
    </section>
  </section>
</template>
