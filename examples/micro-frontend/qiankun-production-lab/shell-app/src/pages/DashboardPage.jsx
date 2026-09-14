import { Card, Col, Row, Statistic, Tag } from 'antd'

import { useAuthStore } from '../store/authStore'

const DASHBOARD_CARDS = [
  { key: 'todo', title: '待办审批', value: 18, suffix: '单' },
  { key: 'notice', title: '集团公告', value: 6, suffix: '条' },
  { key: 'customer', title: '重点客户', value: 42, suffix: '家' },
]

export default function DashboardPage() {
  const role = useAuthStore((state) => state.role)
  const userInfo = useAuthStore((state) => state.userInfo)

  return (
    <section className="dashboard-page">
      <Card className="stage-intro">
        <Tag color="success">主应用原生页</Tag>
        <h1>运营工作台</h1>
        <p>
          当前登录角色为 {userInfo?.roleLabel}，系统会基于
          <code>{role}</code> 动态计算左侧菜单和微应用访问权限。
        </p>
      </Card>

      <Row gutter={[16, 16]}>
        {DASHBOARD_CARDS.map((card) => (
          <Col key={card.key} xs={24} md={8}>
            <Card className="dashboard-card">
              <Statistic
                suffix={card.suffix}
                title={card.title}
                value={card.value}
              />
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="dashboard-card dashboard-story">
        <h2>推荐演示动作</h2>
        <ol>
          <li>用销售经理登录，验证客户中心与运营分析可见。</li>
          <li>切到财务审批，观察越权菜单自动消失。</li>
          <li>进入客户中心，点一条客户跳到客户 360 双 Widget 页面。</li>
        </ol>
      </Card>
    </section>
  )
}
