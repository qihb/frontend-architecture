# 第七篇：无界与 micro-app——微前端框架的新选择

**核心要点：**

- micro-app 的定位：借鉴 Web Components 思想做「类组件」封装，一个 `<micro-app>` 标签完成接入，JS 沙箱（Proxy + with）与样式作用域隔离，接入成本在同类方案中最低
- wujie 的混合架构：iframe 承载 JS 运行环境（复用浏览器原生 JS 隔离），Shadow DOM/Web Components 承载 DOM 渲染——用 iframe 之「强」补 DOM 割裂之「短」
- wujie 的关键设计：iframe 内的 window 代理到外层渲染容器，路由、通信、样式透传的桥接层与对应成本
- 与 qiankun 的对比维度：接入成本（micro-app 最低）、隔离强度（wujie 借 iframe 最强）、保活与预渲染体验（wujie 内置）、生态成熟度与深度定制空间（qiankun 最成熟）
- 各自的坑：micro-app 的样式处理与低版本浏览器兼容、wujie 的弹层/焦点跨 iframe 边界问题、两者共同的路由基座与生命周期约定
- 选型逻辑：新平台从零搭建、追求低侵入快速接入选 micro-app/wujie；存量复杂生态、需要深度运行时控制选 qiankun；三个方案都值得读源码，因为设计取舍各具代表性
