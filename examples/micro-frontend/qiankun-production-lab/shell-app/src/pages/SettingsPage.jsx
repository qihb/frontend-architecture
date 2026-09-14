import { Card, List, Tag } from 'antd'

export default function SettingsPage() {
  return (
    <section className="settings-page">
      <Card className="stage-intro">
        <Tag color="gold">主应用原生页</Tag>
        <h1>系统设置</h1>
        <p>这里只对平台管理员可见，用来演示主应用原生页和微应用页面并存。</p>
      </Card>

      <Card className="dashboard-card">
        <List
          dataSource={[
            '租户信息：tenant-east',
            '组织信息：org-east-01',
            '子应用策略：整页 + 局部混合挂载',
          ]}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </Card>
    </section>
  )
}
