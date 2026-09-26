# 微前端架构——从入门到生产落地

本专栏从「为什么需要微前端」出发，系统梳理微前端的核心概念、方案选型、框架原理、通信机制、样式隔离、性能优化、治理发布与测试联调，结合真实生产案例，帮助团队完成从评估到落地的完整闭环。

## 专栏定位

- **正文（第 1–14 篇）**：从架构演进动机到生产落地全流程，覆盖选型、原理、实战、治理与决策
- **番外篇（5 篇）**：深入探讨 iframe、运行时方案演进、Web Components、企业级混合改造等专题
- **配套案例（2 个）**：可运行的最小示例和生产改造实验室

## 文章目录

### 正文

- [第一篇：为什么要微前端？——前端架构演进之路](01-why-micro-frontend.md)
- [第二篇：微前端核心概念与设计理念](02-core-concepts.md)
- [第三篇：微前端实现方案全景对比与选型建议](03-solutions-comparison.md)
- [第四篇：qiankun 深度解析（上）——原理与架构](04-qiankun-architecture.md)
- [第五篇：qiankun 深度解析（下）——实战与踩坑](05-qiankun-practice.md)
- [第六篇：Module Federation——Webpack 5 时代的微前端方案](06-module-federation.md)
- [第七篇：无界与 micro-app——微前端框架的新选择](07-wujie-and-micro-app.md)
- [第八篇：微前端通信机制全攻略](08-communication.md)
- [第九篇：样式隔离与资源管理](09-style-isolation-and-resource-management.md)
- [第十篇：微前端性能优化实战](10-performance-optimization.md)
- [第十一篇：微前端治理与发布体系——从接入规范到灰度回滚](11-governance-and-release.md)
- [第十二篇：微前端测试与联调策略——主子应用如何稳定协作](12-testing-and-integration.md)
- [第十三篇：微前端与 Monorepo——如何协同管理大型项目](13-monorepo-collaboration.md)
- [第十四篇：微前端落地总结与架构决策](14-architecture-decision.md)

### 番外篇

- [番外篇一：iframe 真的是微前端吗？为什么很多团队最后还是选了它](extra-01-iframe.md)
- [番外篇二：从 JS Bundle 到 Single-SPA，微前端运行时方案是怎么演进的](extra-02-runtime-evolution.md)
- [番外篇三：Web Components 与服务端组合，为什么它们没有成为主流](extra-03-web-components-and-server-composition.md)
- [番外篇四：企业级混合微前端改造实战——老项目、新项目、局部嵌入与 qiankun 3 试验](extra-04-production-hybrid-micro-frontend.md)
- [番外篇五：iframe 微前端工程化落地——一条 postMessage 怎么撑起父子协作](extra-05-iframe-engineering.md)

### 配套可运行案例

- [qiankun 最小可运行示例（第五篇配套）](../../examples/micro-frontend/qiankun-basic-demo/README.md)：主应用 + dashboard/order 两个子应用，演示注册、切换与通信
- [qiankun 生产改造实验室（番外篇四配套）](../../examples/micro-frontend/qiankun-production-lab/README.md)：老 Vue2/React 系统接入、`loadMicroApp` 局部嵌入、Vue3/Vite 独立应用与 qiankun 3 试验台

## 阅读建议

- 如果你刚开始了解微前端，建议从第一篇开始按顺序阅读，前五篇是核心基础
- 如果你正在做方案选型，重点看第三篇（方案对比）和第四、五篇（qiankun 实战）
- 如果你已经落地微前端，遇到治理和联调问题，可以直接跳到第十一、十二篇
- 番外篇可以按兴趣选读，其中番外篇四是一个完整的企业级改造案例，实战性较强
