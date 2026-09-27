# 第四篇：React Native 深度解析——原生渲染 + 桥接路线

核心要点：

- RN 架构演进：Bridge → JSI + Fabric/TurboModule；New Architecture 默认化（0.76+）与 bridgeless mode
- 原生组件渲染流程与 Yoga 布局
- Hermes 引擎与启动优化
- 动态化能力：CodePush 已退役（App Center 2025 年关停），替代方案 EAS Update / 自建推包与合规边界
- Expo 生态崛起：官方推荐的开发框架带来的工程收益
- 性能优化：列表渲染（FlashList）、图片优化、原生模块调用
- RN vs Flutter 技术层对比（选型决策方法论见第十二篇）
- 实战案例：电商 App 的 RN 实践
