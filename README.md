# frontend-architecture

大前端架构系列文章，涵盖微前端、跨端开发、可视化拖拽、性能优化、工程化、测试、AI 辅助研发等方面的内容。

## 专栏导航

| 专栏 | 简介 | 文章数 | 目录 |
|------|------|--------|------|
| [微前端架构](#微前端架构--从入门到生产落地) | 从演进动机到方案选型，到 qiankun/Module Federation 实战，到治理与发布 | 14 篇 + 4 篇番外 + 2 个案例 | [专栏导读](articles/micro-frontend/README.md) |
| [工程化、测试与 AI](#工程化测试与-ai--前端研发效能提升实战) | 构建工具、Monorepo、CI/CD、分层测试体系、AI 辅助编码与审查 | 14 篇 | [专栏导读](articles/engineering-and-testing/README.md) |
| [跨端开发](#跨端开发--一套代码多端复用) | 跨端动机、底层原理、Flutter/RN/小程序/桌面四大路线、工程实践与趋势 | 12 篇 + 1 篇番外 + 1 个案例 | [专栏导读](articles/cross-platform/README.md) |
| [性能与体验优化](#性能与体验优化--从度量到ai驱动的优化实战) | 性能与体验的度量方法、Web/移动/桌面分端优化、体验优化与 AI 提效 | 15 篇 + 2 篇番外 | [专栏导读](articles/performance-and-experience/README.md) |
| [前端可视化拖拽](#前端可视化拖拽--从入门到架构实战) | 拖拽事件原理、库选型、手写实战、画布数学与交互手感、低代码编辑器架构与生产化 | 14 篇 + 4 篇番外（写作中） | [专栏导读](articles/visualization-drag/README.md) |

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

### 跨端开发——一套代码，多端复用

> [专栏导读](articles/cross-platform/README.md) · 12 篇正文 + 1 篇番外 + 1 个配套案例

**认识跨端（2 篇）**

- [第一篇：跨端开发全景——动机、演进与技术路线](articles/cross-platform/01-cross-platform-landscape.md)
- [第二篇：跨端底层原理——渲染引擎、JS 引擎与桥接通信](articles/cross-platform/02-cross-platform-runtime.md)

**四大技术路线（4 篇）**

- [第三篇：Flutter 深度解析——自绘引擎路线](articles/cross-platform/03-flutter-deep-dive.md)
- [第四篇：React Native 深度解析——原生渲染 + 桥接路线](articles/cross-platform/04-react-native-deep-dive.md)
- [第五篇：小程序与跨端框架——编译期转译路线](articles/cross-platform/05-mini-program-cross-platform.md)
- [第六篇：桌面端开发——Electron 与 Tauri](articles/cross-platform/06-electron-desktop.md)

**跨端工程实践（4 篇）**

- [第七篇：跨端统一抽象层与架构模式](articles/cross-platform/07-cross-platform-abstraction.md)
- [第八篇：跨端工程化——多端构建、产物管理与动态化](articles/cross-platform/08-cross-platform-engineering.md)
- [第九篇：跨端性能优化——各端差异与优化策略](articles/cross-platform/09-cross-platform-performance.md)
- [第十篇：跨端调试与测试——真机调试与多端测试策略](articles/cross-platform/10-cross-platform-debug-test.md)

**适配与展望（2 篇）**

- [第十一篇：跨端 UI 一致性与适配体系](articles/cross-platform/11-cross-platform-ui-consistency.md)
- [第十二篇：跨端未来趋势与技术选型决策](articles/cross-platform/12-cross-platform-trends.md)

**番外篇（1 篇）**

- [番外篇一：手写一个 JSBridge——把相机、定位等原生能力交给 H5](articles/cross-platform/extra-01-jsbridge.md)

**配套可运行案例**

- [jsbridge-demo（番外篇一配套）](examples/cross-platform/jsbridge-demo/README.md)：H5 + Android/iOS 原生容器，演示用 JSBridge 把相机、定位、扫码等能力开放给 H5

### 性能与体验优化——从度量到 AI 驱动的优化实战

> [专栏导读](articles/performance-and-experience/README.md) · 15 篇正文 + 2 篇番外

**方法论与度量（2 篇）**

- [第一篇：性能与体验优化全景图——从指标体系到决策框架](articles/performance-and-experience/01-performance-experience-overview.md)
- [第二篇：性能度量与监控体系——从实验室数据到真实用户监控（RUM）](articles/performance-and-experience/02-metrics-and-monitoring.md)

**Web 前端性能（4 篇）**

- [第三篇：浏览器渲染性能——渲染流水线与关键渲染路径](articles/performance-and-experience/03-browser-rendering-performance.md)
- [第四篇：资源加载与网络优化——从请求到缓存的完整链路](articles/performance-and-experience/04-resource-loading-and-network.md)
- [第五篇：前端运行时性能与内存管理——让 JS 与框架跑得更快](articles/performance-and-experience/05-runtime-performance-and-memory.md)
- [第六篇：性能工程化——性能预算、Bundle 分析与 CI 门禁](articles/performance-and-experience/06-performance-engineering.md)

**移动端与桌面端（3 篇）**

- [第七篇：移动端 App 性能优化——启动、首屏与帧率](articles/performance-and-experience/07-mobile-app-performance.md)
- [第八篇：跨端渲染性能调优——React Native 与 Flutter](articles/performance-and-experience/08-cross-platform-rendering-tuning.md)
- [第九篇：桌面端性能优化——Electron 与 Tauri](articles/performance-and-experience/09-desktop-performance.md)

**体验优化（3 篇）**

- [第十篇：感知性能与加载体验优化——让"快"被用户看见](articles/performance-and-experience/10-perceived-performance-and-loading.md)
- [第十一篇：交互体验与动画性能——流畅的微交互与无卡顿滚动](articles/performance-and-experience/11-interaction-and-animation-experience.md)
- [第十二篇：可访问性与体验度量——被忽视的体验维度](articles/performance-and-experience/12-accessibility-and-experience-metrics.md)

**AI 驱动（3 篇）**

- [第十三篇：AI 驱动的性能诊断——让 AI 读懂 profiling 与监控数据](articles/performance-and-experience/13-ai-driven-performance-diagnosis.md)
- [第十四篇：AI 驱动的性能修复——代码级优化与自动化](articles/performance-and-experience/14-ai-driven-performance-fix.md)
- [第十五篇：AI 驱动的体验优化与智能化——从走查到个性化](articles/performance-and-experience/15-ai-driven-experience-optimization.md)

**番外篇（2 篇）**

- [番外篇一：性能优化反模式清单](articles/performance-and-experience/extra-01-performance-antipatterns.md)
- [番外篇二：一次真实线上性能事故的完整复盘](articles/performance-and-experience/extra-02-production-performance-incident.md)

### 前端可视化拖拽——从入门到架构实战

> [专栏导读](articles/visualization-drag/README.md) · 15 篇正文 + 4 篇番外（规划中，各篇核心要点见专栏导读）

**入门篇：场景、原理与库选型（5 篇）**

- [第一篇：为什么每个前端都绕不开拖拽？——应用场景全景与技术地图](articles/visualization-drag/01-drag-landscape.md)
- [第二篇：拖拽的底层机制——鼠标事件、Pointer Events 与 HTML5 DnD API](articles/visualization-drag/02-drag-events-mechanism.md)
- [第三篇：主流拖拽库选型——dnd-kit、react-dnd、SortableJS、Interact.js 怎么选](articles/visualization-drag/03-drag-libraries-comparison.md)
- [第四篇：手写实战（一）——从零实现一个拖拽排序列表](articles/visualization-drag/04-handwritten-sortable-list.md)
- [第五篇：手写实战（二）——看板与跨容器拖拽](articles/visualization-drag/05-kanban-cross-container.md)

**进阶篇：编辑器手感的三大支柱（4 篇）**

- [第六篇：拖拽中的数学——坐标系、缩放与 Figma 式无限画布](articles/visualization-drag/06-coordinate-systems-and-transforms.md)
- [第七篇：命中检测与选择体系——点选、框选、多选与层级](articles/visualization-drag/07-hit-testing-and-selection.md)
- [第八篇：对齐与吸附——参考线算法让编辑器"手感"专业](articles/visualization-drag/08-alignment-and-snapping.md)
- [第九篇：撤销重做与快捷键——编辑器的"后悔药"](articles/visualization-drag/09-undo-redo-and-shortcuts.md)

**架构篇：可视化搭建平台（3 篇）**

- [第十篇：低代码编辑器架构（上）——画布、物料与 Schema 协议](articles/visualization-drag/10-editor-architecture-schema.md)
- [第十一篇：低代码编辑器架构（下）——物料体系、渲染引擎与代码生成](articles/visualization-drag/11-materials-rendering-codegen.md)
- [第十二篇：性能专题——千级节点的画布如何保持 60fps](articles/visualization-drag/12-canvas-performance.md)

**高阶篇：图编辑、表单与生产化（3 篇）**

- [第十三篇：流程图编辑器实战——节点、连线与自动布局](articles/visualization-drag/13-flow-chart-editor.md)
- [第十四篇：表单设计器实战——字段拖拽、校验配置与联动编排](articles/visualization-drag/14-form-designer.md)
- [第十五篇：走向生产——协同编辑、插件体系与工程化交付](articles/visualization-drag/15-production-collaboration-plugin.md)

**番外篇（4 篇）**

- [番外篇一：移动端拖拽实战——touch 长按、滚动容器与 H5 拖拽的妥协](articles/visualization-drag/extra-01-mobile-drag.md)
- [番外篇二：拖拽的可访问性——键盘拖拽与屏幕阅读器](articles/visualization-drag/extra-02-drag-accessibility.md)
- [番外篇三：AI + 可视化搭建——自然语言生成 Schema、AI 智能布局与 Copilot](articles/visualization-drag/extra-03-ai-and-visual-building.md)
- [番外篇四：一次拖拽卡顿的生产排查——性能剖析实战案例](articles/visualization-drag/extra-04-drag-performance-investigation.md)

**配套可运行案例（规划中）**

- dnd-list-demo（第四篇配套）：手写拖拽排序列表，演示状态机、占位符与 FLIP 动画
- kanban-demo（第五篇配套）：多列看板，演示跨容器拖拽、碰撞判定与自动滚动
- mini-editor（第十、十一篇配套）：迷你低代码编辑器，演示 Schema 协议、缩放画布、属性面板与撤销重做
- flow-editor（第十三篇配套）：流程图编辑器，演示节点连线、边路由与自动布局
- form-designer-demo（第十四篇配套）：拖拽式表单设计器，演示字段拖拽、校验规则与联动逻辑配置
