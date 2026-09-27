# 第二篇：性能度量与监控体系——从实验室数据到真实用户监控（RUM）

**核心要点：**

- 实验室数据与 RUM 的区别与互补；CrUX 数据集（BigQuery）与 Search Console 的 field 数据对齐、与 SEO 的联动
- 指标采集底层：Performance API、Long Tasks API、Event Timing API（INP 的底层）、Element Timing API
- 指标归因：web-vitals attribution build，把 LCP 定位到具体元素、CLS 定位到偏移源——RUM 数据能否指导行动的分水岭
- 监控 SDK 三通道（错误、性能、行为）与采集工程的坑：SPA 路由切换的指标归因、bfcache（page persisted）、sendBeacon 上报时机、采样率设计
- 设备分级策略（高端机实验室数据对低端机用户无代表性）与指标聚合、分位数（P75）告警看板
