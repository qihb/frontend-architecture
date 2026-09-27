# 第十篇：端到端测试——Playwright 与 Cypress 实战

**核心要点：**

- Playwright vs Cypress：架构差异（进程外 vs 进程内）、多 tab/iframe/多域支持、浏览器覆盖
- Playwright 核心：auto-wait、fixture、trace viewer、移动端模拟
- 稳定性治理（本篇灵魂）：flaky test 的定位与治理——隔离、超时策略、重试的正确姿势
- 测试环境：数据准备（API mock/数据 seed）、登录态复用
- CI 取舍：冒烟集 vs 全量、并行与分片
