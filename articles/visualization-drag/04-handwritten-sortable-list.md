# 第四篇：手写实战（一）——从零实现一个拖拽排序列表

**核心要点：**

- 最小可用拖拽 = mousedown + mousemove + mouseup 的状态机：idle / dragging / settling 三态
- 三件套：拖拽影像（ghost/clone）、占位符（placeholder）、目标位置判定，各自的作用与实现
- FLIP 动画原理：First-Last-Invert-Play 四步，为什么排序动画不能直接用 CSS transition
- 目标位置判定的两种思路：按几何中点 vs 按元素遍历，以及 mousemove 里的高频计算怎么省
- 手感细节：拖拽句柄（drag handle）与整行拖拽、rAF 节流、快速甩动、拖出容器后的兜底
- 代码落地：约 200 行原生 JS 实现一个可用的排序列表，配合 FLIP 动画丝滑换位

**这篇适合谁看：**

- 想动手写拖拽、不想只会调库的初学者
- 用过 SortableJS 但好奇内部实现的工程师
- 面试前想系统准备"手写拖拽"这类题目的同学

**配图计划：**

- 拖拽状态机图（idle → dragging → settling）
- FLIP 动画四步分解图
- ghost 与 placeholder 的 DOM 结构示意图
