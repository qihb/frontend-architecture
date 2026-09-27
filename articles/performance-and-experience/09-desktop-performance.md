# 第九篇：桌面端性能优化——Electron 与 Tauri

**核心要点：**

- Electron 多进程架构：主进程阻塞、IPC 序列化开销、contextBridge、GPU/utility 进程
- 启动加速：v8 快照与 compile cache、按需加载、窗口显示策略（show: false + ready-to-show）、后台节流
- 内存治理：多窗口管理、内存快照分析
- Tauri：IPC 开销、wry/webview 平台差异（Linux webkitgtk 的坑）、与 Electron 的量化对比
- 桌面端特有性能问题
