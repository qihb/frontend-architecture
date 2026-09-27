# 第三篇：主流拖拽库选型——dnd-kit、react-dnd、SortableJS、Interact.js 怎么选

**核心要点：**

- 库定位全景：SortableJS（DOM 排序专家）、react-dnd（拖拽状态机抽象）、dnd-kit（现代 React 方案、传感器架构）、Interact.js（指针交互全能：拖拽/缩放/手势）、pragmatic-drag-and-drop（Atlassian 2024 开源、Trello 同款）
- 第四条实现路线：pragmatic-drag-and-drop 的「监控原生事件、不接管 DOM、按需组合独立包」哲学——与 dnd-kit 的 Sensor 抽象是两种架构世界观，对比着讲最出认知
- 原理差异：直接操作 DOM vs 状态机驱动 vs Sensor 抽象层 vs 监控原生事件，各自决定了能力边界
- 选型决策树：技术栈（React/Vue/框架无关）× 场景（排序/看板/自由拖拽）× a11y 与体积要求
- 维护状态与生态：react-dnd 停更风险、dnd-kit 的 a11y 与键盘拖拽支持、SortableJS 的框架适配层（vuedraggable 等）
- Vue 生态补充：vue-draggable-plus、useSortable 的实现思路与适用场景
- 结论先行：排序用 SortableJS 系，React 复杂交互用 dnd-kit，自由拖拽画布往往最终自己写

**这篇适合谁看：**

- 正在做技术选型、不想踩坑的工程师和技术负责人
- 用过其中某个库但好奇"别的库为什么那样设计"的同学
- 需要在 Vue/React 之间做跨框架决策的团队

**配图计划：**

- 选型决策树
- 四库能力对比矩阵（场景支持、框架、a11y、体积、维护状态）
- 三种实现原理的架构对比图（DOM 操作 / 状态机 / Sensor 抽象）
