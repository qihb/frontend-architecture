# 第六篇：Module Federation——Webpack 5 时代的微前端方案

**核心要点：**

- Module Federation 的核心模型：host/remote、exposes/remotes/shared 三组配置，把「构建期写死的依赖」变成「运行时协商的模块」
- shared 依赖的版本协商机制：singleton、requiredVersion、fallback 与 eager，公共依赖去重与版本冲突的真实处理逻辑
- 与 qiankun 的本质差异：qiankun 是「应用级编排」（HTML Entry + JS/CSS 沙箱），MF 是「模块级共享」（JS 层组合）——没有沙箱、没有样式隔离、没有路由接管，这些都要自己补
- 异步边界问题：remoteEntry 的加载时序、initial shared 依赖为何要求异步化入口，及常见报错的根因
- 生态现状：@module-federation/enhanced 的运行时插件化（动态 remote、运行时路由）、Rspack 对 MF 的原生支持、Vite 侧的 federation 插件
- 适用边界：同一技术栈内的微模块拆分与公共依赖复用是主场；跨技术栈、老应用接入不是它的目标场景
- 常见坑：shared 导致的「幽灵升级」（主应用升版本、子应用运行时炸）、样式全局污染、路由集成完全 DIY
