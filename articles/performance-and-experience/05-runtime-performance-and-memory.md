# 第五篇：前端运行时性能与内存管理——让 JS 与框架跑得更快

**核心要点：**

- JS 执行优化：V8 JIT、对象形状（hidden class）、分代 GC 原理与内存分配
- 长任务治理：scheduler.yield() / scheduler.postTask / isInputPending 的新一代切片方案；Web Worker 卸载计算（序列化成本模型、Comlink、SharedArrayBuffer 的适用边界）
- React：React Compiler（自动 memo 的编译器路线）、并发渲染（useTransition/useDeferredValue）、重渲染定位；Vue：响应式追踪与 Vapor mode（无 VDOM）
- 大列表与大 DOM：虚拟列表、分片渲染
- 内存泄漏排查：Detached DOM、监听器/闭包泄漏、WeakRef/FinalizationRegistry、heap snapshot 分析
