import { mockBusinessRequest } from './mockRequest'

export function getAnalyticsBootstrapData(role) {
  return mockBusinessRequest({
    cards: [
      { label: '线索转化率', value: role === 'ops_analyst' ? '36.8%' : '31.4%' },
      { label: '区域 GMV', value: '1260 万' },
      { label: '渠道新增客户', value: '284' },
    ],
    charts: {
      funnel: ['线索', '商机', '报价', '成交'],
      region: ['华东', '华南', '华北'],
      channel: ['直营', '经销', '伙伴'],
    },
  })
}
