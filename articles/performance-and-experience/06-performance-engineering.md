# 第六篇：性能工程化——性能预算、Bundle 分析与 CI 门禁

**核心要点：**

- 性能预算的设定方法：基于 RUM 分布（P75 对标竞品）定预算，而非拍脑袋
- Bundle 分析与依赖治理：tree-shaking 失效根因（sideEffects、依赖 ESM 化）、重复依赖检测、monorepo 依赖治理
- CI 性能门禁与性能回归测试：Lighthouse CI / size-limit、回归自动归因（bundle diff / Lighthouse diff 关联到具体 commit）
- 门禁规则分级（阻断 vs 告警）、豁免流程与性能文化：性能周报、目标对齐 OKR
