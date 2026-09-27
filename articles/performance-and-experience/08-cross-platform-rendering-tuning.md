# 第八篇：跨端渲染性能调优——React Native 与 Flutter

**核心要点：**

- RN 新架构的本质：JSI 去 Bridge 化、Fabric 同步渲染、TurboModule、Hermes 引擎（启动与内存收益）、bridgeless mode
- Flutter：渲染流程与 const 优化、Impeller（替代 Skia 解决 shader jank）、UI/Raster 双线程、Isolate 与 compute、Platform View 混合渲染的代价
- 两条路线的性能陷阱对比与选型决策矩阵（与原生基线的差距）
- 三种渲染范式（Web/RN/Flutter）的本质差异对照
