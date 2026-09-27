# 第四篇：Monorepo 策略——pnpm workspace 与 Turborepo 实战

**核心要点：**

- 单仓 vs 多仓的决策维度
- pnpm workspace：依赖 hoisting、catalog 统一版本协议
- 任务编排：Turborepo（缓存与 affected）vs Nx（增量构建、分布式缓存、插件生态）
- 版本与发布：changesets、固定/独立版本模式、私有 npm 源
- CI 增量构建与依赖图门禁：包之间依赖方向的约束
