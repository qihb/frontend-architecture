# 第三篇：Flutter 深度解析——自绘引擎路线

核心要点：

- Flutter 三层架构：Framework 层、Engine 层、Embedder 层
- Dart 与性能的关系：AOT 编译、Isolate 内存隔离（无共享内存锁竞争）
- 自绘引擎原理：Skia → Impeller 的演进（shader jank 的根治思路）
- Widget、Element、RenderObject 三棵树与重建优化（const、build 收敛）
- 状态管理方案选型：Provider、Riverpod、BLoC、hooks
- 性能优化：减少重绘、图片缓存、Platform View 的代价、包体积（引擎体积的固定成本）
- 动态化短板与 Shorebird：热更新受限是国内选型的核心顾虑
- 适用场景与局限性
