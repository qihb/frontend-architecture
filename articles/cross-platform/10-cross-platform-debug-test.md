# 第十篇：跨端调试与测试——真机调试与多端测试策略

核心要点：

- 多端调试工具链：Flutter DevTools、RN DevTools（Flipper 已退役）、小程序开发者工具
- 真机调试与远程调试、云真机设备矩阵
- 测试分层：单元（共享逻辑层）/组件/端到端（Appium、Detox、Maestro 的跨端可行性）
- 多端一致性回归：截图对比与视觉 diff、同一套 mock 跑多端
