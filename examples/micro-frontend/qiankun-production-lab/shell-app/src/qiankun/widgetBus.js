/* ==========================================================================
 * widgetBus：局部 Widget 的 Props 聚合器
 * --------------------------------------------------------------------------
 * 设计目的：
 *   客户360页面需要同时挂载 customer-widget 和 risk-control-widget，
 *   两者依赖的客户主档、授信摘要、风险信号都是同一个客户的上下文。
 *   由主应用统一请求一次，再把同一份 props 传给两个 Widget：
 *     - 避免两个 Widget 各自独立打接口（重复请求 + 数据不一致）
 *     - 降低子应用的复杂度（不需要知道怎么查客户主档）
 *
 * 新增局部 Widget 时，如果需要主应用先聚合数据，也可以在这里扩展 buildXxxProps
 * ========================================================================== */
import { getCustomerContext } from '../services/customerService'

/**
 * 构建客户360页面两个 Widget 共享的 Props
 * 内部先调 getCustomerContext 聚合：
 *   customerId / customerName / profile / creditSummary / riskSignals
 * 再把同一份对象分别传给两个 Widget
 *
 * @param {string} customerId - 当前选中的客户编号
 * @returns {Promise<object>} WidgetProps 契约对象
 */
export async function buildWidgetProps(customerId) {
  const response = await getCustomerContext(customerId)
  return response.data
}
