/* ==========================================================================
 * Customer360Page：双子应用同屏编排页
 * --------------------------------------------------------------------------
 * 【核心知识点】
 * 与 registerMicroApps（路由驱动、整页）不同，
 * 局部 Widget 使用 loadMicroApp 手动挂载，体现了 qiankun 的另一种使用范式：
 *
 *   1. 主应用先聚合数据（buildWidgetProps 内部调用 getCustomerContext）
 *   2. 拿到同一份上下文后，同时加载两个独立 Widget
 *   3. 组件卸载时遍历 microAppRef 手动 .unmount()
 *   4. 切换客户 ID 时，先卸载旧 Widget，再用新 props 加载新 Widget
 *
 * 对比 registerMicroApps：
 *   - 路由驱动 / 自动匹配 vs 手动控制 / 命令式加载
 *   - 整页占满 vs 页面内任意插槽位
 *   - 适合大型业务子应用 vs 适合小型功能块（画像、风控、报表等）
 * ========================================================================== */
import { loadMicroApp } from 'qiankun'
import { Card, Col, Row, Select, Spin, Tag } from 'antd'
import { useEffect, useRef, useState } from 'react'

import { buildWidgetProps } from '../qiankun/widgetBus'
import { useAuthStore } from '../store/authStore'

/* 客户切换下拉的 mock 数据（真实项目中来自客户列表接口） */
const CUSTOMER_OPTIONS = [
  { label: '华东医械集团', value: 'CUST-1001' },
  { label: '北区零售联盟', value: 'CUST-1002' },
  { label: '华南制造客户', value: 'CUST-1003' },
]

export default function Customer360Page() {
  /* 局部 Loading：控制两个 Widget 插槽位上方的骨架展示 */
  const [loading, setLoading] = useState(true)

  /* 从 authStore 订阅客户360相关状态
     selectedCustomerId 是跨页面共享的，CRM 子应用点击「查看360」时会写入 */
  const selectedCustomerId = useAuthStore((state) => state.selectedCustomerId)
  const customer360Data = useAuthStore((state) => state.customer360Data)
  const setCustomer360Data = useAuthStore((state) => state.setCustomer360Data)
  const setSelectedCustomerId = useAuthStore((state) => state.setSelectedCustomerId)

  /* loadMicroApp 返回的微应用实例引用数组，卸载时用 */
  const microAppRef = useRef([])

  /* ------------------------------------------------------------------
   * 核心 Effect：客户 ID 变化时重新聚合数据并挂载两个 Widget
   * - 先调 buildWidgetProps：内部调 getCustomerContext 聚合主档/授信/风控
   * - 先 unmount 旧实例（防止 DOM 残留 + 重复事件监听）
   * - 再 loadMicroApp 到两个具名插槽位
   * ------------------------------------------------------------------ */
  useEffect(() => {
    /* disposed 标记：数据回来前用户已切走页面 → 不执行后续 setState */
    let disposed = false

    async function mountWidgets() {
      setLoading(true)

      /* 【编排核心】主应用统一聚合客户360上下文
         两个 Widget 消费的是同一份 props，避免各自独立请求导致
         数据不一致、重复打接口、性能浪费 */
      const props = await buildWidgetProps(selectedCustomerId)

      if (disposed) {
        return
      }

      /* 存一份到 store，用于页面上方三张摘要卡的渲染 */
      setCustomer360Data(props)

      /* 先清场：上一次的 Widget 实例都 unmount 掉
         注意：loadMicroApp 返回对象上有 .unmount() 方法，但可能为 undefined */
      microAppRef.current.forEach((microApp) => microApp?.unmount?.())

      /* 分别加载两个局部 Widget，传入同一份 props（也可以传不同的） */
      microAppRef.current = [
        loadMicroApp({
          name: 'customer-widget',
          entry: 'http://localhost:7203',
          container: '#insight-widget-slot',
          props,
        }),
        loadMicroApp({
          name: 'risk-control-widget',
          entry: 'http://localhost:7205',
          container: '#risk-widget-slot',
          props,
        }),
      ]
      setLoading(false)
    }

    mountWidgets()

    return () => {
      disposed = true
      /* 组件卸载时务必遍历 unmount，否则会出现：
         - 定时器 / 事件监听残留
         - Widget DOM 留在 #insight-widget-slot 里
         - 下次进入页面 loadMicroApp 渲染异常 */
      microAppRef.current.forEach((microApp) => microApp?.unmount?.())
      microAppRef.current = []
    }
  }, [selectedCustomerId, setCustomer360Data])

  return (
    <section className="customer360-page">
      {/* 头部介绍卡 + 客户切换下拉：主应用原生内容 */}
      <Card className="stage-intro customer360-intro host-native-content" data-visual-label="主应用原生内容 · 客户360编排页头">
        <div>
          <Tag color="purple">双子应用同屏</Tag>
          <h1>客户360</h1>
          <p>父应用先请求客户主档、授信摘要和风险信号，再把同一份上下文传给两个 Widget。</p>
        </div>
        {/* 切换客户：改 selectedCustomerId，触发上方 useEffect 重新跑 */}
        <Select
          className="customer-switcher"
          onChange={setSelectedCustomerId}
          options={CUSTOMER_OPTIONS}
          value={selectedCustomerId}
        />
      </Card>

      {/* 摘要卡片行：主应用自己先渲染一眼关键信息（即使 Widget 还在加载也有内容） */}
      <Row gutter={[16, 16]} className="customer360-summary">
        <Col xs={24} md={8}>
          <Card className="host-native-content" data-visual-label="主应用原生内容 · 客户摘要">
            <h3>客户名称</h3>
            <p>{customer360Data?.customerName ?? '等待上下文...'}</p>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="host-native-content" data-visual-label="主应用原生内容 · 客户评分">
            <h3>客户评分</h3>
            <p>{customer360Data?.profile?.score ?? '--'}</p>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="host-native-content" data-visual-label="主应用原生内容 · 风险标签">
            <h3>风险标签</h3>
            <p>{customer360Data?.riskSignals?.join(' / ') ?? '等待接口返回'}</p>
          </Card>
        </Col>
      </Row>

      {/* 双子应用插槽网格：左右两列分别对应两个 loadMicroApp 的 container */}
      <div className="customer360-grid">
        {/* 左侧：客户画像 Widget 插槽（绿色可视化边框） */}
        <div className="widget-card host-native-content" data-visual-label="主应用原生内容 · Widget卡片容器">
          {loading ? (
            <div className="stage-loading widget-loading">
              <Spin size="large" />
              <p>正在准备客户画像数据...</p>
            </div>
          ) : null}
          {/* loadMicroApp 挂载点：id 必须和 loadMicroApp.container 参数一致
              绿色虚线边框标识 customer-widget */}
          <div id="insight-widget-slot" className="widget-slot" />
        </div>
        {/* 右侧：风控信息 Widget 插槽（蓝色可视化边框） */}
        <div className="widget-card host-native-content" data-visual-label="主应用原生内容 · Widget卡片容器">
          {loading ? (
            <div className="stage-loading widget-loading">
              <Spin size="large" />
              <p>正在准备风控摘要数据...</p>
            </div>
          ) : null}
          {/* loadMicroApp 挂载点：id 必须和 loadMicroApp.container 参数一致
              浅蓝色虚线边框标识 risk-control-widget */}
          <div id="risk-widget-slot" className="widget-slot" />
        </div>
      </div>
    </section>
  )
}
