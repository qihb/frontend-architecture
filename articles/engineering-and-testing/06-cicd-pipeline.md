# 第六篇：CI/CD 流水线设计——从代码提交到自动上线

**核心要点：**

- 流水线设计：lint / test / build / deploy 阶段划分、并行化与失败快停
- 平台实战：GitHub Actions / GitLab CI 的缓存策略与构建矩阵
- 构建产物管理：制品库、immutable 部署、sourcemap 管理
- 部署策略：灰度/蓝绿/回滚，Feature Flag 解耦「发布」与「上线」
- 前端特有：CDN 与边缘部署、环境配置注入的正确姿势
