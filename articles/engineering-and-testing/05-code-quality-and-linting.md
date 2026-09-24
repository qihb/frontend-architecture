# 第五篇：代码规范与质量门禁——ESLint、Prettier 与 Git Hooks

**核心要点：**

- 团队风格不统一、低级错误频发，导致代码质量下降，用 Prettier+stylelint 管格式、ESLint 管质量、TypeScript 管类型，三层各司其职
- 规范靠自觉难落地，用 husky + lint-staged + commitlint 提交前拦截
- 历史项目一次整改不现实，用 precise-commits、eslint-plugin-diff 渐进式优化