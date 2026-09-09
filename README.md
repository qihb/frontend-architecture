# frontend-architecture
大前端架构系列文章，涵盖微前端、跨平台开发、可视化拖拽、性能优化、工程化、测试等方面的内容

## 文章目录

### 微前端架构——从入门到生产落地

- [第一篇：为什么要微前端？——前端架构演进之路](articles/micro-frontend/01-why-micro-frontend.md)
- [第二篇：微前端核心概念与设计理念](articles/micro-frontend/02-core-concepts.md)
- [第三篇：微前端实现方案全景对比与选型建议](articles/micro-frontend/03-solutions-comparison.md)
- [第四篇：qiankun 深度解析（上）——原理与架构](articles/micro-frontend/04-qiankun-architecture.md)
- [第五篇：qiankun 深度解析（下）——实战与踩坑](articles/micro-frontend/05-qiankun-practice.md)
- [第六篇：Module Federation——Webpack 5 时代的微前端方案](articles/micro-frontend/06-module-federation.md)
- [第七篇：无界与 micro-app——微前端框架的新选择](articles/micro-frontend/07-wujie-and-micro-app.md)
- [第八篇：微前端通信机制全攻略](articles/micro-frontend/08-communication.md)
- [第九篇：样式隔离与资源管理](articles/micro-frontend/09-style-isolation-and-resource-management.md)
- [第十篇：微前端性能优化实战](articles/micro-frontend/10-performance-optimization.md)
- [第十一篇：微前端治理与发布体系——从接入规范到灰度回滚](articles/micro-frontend/11-governance-and-release.md)
- [第十二篇：微前端测试与联调策略——主子应用如何稳定协作](articles/micro-frontend/12-testing-and-integration.md)
- [第十三篇：微前端与 Monorepo——如何协同管理大型项目](articles/micro-frontend/13-monorepo-collaboration.md)
- [第十四篇：微前端落地总结与架构决策](articles/micro-frontend/14-architecture-decision.md)

### 微前端架构——番外篇

- [番外篇一：iframe 真的是微前端吗？为什么很多团队最后还是选了它](articles/micro-frontend/extra-01-iframe.md)
- [番外篇二：从 JS Bundle 到 Single-SPA，微前端运行时方案是怎么演进的](articles/micro-frontend/extra-02-runtime-evolution.md)
- [番外篇三：Web Components 与服务端组合，为什么它们没有成为主流](articles/micro-frontend/extra-03-web-components-and-server-composition.md)
- [番外篇四：企业级混合微前端改造实战——老项目、新项目、局部嵌入与 qiankun 3 试验](articles/micro-frontend/extra-04-production-hybrid-micro-frontend.md)

### 微前端架构——配套可运行案例

- [qiankun 最小可运行示例（第五篇配套）](examples/micro-frontend/qiankun-basic-demo/README.md)：主应用 + dashboard/order 两个子应用，演示注册、切换与通信
- [qiankun 生产改造实验室（番外篇四配套）](examples/micro-frontend/qiankun-production-lab/README.md)：老 Vue2/React 系统接入、`loadMicroApp` 局部嵌入、Vue3/Vite 独立应用与 qiankun 3 试验台
