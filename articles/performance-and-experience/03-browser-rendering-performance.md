# 第三篇：浏览器渲染性能——渲染流水线与关键渲染路径

**核心要点：**

- 渲染流水线五阶段：JavaScript → Style → Layout → Paint → Composite；以「浏览器一帧的生命周期」（rAF 时机、帧调度、栅格化）为贯穿主线
- 关键渲染路径（CRP）量化：DOM/CSSOM 构建、渲染阻塞 vs 解析阻塞的判定规则与首屏优化
- 重排/重绘的触发条件与规避；合成层晋升条件与内存代价、"层爆炸"诊断（Layers 面板）
- 现代渲染优化：content-visibility、contain 的渲染跳过机制、View Transitions API
