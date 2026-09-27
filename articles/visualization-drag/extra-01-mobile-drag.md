# 番外篇一：移动端拖拽实战——touch 长按、滚动容器与 H5 拖拽的妥协

**核心要点：**

- 移动端为什么不能用 HTML5 DnD：iOS/Android 的支持现状与触摸拖拽的真实行为
- 实现路线首选 Pointer Events：一套 pointer 事件统一 mouse/touch/pen，避免维护双份 mouse/touch 逻辑；仍需掌握 touch 事件细节（touchstart/touchmove/touchcancel、多点 identifier）以处理兼容与多指场景
- 被动事件（passive）对 preventDefault 的影响、touch-action 与浏览器原生手势的抢占关系
- 长按拖拽的设计：长按阈值、触发后的视觉反馈、与页面滚动的冲突处理（拖拽时锁定滚动）
- 触摸下的"无 hover"问题：拖拽目标高亮、放置位置预览的替代方案
- 滚动容器与边界：拖拽中自动滚动、安全区、吸顶吸底的边界 case
- 方案落地：SortableJS 的移动端适配、dnd-kit 的 TouchSensor，以及自研时的降级策略

**这篇适合谁看：**

- 做 H5 拖拽排序、移动端看板/清单类应用的同学
- 被移动端"拖不动、拖一半页面滚走"折磨过的工程师
- 需要一套 PC/移动端拖拽统一方案的技术负责人

**配图计划：**

- 触摸拖拽与页面滚动的冲突场景示意图
- 长按触发拖拽的状态机图
- 移动端拖拽关键边界 case 清单图
