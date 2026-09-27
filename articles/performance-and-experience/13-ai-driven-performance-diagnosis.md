# 第十三篇：AI 驱动的性能诊断——让 AI 读懂 profiling 与监控数据

**核心要点：**

- Profiling 数据结构化：Chrome Trace / Flame Graph 的摘要与裁剪策略、转成 LLM 可读格式（token 预算）——这是"让 AI 读懂 profiling"的真问题
- MCP 连接性能工具链：Chrome DevTools MCP、Lighthouse MCP
- Agent 化诊断循环：假设 → 插桩 → 验证；AI 诊断的证据链要求（每个结论可回溯到数据）
- 监控异常检测与根因分析：传统时序方法（STL、孤立森林）vs LLM 的边界，AIOps 的现实与 hype
- AI 诊断的可信度评估与人工校验
