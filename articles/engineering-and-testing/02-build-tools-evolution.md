# 第二篇：构建工具演进——从 Webpack 到 Vite 再到 Rspack

**核心要点：**

- 演进脉络：Webpack（bundle 一切）→ esbuild/SWC（原生速度）→ Vite（unbundled 开发）→ Rspack/Turbopack/Rolldown（构建工具 Rust 化）
- Vite 生态：dev 与 build 双引擎、Rollup 兼容的插件体系
- Rspack / Turbopack / Rolldown 对比：性能数据、webpack 兼容层与迁移成本
- 构建提速的工程手段：持久化缓存与远程缓存、并行、代码分割
- 选型决策：新项目选型 vs 存量项目迁移的收益评估
