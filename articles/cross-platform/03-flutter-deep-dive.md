# 第三篇：Flutter 深度解析——自绘引擎路线

核心要点：

- Flutter 的三层架构：Framework 层、Engine 层、Embedder 层
- 自绘引擎原理：Skia → Impeller 的演进
- Widget、Element、RenderObject 三棵树
- 状态管理方案：Provider、Riverpod、BLoC
- 性能优化：减少重绘、合理使用 const、图片缓存
- 适用场景与局限性
