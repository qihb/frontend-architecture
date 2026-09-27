# 第十一篇：交互体验与动画性能——INP 时代的流畅度工程

**核心要点：**

- INP 三段分解：input delay → processing → presentation delay，及各段的优化手段
- 动画技术选型矩阵：CSS transitions/animations、WAAPI、JS 驱动、FLIP
- 新一代动画能力：View Transitions API、滚动驱动动画（scroll-timeline，免 JS）
- 滚动性能：passive listener、will-change、contain；touch-action 与惯性滚动
- 视觉稳定（CLS）的成因与消除；prefers-reduced-motion 与无障碍联动
