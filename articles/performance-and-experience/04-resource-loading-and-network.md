# 第四篇：资源加载与网络优化——从请求到缓存的完整链路

**核心要点：**

- TTFB 与传输层：HTTP/2/3 的实际收益与坑（0-RTT、连接迁移、企业网络 UDP 封禁）；SSR/流式 SSR/RSC/边缘渲染 vs CSR、Partial Prerendering、103 Early Hints
- 资源优先级：fetchpriority（当前 LCP 优化最重要的单一手段）、preload / prefetch / preconnect / modulepreload、Speculation Rules API 预渲染
- 代码分割与懒加载；关键 CSS 内联与异步化
- 静态资源工程：图片 AVIF/WebP 与响应式、字体优化（font-display、子集化、可变字体）、Brotli/Zstd 压缩
- 缓存体系：HTTP 缓存精细化（immutable + content hash、stale-while-revalidate）与 Service Worker 缓存策略（Cache Storage、Workbox、离线）
- 第三方脚本治理：tag manager 的代价、facade 模式、Partytown worker 隔离
