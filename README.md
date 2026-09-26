# frontend-architecture

大前端架构系列文章，涵盖微前端、跨平台开发、可视化拖拽、性能优化、工程化、测试、AI 辅助研发等方面的内容。

## 专栏导航

| 专栏 | 简介 | 文章数 | 目录 |
|------|------|--------|------|
| [微前端架构](#微前端架构--从入门到生产落地) | 从演进动机到方案选型，到 qiankun/Module Federation 实战，到治理与发布 | 14 篇 + 4 篇番外 + 2 个案例 | [专栏导读](articles/micro-frontend/README.md) |
| [工程化、测试与 AI](#工程化测试与-ai--前端研发效能提升实战) | 构建工具、Monorepo、CI/CD、分层测试体系、AI 辅助编码与审查 | 14 篇 | [专栏导读](articles/engineering-and-testing/README.md) |

> 想找特定主题？用 `Ctrl/⌘ + F` 搜索关键词，或直接浏览下方专栏目录。

---

## 文章目录

### 微前端架构——从入门到生产落地

> [专栏导读](articles/micro-frontend/README.md) · 14 篇正文 + 4 篇番外 + 2 个配套案例

**正文（14 篇）**

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

**番外篇（5 篇）**

- [番外篇一：iframe 真的是微前端吗？为什么很多团队最后还是选了它](articles/micro-frontend/extra-01-iframe.md)
- [番外篇二：从 JS Bundle 到 Single-SPA，微前端运行时方案是怎么演进的](articles/micro-frontend/extra-02-runtime-evolution.md)
- [番外篇三：Web Components 与服务端组合，为什么它们没有成为主流](articles/micro-frontend/extra-03-web-components-and-server-composition.md)
- [番外篇四：企业级混合微前端改造实战——老项目、新项目、局部嵌入与 qiankun 3 试验](articles/micro-frontend/extra-04-production-hybrid-micro-frontend.md)
- [番外篇五：iframe 微前端工程化落地——一条 postMessage 怎么撑起父子协作](articles/micro-frontend/extra-05-iframe-engineering.md)

**配套可运行案例**

- [qiankun 最小可运行示例（第五篇配套）](examples/micro-frontend/qiankun-basic-demo/README.md)：主应用 + dashboard/order 两个子应用，演示注册、切换与通信
- [qiankun 生产改造实验室（番外篇四配套）](examples/micro-frontend/qiankun-production-lab/README.md)：老 Vue2/React 系统接入、`loadMicroApp` 局部嵌入、Vue3/Vite 独立应用与 qiankun 3 试验台

### 工程化、测试与 AI——前端研发效能提升实战

> [专栏导读](articles/engineering-and-testing/README.md) · 14 篇（工程化 6 + 测试 4 + AI 4）

**工程化篇（6 篇）**

- [第一篇：前端工程化全景图——从构建到部署的完整链路](articles/engineering-and-testing/01-engineering-overview.md)
- [第二篇：构建工具演进——从 Webpack 到 Vite 再到 Rspack](articles/engineering-and-testing/02-build-tools-evolution.md)
- [第三篇：脚手架与项目模板——标准化研发的起点](articles/engineering-and-testing/03-scaffolding-and-templates.md)
- [第四篇：Monorepo 策略——pnpm workspace 与 Turborepo 实战](articles/engineering-and-testing/04-monorepo-strategy.md)
- [第五篇：代码规范与质量门禁——ESLint、Prettier 与 Git Hooks](articles/engineering-and-testing/05-code-quality-and-linting.md)
- [第六篇：CI/CD 流水线设计——从代码提交到自动上线](articles/engineering-and-testing/06-cicd-pipeline.md)

**测试篇（4 篇）**

- [第七篇：前端测试体系全景——策略、分层与落地实践](articles/engineering-and-testing/07-testing-overview.md)
- [第八篇：单元测试实战——Vitest 与 Jest 的选择与落地](articles/engineering-and-testing/08-unit-testing.md)
- [第九篇：组件测试与视觉回归——Testing Library 与 Storybook](articles/engineering-and-testing/09-component-and-visual-testing.md)
- [第十篇：端到端测试——Playwright 与 Cypress 实战](articles/engineering-and-testing/10-e2e-testing.md)

**AI 篇（4 篇）**

- [第十一篇：AI 辅助代码生成——Copilot、Cursor 与代码补全的工程化实践](articles/engineering-and-testing/11-ai-code-generation.md)
- [第十二篇：AI 辅助测试生成——让 AI 帮你写测试用例](articles/engineering-and-testing/12-ai-test-generation.md)
- [第十三篇：AI 辅助代码审查——自动化 PR Review 与质量分析](articles/engineering-and-testing/13-ai-code-review.md)
- [第十四篇：AI 驱动的工程化未来——智能 CI/CD、自动化运维与人机协作](articles/engineering-and-testing/14-ai-driven-engineering.md)
