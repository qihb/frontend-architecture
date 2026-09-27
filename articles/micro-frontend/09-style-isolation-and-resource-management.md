# 第九篇：样式隔离与资源管理

**核心要点：**

- 样式冲突的根因：多个应用共享同一个 document 的 CSSOM，全局选择器、同名 class、CSS Variables、keyframes 互相覆盖
- qiankun 的两种隔离回顾与局限：strictStyleIsolation（Shadow DOM，天然隔离但弹层挂 body 会逃逸）与 experimentalStyleIsolation（运行时 scoped 转换，覆盖面有限）——本篇聚焦「机制之外怎么落地」
- 主流落地路线排序：BEM/命名约定（成本最低、靠纪律）、PostCSS 构建期前缀（postcss-prefix-selector 自动化）、CSS Modules/CSS-in-JS（构建期根治）、动态装卸子应用样式表（切换时增删 link/style）
- Shadow DOM 的实战坑：弹层挂 body 逃逸隔离、全局字体与 reset 无法穿透、事件委托与 a11y 的边界问题
- 资源管理的三个重复：字体/图标库重复加载、公共依赖（React/Vue/组件库）重复打包的体积膨胀、同名 API 请求重复发起——分别用 shared/externals、CDN 收敛、请求层去重处理
- 隔离策略要「分级」：设计系统层（主题 token、基础组件）应该打通共享，业务样式应该严格隔离——全隔离或全共享都是错的
- 度量闭环：用自动化检测（样式覆盖率、资源重复度扫描）验证隔离效果，而不是靠肉眼 review
