import { mockBusinessRequest } from './mockRequest'

export function getCustomerBootstrapData(role) {
  return mockBusinessRequest({
    stats: {
      monthlyNew: role === 'platform_admin' ? 186 : 128,
      focused: role === 'finance_auditor' ? 24 : 42,
      renewal: 9,
    },
    filters: {
      region: '华东',
      focus: role === 'sales_manager' ? '重点客户' : '全部客户',
    },
  })
}

export function getCustomerContext(customerId) {
  return mockBusinessRequest({
    customerId,
    customerName: '华东医械集团',
    profile: {
      level: 'A',
      score: 92,
      tags: ['高潜', '集团客户', '回款稳定'],
      owner: '李晨',
    },
    creditSummary: {
      amount: 860000,
      available: 250000,
      dueDays: 6,
    },
    riskSignals: ['回款波动', '区域授信接近阈值'],
  })
}
