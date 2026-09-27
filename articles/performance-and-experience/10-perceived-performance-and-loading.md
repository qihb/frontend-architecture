# 第十篇：感知性能与加载体验优化——让"快"被用户看见

**核心要点：**

- 感知性能与真实性能的区别；理论锚点：Nielsen 响应时间三层级（0.1s / 1s / 10s）
- 加载占位的设计与争议：骨架屏可能让感知更慢的研究、skeleton vs spinner vs placeholder 选型、渐进式渲染与 Suspense 流式 UI
- 数据层感知优化：先渲染缓存再刷新（SWR 模式）、乐观 UI 与回滚设计（useOptimistic）
- 预取策略谱系：hover 预取（quicklink 等）→ 数据 prefetch（React Query/SWR）→ Speculation Rules 分级预渲染
- TBT 与用户感知的映射（TTI 已被 Lighthouse 10 移除，不再作为主线指标）
