# 第十一篇：AI 辅助代码生成——Copilot、Cursor 与代码补全的工程化实践

**核心要点：**

- 工具形态演进：补全（Copilot）→ 对话（Cursor）→ Agent（Claude Code、Cursor Agent）三代的差异与适用场景
- 工程化使用：规则文件（AGENTS.md / .cursorrules）注入项目规范、MCP 接入内部工具与文档
- 生成质量护栏：类型系统、lint、测试对 AI 产出的硬约束
- 提示策略：任务拆解、给示例、小步提交、上下文管理
- 效果度量与风险：采纳率/修改率/周期时间；幻觉 API 与安全问题
