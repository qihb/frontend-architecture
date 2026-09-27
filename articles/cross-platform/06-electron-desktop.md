# 第六篇：桌面端开发——Electron 与 Tauri

核心要点：

- Electron 架构：主进程 vs 渲染进程、preload 与 IPC（contextBridge）
- 打包与分发：electron-builder/Forge、自动更新（electron-updater）、代码签名与公证——桌面端最痛的一环
- 性能优化：内存占用、启动速度（v8 snapshot、延迟加载）、窗口显示策略
- 原生能力调用：Node.js 集成、系统 API、原生模块（N-API）
- 安全最佳实践：contextIsolation、nodeIntegration: false、sandbox、CSP
- 替代方案：Tauri 2（移动端支持）、Rust 后端与 IPC 开销、与 Electron 的选型对比
