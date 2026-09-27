# 第二篇：拖拽的底层机制——鼠标事件、Pointer Events 与 HTML5 DnD API

**核心要点：**

- 三代 API 演进：mouse/touch 事件 → Pointer Events（统一指针）→ HTML5 DnD（draggable/dataTransfer）
- HTML5 DnD 完整事件生命周期：dragstart / drag / dragenter / dragover / dragleave / drop / dragend，事件在"拖拽源"与"放置目标"之间如何流动
- 原生 DnD 的硬伤：拖拽影像不可定制、移动端不支持、默认样式难看、dropEffect 交互受限
- 为什么 Figma、Miro 等专业画布都绕开原生 DnD，用指针事件自己实现
- Pointer Events 关键细节：pointerId、setPointerCapture、touch-action 与 preventDefault 的坑
- 手写拖拽的最小骨架：mousedown/pointerdown + mousemove/pointermove + mouseup/pointerup 的状态机雏形

**这篇适合谁看：**

- 想搞懂"拖拽到底发生了什么"的前端同学
- 被原生 DnD API 坑过（图片默认拖拽、移动端无效）的同学
- 准备手写拖拽逻辑、需要打牢事件基础的同学

**配图计划：**

- HTML5 DnD 事件生命周期时序图（拖拽源与放置目标之间的流动）
- "原生 DnD vs 手写指针事件"对比表
- 手写拖拽最小骨架的状态流转图
