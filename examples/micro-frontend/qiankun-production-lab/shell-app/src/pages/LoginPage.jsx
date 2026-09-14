import { Button, Card, Col, Row, Space, Spin, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

import { ROLE_HOME, ROLE_LABELS } from '../config/menuConfig'
import { useAuthStore } from '../store/authStore'

const ROLE_ORDER = [
  'sales_manager',
  'finance_auditor',
  'ops_analyst',
  'platform_admin',
]

export default function LoginPage() {
  const navigate = useNavigate()
  const bootstrapLoading = useAuthStore((state) => state.bootstrapLoading)
  const login = useAuthStore((state) => state.login)
  const prepareRouteData = useAuthStore((state) => state.prepareRouteData)

  const handleLogin = async (role) => {
    const home = await login(role)
    await prepareRouteData(home)
    navigate(ROLE_HOME[role] ?? home, { replace: true })
  }

  return (
    <div className="login-page">
      <Row gutter={[24, 24]} className="login-grid">
        <Col xs={24} lg={14}>
          <div className="login-hero">
            <Typography.Text className="login-kicker">
              Qiankun Production Lab
            </Typography.Text>
            <Typography.Title>集团运营中台登录</Typography.Title>
            <Typography.Paragraph>
              主应用负责登录态、角色、动态菜单、前置业务接口与 qiankun
              注册中心。登录后会先请求用户资料和菜单权限，再进入业务域。
            </Typography.Paragraph>
            <ul className="login-points">
              <li>四种角色快速切换，验证权限边界</li>
              <li>整页子应用与局部 Widget 并存</li>
              <li>业务路由先拿上下文，再挂载微应用</li>
            </ul>
          </div>
        </Col>
        <Col xs={24} lg={10}>
          <Card className="login-card" title="选择角色进入">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              {ROLE_ORDER.map((role) => (
                <Button
                  block
                  key={role}
                  onClick={() => handleLogin(role)}
                  type={role === 'platform_admin' ? 'primary' : 'default'}
                >
                  {ROLE_LABELS[role]}登录
                </Button>
              ))}
              {bootstrapLoading ? (
                <div className="login-loading">
                  <Spin size="small" />
                  <span>正在加载角色资料与菜单...</span>
                </div>
              ) : null}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
