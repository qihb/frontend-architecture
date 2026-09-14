/* ==========================================================================
 * MicroAppPage：整页子应用的包装页
 * --------------------------------------------------------------------------
 * 【核心职责】
 * 1. 进入路由时触发 prepareRouteData，预取当前业务域的前置上下文
 * 2. 展示子应用介绍卡（Tag + 标题 + 描述）
 * 3. routeLoading = true 时展示 Loading 骨架
 * 4. 等前置数据 + DOM 容器就绪后，调用 remount 触发 qiankun 真正挂载
 *
 * 【反模式警告】
 * 不要在这个组件里放 <div id="micro-app-stage">！
 * 挂载容器必须提升到 PortalLayout 层，避免 singular 模式下组件卸载时
 * qiankun 找不到容器执行 unmount，导致子应用残留。
 * ========================================================================== */
import { Card, Spin, Tag } from 'antd'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

import { ensureQiankunStarted, remountCurrentMicroApp } from '../qiankun/registerApps'
import { useAuthStore } from '../store/authStore'

export default function MicroAppPage({ description, title }) {
  /* 当前路由信息（主要用 pathname 判断是哪个业务域） */
  const location = useLocation()

  /* 前置数据加载状态：true 时展示 Loading，false 时触发子应用挂载 */
  const routeLoading = useAuthStore((state) => state.routeLoading)
  /* 触发业务前置数据预取的 action（内部有缓存，第二次进入直接返回） */
  const prepareRouteData = useAuthStore((state) => state.prepareRouteData)

  /* 用于轮询检查 #micro-app-stage 是否渲染到 DOM 的定时器引用 */
  const remountTimerRef = useRef(0)

  /* ------------------------------------------------------------------
   * Effect 1：路由变化时立即触发前置数据预取
   * （PortalLayout 的 handleMenuClick 也会调一次，但直接敲 URL 进入时
   *   不会走菜单点击，所以这里兜底）
   * ------------------------------------------------------------------ */
  useEffect(() => {
    prepareRouteData(location.pathname)
  }, [location.pathname, prepareRouteData])

  /* ------------------------------------------------------------------
   * Effect 2：前置数据加载完成后，触发 qiankun 启动 + 重挂载
   * - 首次进入页面时先 ensureQiankunStarted（只执行一次副作用）
   * - 检查 #micro-app-stage 是否存在（容器在 PortalLayout，可能稍晚渲染）
   *   不存在就 60ms 轮询，最多 5 次（给 React 渲染留时间）
   * - 容器就绪后调用 remountCurrentMicroApp，让 qiankun 重新执行
   *   路由匹配 → 取最新 buildSharedProps → 调子应用 mount
   * ------------------------------------------------------------------ */
  useEffect(() => {
    /* disposed 标记：组件卸载后不再执行异步回调，防止内存泄漏 */
    let disposed = false

    async function bootstrap() {
      /* 前置数据还没回来 → 先不启动 qiankun，等下一次 routeLoading = false */
      if (routeLoading) {
        return
      }

      /* 幂等：只在首次进入时真正执行 qiankun.start() */
      ensureQiankunStarted()

      /**
       * 轮询检查容器是否存在，存在就触发重挂载
       * @param {number} attempt - 已尝试次数
       */
      const runRemount = (attempt) => {
        if (disposed) {
          return
        }

        const container = document.getElementById('micro-app-stage')
        if (!container) {
          /* 容器还没渲染到 DOM → 间隔 60ms 重试，给 React setState 留时间 */
          if (attempt < 5) {
            remountTimerRef.current = window.setTimeout(() => runRemount(attempt + 1), 60)
          }
          return
        }

        /* 容器就绪 → 触发 qiankun 路由重匹配（此时 props.preloadData 已有值） */
        remountCurrentMicroApp()
      }

      runRemount(0)
    }

    bootstrap()

    return () => {
      disposed = true
      /* 组件卸载时清理未执行的定时器 */
      if (remountTimerRef.current) {
        clearTimeout(remountTimerRef.current)
        remountTimerRef.current = 0
      }
    }
  }, [location.pathname, routeLoading])

  return (
    <section className="micro-app-page">
      {/* 介绍卡：主应用原生内容，蓝色边框标识
          说明当前是哪个子应用、父应用注入了哪些上下文
          Loading 内嵌到卡片底部，避免产生多余的挂载外壳占位
          注意：真正的 #micro-app-stage 容器在 PortalLayout.Content 中 */}
      <Card className="stage-intro host-native-content" data-visual-label="主应用原生内容 · 子应用介绍卡">
        <Tag color="processing">整页子应用</Tag>
        <h1>{title}</h1>
        <p>{description}</p>
        {routeLoading ? (
          <div className="stage-loading stage-loading--inline">
            <Spin size="large" />
            <p>正在请求前置业务上下文，请稍候...</p>
          </div>
        ) : null}
      </Card>
    </section>
  )
}
