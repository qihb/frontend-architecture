# 跨端开发——一套代码，多端复用

跨端开发专栏：从「为什么跨端」与底层运行原理出发，覆盖 Flutter、React Native、小程序、桌面端四大技术路线，再到统一抽象层、工程化、性能、调试测试、UI 适配等工程实践，最后落到技术选型决策与未来趋势。

## 专栏定位

- **认识跨端**：跨端的动机、技术演进，以及渲染引擎、JS 引擎、桥接通信等底层原理
- **四大技术路线**：自绘引擎（Flutter）、原生渲染桥接（React Native/Expo）、编译期转译（小程序/Taro/uni-app）、Web 桌面化（Electron/Tauri）
- **跨端工程实践**：统一抽象层、多端工程化、性能优化、调试与测试
- **适配与展望**：多端 UI 一致性与适配体系、新一代格局（Lynx/KMP/鸿蒙）与选型决策

## 文章目录

### 认识跨端

- [第一篇：跨端开发全景——动机、演进与技术路线](01-cross-platform-landscape.md)
- [第二篇：跨端底层原理——渲染引擎、JS 引擎与桥接通信](02-cross-platform-runtime.md)

### 四大技术路线

- [第三篇：Flutter 深度解析——自绘引擎路线](03-flutter-deep-dive.md)
- [第四篇：React Native 深度解析——原生渲染 + 桥接路线](04-react-native-deep-dive.md)
- [第五篇：小程序与跨端框架——编译期转译路线](05-mini-program-cross-platform.md)
- [第六篇：桌面端开发——Electron 与 Tauri](06-electron-desktop.md)

### 跨端工程实践

- [第七篇：跨端统一抽象层与架构模式](07-cross-platform-abstraction.md)
- [第八篇：跨端工程化——多端构建、产物管理与动态化](08-cross-platform-engineering.md)
- [第九篇：跨端性能优化——各端差异与优化策略](09-cross-platform-performance.md)
- [第十篇：跨端调试与测试——真机调试与多端测试策略](10-cross-platform-debug-test.md)

### 适配与展望

- [第十一篇：跨端 UI 一致性与适配体系](11-cross-platform-ui-consistency.md)
- [第十二篇：跨端未来趋势与技术选型决策](12-cross-platform-trends.md)

### 番外篇

- [番外篇一：手写一个 JSBridge——把相机、定位等原生能力交给 H5](extra-01-jsbridge.md)（配套案例：[jsbridge-demo](../../examples/cross-platform/jsbridge-demo/README.md)）

## 阅读建议

- **新手入门**：从第一篇（全景）和第二篇（底层原理）开始，建立对跨端技术路线的整体认知
- **技术选型**：读完第一篇的选型框架后，按需深入第三至第六篇的具体路线
- **工程落地**：有选型方向后，重点阅读第七至第十篇的抽象层、工程化、性能与测试
- **进阶提升**：第十一、十二篇帮助收敛多端适配体系与未来技术判断
